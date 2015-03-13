<?php
if (!defined ('FB_SITE')) die ('Access denied.');
define ('LIFE_TIME', 86400);
define ('TABLE_PL_PRICE_LEVEL', 'pl_price_levels');
define ('TABLE_EXCHANGE_RATES', 'exchange_rates');
define ('TABLE_TRANSLATIONS', 'translations');

error_reporting (E_ERROR | E_WARNING);
global $salesPersonInfo, $customerInfo;

register_shutdown_function (function () {
    global $salesPersonInfo, $customerInfo;

    $_SESSION['sales_info']    = $salesPersonInfo;
    $_SESSION['customer_info'] = $customerInfo;
});
$sid = session_id ();
//Sales Person
$salesPersonInfo = isset ($_SESSION['sales_info']) ? $_SESSION['sales_info'] : array ();
if (isset ($_REQUEST['sales_email']) && filter_var ($_REQUEST['sales_email'], FILTER_VALIDATE_EMAIL)) {
    $employeeInst   = Employee :: fromEmail ($_REQUEST['sales_email']);
    if ($employeeInst) {
        $defaultSalesPersonInfo =
            array (
                'company_addr'=> '',
                'creator'     => $employeeInst -> getName (),
                'sales_phone' => $employeeInst -> getExtension (),
                'sales_email' => $employeeInst->email,
                'created_date'=> date ('m/d/Y'),
        );
        $salesPersonInfo = array_merge ($salesPersonInfo, $defaultSalesPersonInfo);
    }
}//Cache :: fetch ('sales_info', $success)) && $success)
if (empty ($salesPersonInfo)) die ('Session expired, please reopen with zimbra.');

//Customer info
$customerInfo = isset ($_SESSION['customer_info']) ? $_SESSION['customer_info'] : array ();
if (isset ($_REQUEST['customer_id'])) {
    $customerInst = Customer :: getById ($_REQUEST['customer_id']);
    if ($customerInst) {
        $territoryInst = Territory :: fromAlpha2 ($customerInst->countryCode);
        $defaultCustomerInfo =
            array (
                'customer_id'   => $customerInst->internalID,
                'customer_phone'=> $customerInst->phone,
                'customer_email'=> $customerInst->email,
                'price_level'   => $customerInst -> getPriceLevel (),
                'currency'      => $customerInst->currency,
                'country'       => $customerInst->countryCode,
                'language'      => $customerInst->countryCode,
        );
        $customerInfo = array_merge ($customerInfo, $defaultCustomerInfo);
    }
} elseif (!empty ($_REQUEST['customer_email']) && filter_var ($_REQUEST['customer_email'], FILTER_VALIDATE_EMAIL)) {
    $customerInfo['customer_email'] = $_REQUEST['customer_email'];
}
if (!empty ($customerInfo['customer_id']) && (empty ($customerInst) || !$customerInst instanceof Customer)) {
    $customerInst = Customer :: getById ($customerInfo['customer_id']);
}

$currency  = !empty ($customerInfo['currency']) ? $customerInfo['currency'] : PriceList :: $defaultCurrency;
$customerInfo['currency'] = $currency;
$priceLevel= !empty ($customerInfo['price_level']) ? $customerInfo['price_level'] : PriceList :: $defaultPriceLevel;
$customerInfo['price_level'] = $priceLevel;
$translatorInst = new Translator (empty ($customerInfo['country']) ? 'us' : $customerInfo['country']);

$currencyInst = Currency :: getByCode ($currency);
//
$options = array ('customer' => new Customer, 'currency' => $currencyInst, 'priceLevel' => PriceList :: getPriceLevel ($priceLevel), 'customerVisit' => true);
$priceListInst = new PriceList ($options);
//$availQty = $priceListInst -> getAllVols ();
$availQty = $priceListInst -> getDefaultVols ();

