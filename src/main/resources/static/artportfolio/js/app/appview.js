define(['data', 'backbone'], function(data) {
    // top-level piece of UI
    var AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing element
        el: $("body"),
        events: {
            'keydown': 'onkeydown',
        },
        logos: ['All-Color_LQ_white'],
        // logos: ['Bird_LQ', 'Dolphin', 'Face', 'God', 'Head-blink', 'Kaceli', 'Nikitaliskovdotcom', 'Space', 'Walk3'],

        // bind collection events, when items are added or changed
        initialize: function(module){
            module.app = this;
            this.options = module;

            console.assert(data, 'initial data is not defined');

            var view = new this.options.MenuViewWrapper({data: data});
            window.menuview = view;

            //var menuItems = new this.options.MenuItems();
            //menuItems.on('error', function(){menuItems.reset(data)}, this);
            //menuItems.on('sync reset', this.initSubItems, this);
            //
            //
            //menuItems.fetch({complete: function(xhr) {
            //    var NO_CONTENT = 204;
            //    if (xhr.status == NO_CONTENT)
            //        this.reset(data);
            //}});
        },

        initSubItems: function(e) {
            var menuItems = new this.options.MenuItems();
            var menu = new this.options.MenuView({collection: menuItems});
            // menu.isRoot = true;
            var menuElem = menu.render().el;
            this.$('#menu').append(menuElem);

            var contentControls = new this.options.ContentControlsView({menu: menu});

            menu.item(0).doClick();
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
