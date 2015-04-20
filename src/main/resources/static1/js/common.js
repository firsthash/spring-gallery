//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
require.config({
    baseUrl: 'static/js/lib',
    // apply "baseUrl + paths" rules for finding
    paths: {
        app: '../app',
        backbone: 'backbone/backbone',
        underscore: 'backbone/underscore',
        bootstrap: 'bootstrap3/js/bootstrap',
        jquery: 'jquery/jquery',
        'jquery.ui.core': 'jquery.ui/jquery.ui.core',
        'jquery.ui.widget': 'jquery.ui/jquery.ui.widget',
        'jquery.ui.mouse': 'jquery.ui/jquery.ui.mouse',
        'jquery.ui.sortable': 'jquery.ui/jquery.ui.sortable',
        html5: 'http://html5shim.googlecode.com/svn/trunk/html5'
    },
    shim: {
        bootstrap: ['jquery'],
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        'jquery.ui.core': ['jquery'],
        'jquery.ui.widget': ['jquery'],
        'jquery.ui.mouse': ['jquery', 'jquery.ui.core', 'jquery.ui.widget'],
        'jquery.ui.sortable': ['jquery', 'jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']
    }
});

// First, checks if it isn't implemented yet.
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(needle) {
        return(this.indexOf(needle) == 0);
    };
}

//first, checks if it isn't implemented yet
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments
        var index = 0
        return this.replace(/{(\d*)}/g, function(match, number) {
            if (!number) {
                number = index
            }
            index++;
            return typeof args[number] != 'undefined' ? args[number] : args[0];
        })
    }
}

require(['underscore'], function() {
    //_.templateSettings = {
    //    evaluate: /\{%([\s\S]+?)%\}/g,
    //    interpolate: /\{%=([\s\S]+?)%\}/g,
    //    escape: /\{%-([\s\S]+?)%\}/g
    //}

    // attempt to find template that best works with jsp/jsf technologies
    _.templateSettings = {
        evaluate: /<<([\s\S]+?)>>/g,
        interpolate: /<<=([\s\S]+?)>>/g,
        escape: /<<-([\s\S]+?)>>/g
    }
});