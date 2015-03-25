define(['jquery'], function($) {
    $.animQueue = function(queue, options){
        var defaults = {
            loop: false
        };
        options = $.extend({}, defaults, options);
        var step = 0;
        var run = function(step) {            
            var anim = queue[step];
            if (typeof anim === "undefined") {
                return;
            }
            step++;
            if (anim.selector) {
                $(anim.selector).animate(anim.prop,{
                    easing: anim.easing || 'swing',
                    duration: anim.duration || 1000,
                    complete: function(){
                        run(step);
                    }
                });
            } else if (anim.delay) {
                setTimeout(function(){ run(step); }, anim.delay);
            }
            if (step == queue.length && options.loop) {
                step = 0;
                run(step);
            }
        } 
        run(step);
    };

    $.slideQueue = function(queue, options){
        if ($.busy)
            return;
        else
            $.busy = true;
        var defaults = {
            callback: null
        };
        options = $.extend({}, defaults, options);
        var step = 0;
        var run = function(step) {            
            var anim = queue[step];
            if (typeof anim === "undefined") {
                return;
            }
            step++;
            if (anim.$el) {
                anim.$el.slideToggle(anim.duration || 500, function(){run(step)});
            } else if (anim.delay) {
                setTimeout(function(){ run(step); }, anim.delay);
            }
            if (step == queue.length && options.callback) {
                options.callback();
            }
            if (step == queue.length) {
                $.busy = false;
            }
        } 
        run(step);
    };
});
