define(['backbone', 'bootstrap', 'data'], function(bb, bs, data) {
    // top-level piece of UI
    var AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing element
        el: $("body"),
        events: {
            'keydown': 'onkeydown'
        },
        logos: ['Space'],
        // logos: ['Bird_LQ', 'Dolphin', 'Face', 'God', 'Head-blink', 'Kaceli', 'Nikitaliskovdotcom', 'Space', 'Walk3'],

        onkeydown: function(e){
            var prev = 37;
            var next = 39;
            var up = 38;
            var down = 40;
            switch (e.which) {
                case up:
                case prev:
                    this.contentControls.prev();
                    return false;
                case down:
                case next:
                    this.contentControls.next();
                    return false;
            }
        },

        // bind collection events, when items are added or changed
        initialize: function(options){
            this.options = options;

            var menuItems = new this.options.MenuItems(data);

            var menu = new this.options.Menu({collection: menuItems});
            var menuElem = menu.render().el;
            this.$('#menu').append(menuElem);

            var contentControls = new this.options.ContentControls({menu: menu});

            this.contentControls = contentControls;

            var name = this.logos[_.random(this.logos.length - 1)];
            var url = "img/logos/" + name + ".gif";

            var logo = new this.options.ContentItem({model: new Backbone.Model({url: url, title: '', description: '', single: ''})});

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
