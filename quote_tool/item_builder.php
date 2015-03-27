<?php
if (!defined ('FB_SITE')) die ('Access denied.');

define ('TL_PL_PRICE_LEVELS', 'pl_price_levels');
define ('TL_EXCHANGE_RATES', 'exchange_rates');
define ('TL_TRANSLATIONS', 'translations');
define ('TL_CUSTOMERS', 'master_customers');
define ('TL_CONTACTS', 'master_contacts');

define ('TL_PRODUCTS', 'products');
define ('TL_ACCESSORYS', 'accessories');
define ('TL_SERVICES', 'services');

error_reporting (0);

function initCustomerInfo (&$customerInfo)
{
    $customerInfo =
        array (
            'customer_id' => '', 'customer_addr' => '', 'customer_name' => '', 'customer_contact' => '',
            'customer_currency' => PriceList :: $defaultCurrency, 'customer_phone'=> '', 'customer_language' => 'us',
            'customer_email' => '', 'customer_level' => 14,
    );
    return $customerInfo;
}

function getCustomerInfoById ($customerID)
{
    $defaultCustomerInfo = array ();
    $customerInst = Customer :: getById (intval ($customerID));
    if ($customerInst) {
        $territoryInst = Territory :: fromAlpha2 ($customerInst->countryCode);
        $defaultAddr   = $customerInst -> getDefaultAddress ('billing');
        $contactInsts  = $customerInst -> getContacts ();
        $defaultContact= $contactInsts ? end ($contactInsts) : false;
        $allPriceLevels= getAllPriceLevels ();
        $defaultCustomerInfo =
            array (
                'customer_id'   => intval ($customerID),
                'customer_addr' => $defaultAddr ? $defaultAddr -> __toString () : '',
                'customer_name' => $customerInst->realName ? : $customerInst->name,
                'customer_contact'=> $defaultContact ? $defaultContact->firstName . ' ' . $defaultContact->lastName : $customerInst->realName,
                'customer_phone'=> $defaultContact ? $defaultContact->phone : $customerInst->phone,
                'customer_email'=> $customerInst->email,
                'customer_level'   => array_search ($customerInst -> getPriceLevel (), $allPriceLevels),
                'customer_currency'=> $customerInst->currency,
                'customer_country' => $customerInst->countryCode,
                'customer_language'=> strtolower ($customerInst->countryCode),
        );
    }
    return $defaultCustomerInfo;
}

function getAllPriceLevels ()
{
    static $priceLevels = array ();

    if (!empty ($priceLevels)) return $priceLevels;
    $sql = 'SELECT level, name FROM ' . TL_PL_PRICE_LEVELS . ' ORDER BY level';
    $priceLevels = Db :: getDb(FB_DEV_DB) -> getAssoc ($sql, 'level');
    return $priceLevels;
}

function getAllCurrencies ()
{
    static $currenciesSupported = array ();

    if (!empty ($currenciesSupported)) return $currenciesSupported;
    $sql = 'SHOW COLUMNS FROM ' . TL_EXCHANGE_RATES . ' WHERE Field NOT IN (\'RateID\', \'Date\')';
    $currenciesSupported = Db :: getDb () -> getAssoc ($sql);
    if ($currenciesSupported) {
        foreach (array_keys ($currenciesSupported) as $_v) {
            $currenciesSupported[$_v] = $_v;
        }
    }
    return $currenciesSupported ? : array ();
}

function getAllLanguages ()
{
    static $languagesSupported = array ();

    if (!empty ($languagesSupported)) return $languagesSupported;
    $sql = 'SHOW COLUMNS FROM ' . TL_TRANSLATIONS . ' WHERE length(Field) = 2'; 
    $languagesSupported = Db :: getDb () -> getAssoc ($sql);
    if ($languagesSupported) {
        foreach (array_keys ($languagesSupported) as $_v) {
            $languagesSupported[($_v)] = ($_v);
        }
    }
    return $languagesSupported;
}

