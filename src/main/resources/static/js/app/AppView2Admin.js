define(['backbone', 'bootstrap', 'data'], function(bb, bs, data) {
    // top-level piece of UI
    var AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing element
        el: $("body"),

        // bind collection events, when items are added or changed
        initialize: function(options){
            this.options = options;

            var menuItems = new this.options.MenuItems();
            menuItems.reset(data);

            window.menuItems = menuItems;

            var menu = new this.options.MenuView({collection: menuItems});
            // menu.hideFields = "content-title content-url";
            menu.isRoot = true;
            var menuElem = menu.render().el;
            this.$('#list').html(menuElem);

            // this.listenToOnce(this.collection, 'sort', function() {this.addAll(); this.listenTo(this.collection, 'add', this.addOne);});


            // this.collection.fetch();
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