//
$itemBuilderInst = isset ($_SESSION['item_builder']) ? $_SESSION['item_builder'] : new LineItemBuilder ($currency, $priceLevel);
if (!empty ($_REQUEST['action'])) {
    //
    $response = array ('success' => true, 'data' => array ());
    switch ($_REQUEST['action']) {
    case 'get_proofs':
        if ($customerInst instanceof Customer) {
            $proofs = $customerInst -> getProofs (true, @$_REQUEST['product_code']);
            $response['data'] = $proofs;
        }
    case 'update_contact':
        foreach ($_REQUEST as $_key => $_val) {
            if (isset ($salesPersonInfo[$_key])) {
                $salesPersonInfo[$_key] = $_val;
            } elseif (isset ($customerInfo[$_key])) {
                $customerInfo[$_key] = $_val;
            }
        }
        break;
    case 'add_item':
        $itemBuilderInst -> addItem ($_REQUEST, $success);
        if ($success) {
            $response = array ('success' => true);
        } else {
            $response = array ('success' => false, 'message' => 'Parameter invalid');
        }
        break;
    case 'remove_item':
        if (isset ($_REQUEST['index'])) {
            foreach ((array)$_REQUEST['index'] as $_index) {
                $itemBuilderInst -> removeItem (intval ($_index));
            }
        }
        break;
    case 'price_table':
        if (!empty ($_REQUEST['product_code'])) {
           $productInst = Product :: getByItemCode ($_REQUEST['product_code']); 
           $data = array ();
           if ($productInst instanceof Product) {
               $availCapacities = $productInst -> getAvailableCapacities (2);
               //  
               foreach ($availQty as $_qty) {
                   foreach ($availCapacities as $_capacity) {
                       $_value = floatval ($priceListInst -> price ($_qty, $_capacity, $productInst, array ('currency' => $currency)));
                       $data[$_qty][$_capacity] = 
                           array (
                               'currency' => $currency,
                               'value'    => $_value,
                               'formatted'=> $currencyInst -> symbolFormat ($_value),

                       );
                   }
               }
               $response['data'] = array ($_REQUEST['product_code'] => $data);
           } else {
               $response = array ('success' => false, 'message' => 'Parameter invalid.');
           }
        }
        break;
    case 'list_addr':
        $addresses = $contactNames = $phones = array ();
        $candidateCustomerInsts = array ();
        if ($customerInst instanceof Customer) {
            $candidateCustomerInsts = array ($customerInst);
        } elseif (isset ($customerInfo['customer_email'])) {
            $candidateCustomerInsts = Customer :: fromEmail ($customerInfo['customer_email']);
        }
        foreach ($candidateCustomerInsts as $_customerInst) {
            if ($addressInst = $_customerInst -> getDefaultAddress ('shipping')) {
                array_push ($addresses, $addressInst->__toString ());
            }
            if ($allContactInst = $_customerInst -> getContacts ()) {
                foreach ($allContactInst as $_contact) {
                    if ($name = $_contact->firstName . ' ' . $_contact->lastName) {
                    array_push ($contactNames, $name);
                    }
                    if (!empty ($_contact->phone)) {
                        array_push ($phones, $_contact->phone);
                    }
                }
            }
        }
        $response['data'] =
            array (
                'customer_addrs' => $addresses,
                'contact_names'  => $contactNames,
                'customer_phone' => $phones,
        );
        break;
    case 'save':
        break;
    case 'print':
        break;
    default:
        break;
    }
    echo json_encode ($response); exit;
} elseif (isset ($_REQUEST['init'])) {
    //
    $allActiveProducts= Product :: getActive ();
    $jsonProductsInfo = array ();
    $translationsTxt  = array ();

    //
    foreach ($allActiveProducts as $_product) {
        $_productItem = array ('id' => $_product->id, 'item_code' => $_product->item_code, 'name' => $_product->name, 'moq' => $_product->moq);
        $_productItem['capacities'] = array ('USB2.0' => $_product -> getAvailableCapacities (2),
                                             'USB3.0' => $_product -> getAvailableCapacities (3),
        );

        $_productItem['accessories'] = explode (',', trim ($_product->accessories, ', '));
        $_productItem['services']    = explode (',', trim ($_product->solutions, ', '));
        $_productItem['colors']      = explode (',', trim ($_product->colours, ', '));

        $_minCapacity = current ($_productItem['capacities']['USB2.0']);
        $_maxCapacity = end ($_productItem['capacities']['USB2.0']);
        $minPrice = floatval ($priceListInst -> price (max ($availQty), $_minCapacity, $_product, array ('currency' => $currency)));
        $maxPrice = floatval ($priceListInst -> price ($_product->moq, $_maxCapacity, $_product, array ('currency' => $currency)));
        $_productItem['prices']  = array ('min' =>
                                              array ('currency' => $currency,
                                                     'value'    => $minPrice,
                                                     'formatted' => $currencyInst -> symbolFormat ($minPrice),
                                              ),
                                          'max' =>
                                              array ('currency' => $currency,
                                                     'value'    => $maxPrice,
                                                     'formatted' => $currencyInst -> symbolFormat ($maxPrice),
                                          ),
        );

        $translationsTxt += array_fill_keys ($_productItem['colors'], '');
        $jsonProductsInfo[$_product->item_code] = $_productItem;
    }
    //
    $allAccessories = Accessory :: getActive ();
    $jsonAccessoriesInfo = array ();
    foreach ($allAccessories as $_accessory) {
        $_accessoryItem = array ('id' => $_accessory->id, 'item_code' => $_accessory->item_code, 'name' => $_accessory->name);
        $_accessoryItem['colors'] = explode (',', trim ($_accessory->colours, ', '));
        $_priceVal = floatval ($priceListInst -> smartPrice ($_accessory->basePrice));
        $_accessoryItem['price']  = array ('currency' => $currency,
                                           'value'    => $_priceVal,
                                           'fomated'  => $currencyInst -> symbolFormat ($_priceVal),

        );

        $translationsTxt += array_fill_keys ($_accessoryItem['colors'], '');
        $jsonAccessoriesInfo[$_accessory->item_code] = $_accessoryItem;
    }
    //
    $allServices = Solution :: getActive ();
    $jsonServicesInfo = array ();
    foreach ($allServices as $_service) {
        $_priceVal = floatval ($priceListInst -> smartPrice ($_service->basePrice));
        $jsonServicesInfo[$_service->item_code] = 
            array ('name'     => $_service->name, 'item_code' => $_service->item_code,
                   'priceType'=> $_service->priceType,
                   'price'=>
                       array('currency' => $currency,
                             'value'    => $_priceVal,
                             'formated' => $currencyInst -> symbolFormat ($_priceVal),
                    ),
        );
        //
        $translationsTxt += array_fill_keys (array ($_service->name), '');
    }
    //
    foreach ($translationsTxt as $_k => &$_v) {
        $_v = $translatorInst -> getTranslationByName ($_k);
    }
    unset ($_v);

    $json = array ('models'      => $jsonProductsInfo,
                   'accessories' => $jsonAccessoriesInfo,
                   'services'    => $jsonServicesInfo,
                   'translations'=> $translationsTxt,
    );

    echo json_encode ($json); exit;
}
//price levels
$sql = 'SELECT level, name FROM ' . TABLE_PL_PRICE_LEVEL . ' ORDER BY level';
$_priceLevels = Db :: getDb(FB_DEV_DB) -> getAssoc ($sql, 'level');
$priceLevels  = array ();
if ($_priceLevels) {
    foreach ($_priceLevels as $_id => $_v) {
        $priceLevels[$_v] = $_v;
    }
}
//currencies
$sql = 'SHOW COLUMNS FROM ' . TABLE_EXCHANGE_RATES . ' WHERE Field NOT IN (\'RateID\', \'Date\')';
$currenciesSupported = Db :: getDb () -> getAssoc ($sql);
if ($currenciesSupported) {
    foreach (array_keys ($currenciesSupported) as $_v) {
        $currenciesSupported[$_v] = $_v;
    }
}
//languages
$sql = 'SHOW COLUMNS FROM ' . TABLE_TRANSLATIONS . ' WHERE length(Field) = 2'; 
$languagesSupported = Db :: getDb () -> getAssoc ($sql);
if ($languagesSupported) {
    foreach (array_keys ($languagesSupported) as $_v) {
        $languagesSupported[$_v] = $_v;
    }
}
//
include dirname (__FILE__) . DIRECTORY_SEPARATOR . 'index.phtml';