function parseCustomerInfo ($POST, &$error)
{
    $error = array ();
    initCustomerInfo ($customerInfo);
    foreach ($customerInfo as $_k => &$_v) {

        switch ($_k) {
        case 'customer_name':
        case 'customer_addr':
        case 'customer_contact':
            if (!empty ($POST[$_k])) $_v = strip_tags ($POST[$_k]);
            else array_push ($error, $_k);
            break;
        case 'customer_currency':
            $currencies = getAllCurrencies ();
            if (!empty ($POST[$_k]) && !empty ($currencies[$POST[$_k]])) {
                $_v = $POST[$_k];
            } else array_push ($error, $_k);
            break;
        case 'customer_language':
            $languages = getAllLanguages ();
            if (!empty ($POST[$_k]) && !empty ($languages[$POST[$_k]])) {
                $_v = $POST[$_k];
            } else array_push ($error, $_k);
            break;
        case 'customer_email':
            if (!empty ($POST[$_k]) && filter_var ($POST[$_k], FILTER_VALIDATE_EMAIL)) {
                $_v = $POST[$_k];
            } else array_push ($error, $_k);
            break;
        case 'customer_level':
            $levels = getAllPriceLevels ();
            if (isset ($POST[$_k]) && isset ($levels[$POST[$_k]])) {
                $_v = $POST[$_k];
            } else array_push ($error, $_k);
            break;
        }
    }
    if (!empty ($error)) return false;
    else return $customerInfo;
}

function isCompoundValid ($code, $type)
{
    static $models      = array ();
    static $accessories = array ();
    static $services    = array ();

    if (QuoteFormItem :: TYPE_MODEL == $type) {//model
        if (empty ($models)) {
            $sql = 'SELECT item_code FROM ' . TL_PRODUCTS . ' WHERE active=\'yes\' AND category != \'_NAME_SOLID_STATE_DRIVE\'';
            $models = Db :: getDb () -> getAssoc ($sql);
        }
        return isset ($models[$code]);
    } elseif (QuoteFormItem :: TYPE_ACCESSORY == $type) {//accessory
        if (empty ($accessories)) {
            $sql = 'SELECT item_code FROM ' . TL_ACCESSORYS . ' WHERE active=\'yes\'';
            $accessories = Db :: getDb () -> getAssoc ($sql);
            return isset ($accessories[$code]);
        }
    } elseif (QuoteFormItem :: TYPE_SERVICE == $type) {//service
        if (empty ($services)) {
            $sql = 'SELECT item_code FROM ' . TL_SERVICES . ' WHERE active=\'yes\'';
            $services = Db :: getDb () -> getAssoc ($sql);
            return isset ($services[$code]);
        }
    }
    return false;
}

function parseItems ($POST, &$error)
{
    $error = array ();
    $itemAttrs   = array ('code', 'unitPrice', 'taxRate', 'qty');
    $itemExtAttrs= array ('interface', 'capacity', 'color');

    $items = array ();
    if (isset ($POST['items']) && is_array ($POST['items'])) {
        foreach ($POST['items'] as $_index => $_item) {
            $isOK = true;
            if (is_array ($_item)) {
                if (!isset ($_item['type'])
                    || !in_array ($_item['type'], array (QuoteFormItem :: TYPE_MODEL, QuoteFormItem :: TYPE_ACCESSORY, QuoteFormItem :: TYPE_SERVICE))) {
                    $error[$_index][] = 'type';
                    $isOK = false;
                }
                foreach ($itemAttrs as $_attr) {//common attr
                    if (!isset ($_item[$_attr])) {
                        $error[$_index][] = $_attr;
                        $isOK = false;
                    }
                    if ('code' == $_attr) {
                        $isOK = isCompoundValid ($_item['code'], $_item['type']);
                        if (!$isOK && !in_array ($_attr, $error[$_index])) {
                            $error[$_index][] = $_attr;
                        }
                    }
                }
                if (QuoteFormItem :: TYPE_MODEL == $_item['type']) {//extended attr
                    foreach ($itemExtAttrs as $_attr_x) {
                        if (!isset ($_item[$_attr_x])) {
                            $error[$_index][] = $_attr_x;
                            $isOK = false;
                        }
                    }
                }
                if ($isOK) $items[] = $_item;
            } else $isOK = false;
        }
        if (sizeof ($error)) return false;
        return $items;
    }
    return false;
}
//price levels
$priceLevels         = getAllPriceLevels ();
//currencies
$currenciesSupported = getAllCurrencies ();
//languages
$languagesSupported  = getAllLanguages ();

