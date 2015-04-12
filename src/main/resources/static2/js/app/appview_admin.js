define(['backbone', 'bootstrap', 'data'], function(bb, bs, data) {
    // top-level piece of UI
    var AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing element
        el: $("body"),

        // bind collection events, when items are added or changed
        initialize: function(options){
            this.options = options;

            // var menu = new this.options.MenuWrapper();
            // try {
            //     menu.fetch();
            // } catch(ex) {
            //     menu.reset(data);
            // }

            // menu.fetch();

            // window.menu = menu;

            var view = new this.options.MenuViewWrapper({data: data});
            // var view = new this.options.MenuView({collection: menu.items});
            window.menuview = view;

            // var menuElem = view.render().el;
            // this.$('#list').html(menuElem);

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
