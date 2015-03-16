/**
 * quote builder
 * 
 * Created by arvin@flashbay.com at 2015-03-13
 */
var quote = {
    target: null,
    itemTpl: $('#item-tpl .item-row'),
    common: {
        init: function(){
            quote.common.sortable();
            quote.common.editable();
            //quote.common.contextmenu();

            /**
             * operations of item builder
             */
            $(document).on('click', '#items .operations .glyphicon', function(event){
                var $target = $(event.target);
                var $row = $target.closest('.item-row');
                var action = $target.data('action');
                switch(action) {
                    case 'add': 
                        $row.after(quote.itemTpl.clone(true));
                        break;
                    case 'copy':
                        $row.after($row.clone(true));
                        break;
                    case 'remove':
                        if ($('#items .item-row').length > 1) {
                            $row.detach();
                        } else {
                            alert('One item at least!');
                        }
                        break;
                    default:
                        // do nothing
                };
            });

            /**
             * init popover & tooltip
             */
            $('[data-toggle="popover"]').popover({
                placement: 'bottom',
                trigger: 'focus hover'
            });
            $('[data-toggle="tooltip"]').tooltip();
        },
        // contextmenu: function(){
        //     $('[data-toggle="context"]').contextmenu({
        //         target: '#context-menu',
        //         onItem: function(context, event) {
        //             var action = $(event.target).data('action');
        //             switch(action) {
        //                 case 'add': 
        //                     $(context).after(quote.itemTpl.clone(true));
                            
        //                     // init for the new row
        //                     $('.editable').unbind();
        //                     quote.common.editable();
        //                     $('[data-toggle="context"]').unbind();
        //                     quote.common.contextmenu();

        //                     break;
        //                 case 'copy':
        //                     $(context).after($(context).clone(true));

        //                     // init for the new row
        //                     $('.editable').unbind();
        //                     quote.common.editable();
        //                     $('[data-toggle="context"]').unbind();
        //                     quote.common.contextmenu();

        //                     break;
        //                 case 'remove':
        //                     if ($('#items [data-toggle="context"]').length > 1) {
        //                         $(context).detach();
        //                     } else {
        //                         alert('One item at least!');
        //                     }
        //                     break;
        //                 default:
        //                     // do nothing
        //             };
        //         }
        //     });
        // },
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
                    //console.log(e.value);
                    //quote.common.calculate(target);
                } else {
                    //console.log(e.value);
                    target.text(e.old_value);
                };
            });
        },
        // calculate: function($trigger){
        //     var $row = $trigger.parent('.item-row');
        //     var $quantity = $row.children('.quantity');
        //     var $price = $row.children('.price');
        //     var $amount = $row.children('.amount');
        //     var $taxRate = $row.children('.taxRate');
        //     var $tax = $row.children('.tax');
        //     var $gross = $row.children('.gross');
            
        //     // 保留两位小数
        //     var q = parseInt($quantity.text());
        //     var p = parseFloat($price.text());
        //     var a = parseFloat((q*p).toFixed(2));
        //     var tr = parseFloat($taxRate.text())/100;
        //     var t = parseFloat((tr*a).toFixed(2));
        //     var g = (a + t).toFixed(2);
            
        //     $amount.html(a?a:'');
        //     $tax.html(t?t:'');
        //     $gross.html(g?g:'');
        // },
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