if (isset ($_REQUEST['action']) && 'price' == $_REQUEST['action']) {//get unit price
    $type        = intval (@$_REQUEST['type']);
    $currency    = isset ($_REQUEST['currency']) ? $_REQUEST['currency'] : '';
    $priceLevelID= intval (@$_REQUEST['level']);
    //
    $code        = isset ($_REQUEST['code']) ? $_REQUEST['code'] : '';
    $qty         = intval (@$_REQUEST['qty']);
    $capacity    = isset ($_REQUEST['capacity']) ? $_REQUEST['capacity'] : '';
    $currencyInst = Currency :: getByCode ($currency);
    if (isCompoundValid ($code, $type)
        && !empty ($currencyInst)
        && isset ($priceLevels[$priceLevelID])
        && $qty && $capacity) {
        //
        $options =
            array (
                'customer' => new Customer, 'currency' => $currencyInst,
                'priceLevel' => PriceList :: getPriceLevel ($priceLevels[$priceLevelID]), 'customerVisit' => true
        );
        $priceListInst = new PriceList ($options);
        switch ($type) {
        case QuoteFormItem :: TYPE_MODEL:
            $productInst = Product :: getByItemCode ($code);
            $value = floatval ($priceListInst -> price ($qty, $capacity, $productInst, array ('currency' => $currency)));
            break;
        case QuoteFormItem :: TYPE_ACCESSORY:
            $accessory = Accessory :: getByItemCode ($code);
            $value = floatval ($priceListInst -> smartPrice ($accessory->basePrice));
            break;
        case QuoteFormItem :: TYPE_SERVICE:
            $serviceInst = Solution :: getByItemCode ($code);
            $value = floatval ($priceListInst -> smartPrice ($serviceInst->basePrice));
            break;
        }
        $response= array ('success' => true, 'data' => array ('currency' => $currency, 'value' => $value, 'formatted' => $currencyInst -> symbolFormat ($value)));
    } else {
        $response = array ('success' => false, 'message' => 'Invalid Parameter.');
    }
    exit (json_encode ($response)); 
}
//
if (!strcasecmp ($_SERVER['REQUEST_METHOD'], 'POST')) {//Save items
    $salesEmail = isset ($_REQUEST['sales_email']) ? $_REQUEST['sales_email'] : @$_SESSION['sales_email'];
    if ($salesEmail) $salesPersonInst = new QuoteFormSalesPerson ($salesEmail);
    $customerInfo = parseCustomerInfo ($_REQUEST, $error1);
    $lineItems    = parseItems ($_REQUEST, $error2);

    if (!$salesPersonInst -> getID ()) {
        $response = array ('success' => false, 'message' => 'Session Expired, Please Reopen In Zimbra.');
    } elseif ($customerInfo && $lineItems) {
        //
        $quoteFormCustomerInst = new QuoteFormCustomer ($customerInfo['customer_email']);
        $quoteFormCustomerInst -> setAddress ($customerInfo['customer_addr']);
        $quoteFormCustomerInst -> setName ($customerInfo['customer_name']);
        $quoteFormCustomerInst -> setContact ($customerInfo['customer_contact']);
        $quoteFormCustomerInst -> setCurrency ($customerInfo['customer_currency']);
        $quoteFormCustomerInst -> setPhone ($customerInfo['customer_phone']);
        $quoteFormCustomerInst -> setLanguage ($customerInfo['customer_language']);
        $quoteFormCustomerInst -> setLevel ($customerInfo['customer_level']);
        try {
            $sid = $salesPersonInst -> getID ();
            $cid = $quoteFormCustomerInst -> store ();
            $quoteFormInst =
                new QuoteForm (
                    array (
                        'salesID' => $sid, 'customerID' => $cid, 'currency' => $customerInfo['customer_currency'],
                        'status' => QuoteForm :: ST_DRAFT,
            ));
            foreach ($lineItems as $_item) {
                $itemInst = new QuoteFormItem ($_item);
                $quoteFormInst -> addItem ($itemInst);
            }
            $formID = $quoteFormInst -> store ();
            foreach ($quoteFormInst -> getItems () as $_itemInst) {
                $_itemInst -> setFormID ($formID);
                $_itemInst -> store ();
            }

            $response = array ('success' => true, 'data' => $formID);
        } catch (\Exception $e) {
            //log
            $response = array ('success' => false, 'message' => $e -> getMessage ());
        }

    } else {
        $response = array ('success' => false, 'message' => 'One or more fields invalid', 'data' => array_merge ($error1, $error2));
    }
    echo json_encode ($response); exit;
}
if (isset ($_REQUEST['form_id'])) {//PDF
    $quoteFormInst = new QuoteForm (null, intval ($_REQUEST['form_id']));
    if (!$quoteFormInst -> getID ()) die ('Form not found');
    //Sales Person
    $quoteFormSalesInst   = new QuoteFormSalesPerson ($email = null, $quoteFormInst -> getSalesID ());
    $quoteFormCustomerInst= new QuoteFormCustomer ($email = null, $quoteFormInst -> getCustomerID ());
    //
    $translatorInst       = new Translator ($quoteFormCustomerInst -> getLanguage ());
    $currencyInst         = Currency :: getByCode  ($quoteFormInst -> getCurrency ());

    $quoteFormInst -> setStatus (QuoteForm :: ST_GENERATED);
    $quoteFormInst -> store ();

    include dirname (__FILE__) . DIRECTORY_SEPARATOR . 'pdf.phtml';
    exit;

} elseif (isset ($_REQUEST['customer_email'])) {//Edit
    if (empty ($_REQUEST['sales_email']) || !filter_var ($_REQUEST['sales_email'], FILTER_VALIDATE_EMAIL)) die ('Lack of sales_email');
    $_SESSION['sales_email'] = $_REQUEST['sales_email'];
    $customerInfo = array ();
    initCustomerInfo ($customerInfo);
    $customerInfo['customer_email'] = $_REQUEST['customer_email'];
    $candidateCustomerInfos = array ();
    //look up quoting history first
    $lastCustomerInst = QuoteFormCustomer :: getLatestByEmail ($_REQUEST['customer_email']);
    if (!empty ($lastCustomerInst)) {
        $quoteFormInst = QuoteFormCustomer :: getLatestQuoteByEmail ($_REQUEST['customer_email']);
        $customerInfo =
            array (
                'customer_id'  => '',
                'customer_addr'=> $lastCustomerInst -> getAddress (),
                'customer_name' => $lastCustomerInst -> getName (),
                'customer_contact'  => $lastCustomerInst -> getContact (),
                'customer_phone' => $lastCustomerInst -> getPhone (),
                'customer_language'=> $lastCustomerInst -> getLanguage (),
                'customer_email' => $lastCustomerInst -> getEmail (),
                'customer_level' => $lastCustomerInst -> getLevel (),
                'customer_currency' => $quoteFormInst ? $quoteFormInst -> getCurrency () : PriceList :: $defaultCurrency,
        );
    } else {//look up customer history
        $sql = sprintf ('SELECT internalID FROM ' . TL_CUSTOMERS . ' WHERE email = \'%s\'', Db :: getDb () -> quote ($_REQUEST['customer_email']));
        $candidateCustomerInsts = Db :: getDb (FB_DATA_DB) -> getAll ($sql, 'Customer');
        if (!empty ($candidateCustomerInsts)) {
            foreach ($candidateCustomerInsts as $_customerInst) {
                $candidateCustomerInfos[$_customerInst->internalID] = getCustomerInfoById ($_customerInst->internalID);
            }
        } else {
            $sql = sprintf ('SELECT * FROM ' . TL_CONTACTS . ' WHERE email=\'%s\'', Db :: getDb () -> quote ($_REQUEST['customer_email']));
            $contactInfo = Db :: getDb (FB_DATA_DB) -> getAll ($sql);
            foreach ($contactInfo as $_contact) {
                $candidateCustomerInfos[$_contact->companyID] = getCustomerInfoById ($_contact->companyID);
                $candidateCustomerInfos[$_contact->companyID]['customer_contact'] = $_contact->firstName . ' ' . $_contact->lastName;
            }
        }
        if (1 == sizeof ($candidateCustomerInfos)) {//Only one customer
            $customerInfo = array_merge ($customerInfo, current ($candidateCustomerInfos));
        }
    }
    $customerInfo['customer_language'] = 'us';
    $translatorInst = new Translator ($customerInfo['customer_language']);
    $allActiveProducts= Product :: getCategory ('memory', 'position', 'active like \'yes%\'');
    $jsonProductsInfo = array ();
    $translationsTxt  = array ();
    //
    foreach ($allActiveProducts as $_product) {
        $_productItem = array ('id' => $_product->id, 'item_code' => $_product->item_code, 'name' => $_product->name, 'moq' => $_product->moq);
        $_productItem['capacities'] =
            array (
                'USB2.0' => $_product -> getAvailableCapacities (2),
        );
        $USB3 = $_product -> getAvailableCapacities (3);
        if (!empty ($USB3)) {
            $_productItem['capacities']['USB3.0'] = $USB3;
        }

        $_productItem['accessories'] = explode (',', trim ($_product->accessories, ', '));
        $_productItem['services']    = explode (',', trim ($_product->solutions, ', '));
        $_productItem['colors']      = explode (',', trim ($_product->colours, ', '));

        $translationsTxt += array_fill_keys ($_productItem['colors'], '');
        $jsonProductsInfo[$_product->item_code] = $_productItem;
    }
    //
    $allAccessories = Accessory :: getActive ();
    $jsonAccessoriesInfo = array ();
    foreach ($allAccessories as $_accessory) {
        $_accessoryItem = array ('id' => $_accessory->id, 'item_code' => $_accessory->item_code, 'name' => $_accessory->name);
        $_accessoryItem['colors'] = explode (',', trim ($_accessory->colours, ', '));

        $translationsTxt += array_fill_keys ($_accessoryItem['colors'], '');
        $jsonAccessoriesInfo[$_accessory->item_code] = $_accessoryItem;
    }
    //
    $allServices = Solution :: getActive ();
    $jsonServicesInfo = array ();
    foreach ($allServices as $_service) {
        $jsonServicesInfo[$_service->item_code] = 
            array ('name'     => $_service->name, 'item_code' => $_service->item_code,
                   'priceType'=> $_service->priceType,
        );
        //
        $translationsTxt += array_fill_keys (array ($_service->name), '');
    }
    //
    foreach ($translationsTxt as $_k => &$_v) {
        $_v = $translatorInst -> getTranslationByName ($_k);
    }
    unset ($_v);

    $json = array (QuoteFormItem :: TYPE_MODEL     => $jsonProductsInfo,
                   QuoteFormItem :: TYPE_ACCESSORY => $jsonAccessoriesInfo,
                   QuoteFormItem :: TYPE_SERVICE => $jsonServicesInfo,
                   'translations'=> $translationsTxt,
    );
    //
    include dirname (__FILE__) . DIRECTORY_SEPARATOR . 'index.phtml';
    exit;
}
