define(['backbone', 'bootstrap', 'data'], function(bb, bs, data) {
    // top-level piece of UI
    var AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing element
        el: $("body"),

        // bind collection events, when items are added or changed
        initialize: function(options){
            this.options = options;

            var view = new this.options.MenuViewWrapper({data: data});
            window.menuview = view;
        },

        // add one item
        addOne: function(model) {
        },

        // batch add item
        addAll: function() {
            this.collection.each(this.addOne, this);
        }

    });

    return AppView;
});
