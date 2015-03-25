define(['backbone', 'bootstrap', 'data', 'app/animQueue'], function(bb, bs, data) {
    // top-level piece of UI
    var AppView = Backbone.View.extend({
        // Instead of generating a new element, bind to the existing element
        el: $("body"),
        events: {
            'keydown': 'onkeydown',
        },
        logos: ['All-Color_LQ_white'],
        // logos: ['Bird_LQ', 'Dolphin', 'Face', 'God', 'Head-blink', 'Kaceli', 'Nikitaliskovdotcom', 'Space', 'Walk3'],

        onkeydown: function(e){
            var prev = 37;
            var next = 39;
            var up = 38;
            var down = 40;
            var space = 32;
            switch (e.which) {
                case up:
                case prev:
                    this.contentControls.prev();
                    return false;
                case down:
                case next:
                    this.contentControls.next();
                    return false;
                case space:
                    if (this.play())
                        this.contentControls.next();
                    return false;
            }
            return true;
        },

        play: function(){
            var iframe = this.$('iframe');
            // if (iframe.length && !iframe[0].src.contains('autoplay')){
            if (iframe.length){
                var src = iframe[0].src;
                if (src.contains('autoplay')){
                    iframe[0].src = src.replace(/autoplay[^&]*[&]*/, '');
                    return false;
                }
                console.log(src)
                var query = src.contains('?') ? '&' : '?';
                query += 'autoplay=1';
                console.log(query);
                iframe[0].src += query; 
                return false;
            }
            return true;
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

            // this.animate(logo.$el);

            // this.listenToOnce(this.collection, 'sort', function() {this.addAll(); this.listenTo(this.collection, 'add', this.addOne);});


            // this.collection.fetch();
        },

        animate: function(el){
            el.find('.embed img').css({position: 'absolute', top: '300px'});
            var queue1 = [
            {
                selector: '.embed img',
                prop: {
                    left: '-1000px',
                    duration: 5000
                }
            },
            {
                selector: '.embed img',
                prop: {
                    opacity: 0,
                    duration: 0
                }
            },
            {
                selector: '.embed img',
                prop: {
                    left: '1000px',
                    duration: 0
                }
            },
            {
                selector: '.embed img',
                prop: {
                    opacity: 1.0,
                    duration: 0
                }
            },
            ];
            $.animQueue(queue1, {loop: true});
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
