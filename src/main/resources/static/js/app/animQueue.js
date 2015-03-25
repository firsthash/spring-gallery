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
            if (options.callback) {
                options.callback();
            }
        } 
        run(step);
    };
});
