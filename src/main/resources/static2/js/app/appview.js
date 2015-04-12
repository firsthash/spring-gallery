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

            var menuItems = new this.options.MenuItems();
            menuItems.on('error', function(){menuItems.reset(data)}, this);
            menuItems.on('sync reset', function(){
                var menu = new this.options.MenuView({collection: menuItems});
                menu.isRoot = true;
                var menuElem = menu.render().el;
                this.$('#menu').append(menuElem);

                var contentControls = new this.options.ContentControlsView({menu: menu});

                //this.contentControls = contentControls;

                // imitate click on first elem
                //contentControls.next();
            }, this);


            menuItems.fetch();
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
