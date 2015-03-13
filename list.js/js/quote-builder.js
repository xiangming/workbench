/**
 * quote builder
 * 
 * Created by arvin@flashbay.com at 2015-03-13
 */
var quote = {
    target: null,
    itemTpl: $('#item-tpl .item-row'),
    // itemTpl: $('<tr data-toggle="context"class="item-row"><td class="editable item"></td><td class="editable quantity"data-pattern="^\\d+$"></td><td class="editable price"data-pattern="^(\\d+)(\\.\\d+)?$"></td><td class="non-editable amount"></td><td class="non-editable taxRate">10%</td><td class="non-editable tax"></td><td class="non-editable gross"></td></tr>'),
    customer_info: null,
    common: {
        init: function(){
            quote.common.sortable();
            quote.common.editable();
            quote.common.contextmenu();
            quote.common.getCustomerInfo();

            /**
             * click Item column
             */
            $(document).on('click', '.item.editable', function(event){
                $('#item-modal').modal();
                var target = $(event.target);

                quote.target = target;
            });

            $.ajax({
                url: 'data/data.json',
                // url: 'http://beta.flashbay.com/item_builder?init=1',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function(response){
                    if (response.success) {
                        var data = response.data;
                        quote.models.init(data);
                        quote.accessories.init(data);
                        quote.services.init(data);

                        //addTarget handle
                        $(document).on('click', '.list .type', function(){
                            quote.common.addTarget(this);
                        });

                        /**
                         * init popover & tooltip
                         */
                        $('[data-toggle="popover"]').popover({
                            placement: 'bottom',
                            trigger: 'focus hover'
                        });
                        $('[data-toggle="tooltip"]').tooltip();
                    } else {
                        alert('Session expired, please reopen with zimbra.')
                    };
                        
                }
            });
        },
        getCustomerInfo: function(){
            $.ajax({
                url: 'data/list_addr.json',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function(response){
                    if (response.success) {
                        quote.customer_info = response.data;
                        return response.data;
                    } else {
                        alert('Can\'t get customer info');
                    };
                }
            });
        },
        updateCustomerInfo: function(id){
            var info = quote.customer_info[id];
            $('#customer_addr').html(info.customer_addr.replace('\n', '<br>'));
            $('#contact_name').html(info.contact_name);
            $('#customer_phone').html(info.customer_phone);
        },
        contextmenu: function(){
            $('[data-toggle="context"]').contextmenu({
                target: '#context-menu',
                onItem: function(context, event) {
                    var action = $(event.target).data('action');
                    switch(action) {
                        case 'add': 
                            $(context).after(quote.itemTpl.clone(true));
                            
                            // init for the new row
                            $('.editable').unbind();
                            quote.common.editable();
                            $('[data-toggle="context"]').unbind();
                            quote.common.contextmenu();

                            break;
                        case 'copy':
                            $(context).after($(context).clone(true));

                            // init for the new row
                            $('.editable').unbind();
                            quote.common.editable();
                            $('[data-toggle="context"]').unbind();
                            quote.common.contextmenu();

                            break;
                        case 'remove':
                            if ($('#items [data-toggle="context"]').length > 1) {
                                $(context).detach();
                            } else {
                                alert('One item at least!');
                            }
                            break;
                        default:
                            // do nothing
                    };
                }
            });
        },
        sortable: function(){
            $( "#items" ).sortable();
            $( "#items" ).disableSelection();
        },
        editable: function(){
            $('.editable').editable({
                className: 'form-control'
            }, function(e){
                var target = e.target;
                var reg = new RegExp(target.data('pattern'));
                if (e.value.match(reg)) {
                    console.log(e.value);
                    if (target.parent('.item-row').length) quote.common.calculate(target);
                    if (target.attr('id') === 'customer_id') quote.common.updateCustomerInfo(e.value);
                } else {
                    console.log(e.value);
                    target.text(e.old_value);
                };
            });
        },
        calculate: function($trigger){
            var $row = $trigger.parent('.item-row');
            var $quantity = $row.children('.quantity');
            var $price = $row.children('.price');
            var $amount = $row.children('.amount');
            var $taxRate = $row.children('.taxRate');
            var $tax = $row.children('.tax');
            var $gross = $row.children('.gross');
            
            // 保留两位小数
            var q = parseInt($quantity.text());
            var p = parseFloat($price.text());
            var a = parseFloat((q*p).toFixed(2));
            var tr = parseFloat($taxRate.text())/100;
            var t = parseFloat((tr*a).toFixed(2));
            var g = (a + t).toFixed(2);
            
            $amount.html(a?a:'');
            $tax.html(t?t:'');
            $gross.html(g?g:'');
        },
        addTarget: function(elem){
            var $elem    = $(elem);
            var type     = $elem.text();
            var usb      = $elem.parent('td').siblings('.usb').text();
            var capacity = $elem.parent('td').siblings('.capacity').text();
            var color    = $elem.parent('td').siblings('.color').text();

            usb = usb ? '.'+usb : '';
            capacity = capacity ? '.'+capacity : '';
            color = color ? '.'+color : '';

            $(quote.target).text(type+usb+capacity+color);

            $('#item-modal').modal('hide');
        },
        getColors: function(a, t){
            var results = [];
            for (var i = 0, l = a.length; i < l; i++) {
                results.push(t[a[i]]);
            };
            return results;
        },
        getColorOptions: function($o, t){
            for ( i in t) {
                var color = t[i];
                $o.append('<option value="'+ color +'">'+ color +'</option>');
            }
        }
    },
    models: {
        init: function(obj){
            var models = obj.models || {};
            var translations = obj.translations || {};

            quote.common.getColorOptions($('#model-color'), translations);

            // list.js
            var options = quote.models.options;
            var values = [];
            $.each( models, function(i, v){
                var type       = v.name;
                var priceRange = quote.models.getPriceRange(v.prices);
                var capacities = v.capacities;
                var colors     = quote.common.getColors(v.colors, translations);

                // 生成filter
                $('#model-type').append('<option value="'+ type +'">'+ type +'</option>');

                // 遍历USB
                for ( u in capacities) {
                    var capacity = capacities[u];
                    if (!!capacity[0]) {
                        // 遍历capacity
                        for ( ca in capacity ) {
                            // 遍历colors
                            for ( co in colors) {
                                values.push({type: type, usb: u, capacity: capacity[ca], color: colors[co], price: priceRange});
                            }
                        }
                    }
                }
            });
            var modelList = new List('model', options, values);

            // filters for models
            $('#model select').change(function () {
                var type     = $('#model-type').val();
                var usb      = $('#model-usb').val();
                var capacity = $('#model-capacity').val();
                var color    = $('#model-color').val();

                // filter items in the list
                modelList.filter(function (item) {
                    if ((item.values().type == type || type == 'all') && (item.values().usb == usb || usb == 'all') && (item.values().capacity == capacity || capacity == 'all') && (item.values().color == color || color == 'all')) {
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        },
        getPriceRange: function(o){
            var o = o || {};
            return (o.min && o.min.formatted) + ' ~ ' + (o.max && o.max.formatted);
            // return (o.min && o.min.formatted) + ' ~ ' + (o.max && o.max.formatted) + '<a tabindex="0" role="button" data-toggle="popover" title="Price Table" data-content="Price Table"> <i class="glyphicon glyphicon-question-sign"></i></a>';
        },
        getPriceTable: function(){

        },
        options: {
            valueNames: ['type', 'usb', 'capacity', 'color', 'price']
        }
    },
    accessories: {
        init: function(obj){
            var accessories = obj.accessories || {};
            var translations = obj.translations || {};

            quote.common.getColorOptions($('#accessory-color'), translations);

            var options = quote.accessories.options;
            
            var values = [];
            $.each( accessories, function(i, v){
                var type = v.name;
                var price = v.price.formatted;
                var colors = quote.common.getColors(v.colors, translations);

                // 生成filter
                $('#accessory-type').append('<option value="'+ type +'">'+ type +'</option>');

                // 遍历colors
                for ( co in colors) {
                    values.push({type: type, color: colors[co], price: price});
                }
            });

            var accessoryList = new List('accessory', options, values);

            // filters for accessories
            $('#accessory select').change(function () {
                var type = $('#accessory-type').val();
                var color = $('#accessory-color').val();

                // filter items in the list
                accessoryList.filter(function (item) {
                    if ((item.values().type == type || type == 'all') && (item.values().color == color || color == 'all')) {
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        },
        options: {
            valueNames: ['type', 'color', 'price']
        }
    },
    services: {
        init: function(obj){
            var services = obj.services || {};
            var translations = obj.translations || {};

            var options = quote.services.options;

            var values = [];
            $.each( services, function(i, v){
                var type = v.name;
                var price = v.price.formatted;

                // 生成filter
                $('#service-type').append('<option value="'+ type +'">'+ type +'</option>');

                values.push({type: type, price: price});
            });

            var serviceList = new List('service', options, values);
        },
        options: {
            valueNames: ['type', 'price']
        }
    }
};