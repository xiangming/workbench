(function($) {
    var defaults = {
        action: 'click',
        type: 'input',
        className: '',
        choice: {}
    };
    var escape_html = function(str) {
            return str.replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
        };
    var unescape_html = function(str) {
            return str.replace(/&lt;/gm, '<').replace(/&gt;/gm, '>');
        };

    $.fn.editable = function(options, callback) {

        return this.each(function(){
            $this = $(this);
            var settings = $.extend({}, defaults, $this.data(), typeof options == 'object' && options);
            if (typeof callback !== 'function') callback = function() {};
            var trigger = settings.trigger || $this;
            if (typeof trigger === 'string') trigger = $(trigger);
            var action = settings.action;
            var type = settings.type;
            var className = settings.className;
            var choice = settings.choice;

            var target = $this;
            var edit = {};

            edit.start = function(e) {
                trigger.unbind(action === 'clickhold' ? 'mousedown' : action);
                if (trigger !== target) trigger.hide();
                var old_value = (type === 'textarea' ? target.html().replace(/<br( \/)?>/gm, '\n').replace(/&gt;/gm, '>').replace(/&lt;/gm, '<') : target.text()).replace(/^\s+/, '').replace(/\s+$/, '');

                var input = null;
                if (type === 'select') {
                    input = $('<select class="'+className+'">');
                    var data = choice;
                    for(i in data) {
                        var value = data[i];
                        input.append('<option value="'+ i +'">'+ value +'</option>');
                    }
                } else if(type === 'textarea'){
                    input = $('<textarea class="'+className+'">');
                } else {
                    input = $('<input class="'+className+'">');
                };

                input.val(old_value)
                //.css('width', type === 'textarea' ? '100%' : target.width())
                //.css('font-size', '100%')
                //.css('margin', 0)
                .attr('id', 'editable_' + (new Date() * 1))
                .addClass('editable');

                if (type === 'textarea') input.css('height', target.height());

                var finish = function() {
                    var result = input.val() && input.val().replace(/^\s+/, '').replace(/\s+$/, '') || '';
                    var html = escape_html(result);
                    if (type === 'textarea') html = html.replace(/[\r\n]/gm, '<br />');
                    target.html(html);
                    callback({
                        value: result,
                        target: target,
                        old_value: old_value
                    });
                    edit.register();
                    if (trigger !== target) trigger.show();
                };

                // 回车自动完成
                input.blur(finish);
                if (type === 'input') {
                    input.keydown(function(e) {
                        if (e.keyCode === 13) finish();
                    });
                }

                target.html(input);
                input.focus();
            };

            edit.register = function() {
                if (action === 'clickhold') {
                    var tid = null;
                    trigger.bind('mousedown', function(e) {
                        tid = setTimeout(function() {
                            edit.start(e);
                        }, 500);
                    });
                    trigger.bind('mouseup mouseout', function(e) {
                        clearTimeout(tid);
                    });
                } else {
                    trigger.bind(action, edit.start);
                }
            };
            edit.register();
        });

    };
})(jQuery);