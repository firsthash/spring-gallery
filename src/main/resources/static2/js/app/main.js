define(['backbone', 'app/animqueue'], function(){
    var module = {};

    module.MenuItem = Backbone.Model.extend({
        url: '/menuitem',
        notEmpty: function() {
            return this.get('url') || this.get('description');
        },
    });

    module.MenuItems = Backbone.Collection.extend({
        model: module.MenuItem,
        url: '/menuitems',
        comparator: 'position',
    });

    module.MenuView = Backbone.View.extend({
        tagName: 'ul',
        className: 'nav',
        active: [null], // static variable
        items: null,
        isRoot: false,
        active: function(menu){
            if (menu)
                this.active[0] = menu;
            else
                return this.active[0];
        },
        render: function(){
            this.items = [];
            this.collection.each(function(model, index){
                model.set('position', index + 1);
                var menuItem = new module.MenuItemView({model: model, menu: this});
                // menuItem.menu = this;
                this.items.push(menuItem);
                var menuItemElem = menuItem.render().el;
                this.$el.append(menuItemElem);
            }, this);
            return this;
        },
        itemIndex: function(){
            var itemIndex = -1;
            _.each(this.items, function(item, index){
                if (item.$el.hasClass('active')){
                    itemIndex = index;
                }
            }, this);
            return itemIndex;   
        },
        prev: function(){
            var itemIndex = this.itemIndex();
            if (itemIndex <= 0) 
                itemIndex = this.items.length;
            this.items[itemIndex - 1].doClick();
        },
        next: function(){
            var itemIndex = this.itemIndex();
            if (itemIndex == (this.items.length - 1))
                itemIndex = -1;
            this.items[itemIndex + 1].doClick();
        },
        hasNext: function(){
            var ret = true;
            if (this.items.length == 1 || this.isRoot)
                ret = false;
            return ret;
        },
    });

    module.MenuItemView = Backbone.View.extend({
        events: {
            'click': 'onClick'
        },
        tagName: 'li',
        template: _.template($('#menu-item-template').html()),
        submenu: null,
        menu: null,
        initialize: function(options){
            var content = new module.MenuItem(this.model.get('content') || {});
            this.model.set('content', content);

            var children = new module.MenuItems(this.model.get('children') || []);
            this.model.set('children', children);

            this.menu = options.menu;
            if (!this.menu.active() && content.get('url')) {
                this.menu.active(this.menu);
            }
        },
        className: function(){
            var className = '';
            if (this.model.has('style'))
                className = this.model.get('style');
            return className;
        },
        render: function(){
            var el = this.template(this.model.toJSON());
            this.$el.html(el);
            var children = this.model.get('children');
            if (children.length) {
                var submenu = new module.MenuView({collection: children});
                this.submenu = submenu;
                submenu.parentItem = this;
                this.$el.append(submenu.render().el);
            }
            return this;
        },
        onClick: function(e){
            e.stopPropagation();
            this.doClick(e);
        },
        doClick: function(e){
            // draw element
            this.drawContent();

            this.animate();

            // reset previously selected submenu item
            if (this.submenu && this.menu.active() != this.submenu)
                _.each(this.submenu.items, function(obj){obj.$el.removeClass('active')});

            module.contentControls.toggle();
        },
        drawContent: function(){
            // draw element
            var content = this.model.get('content');
            if (content.notEmpty()){
                //console.log('draw');
                new module.ContentItemView({model: content});

                this.menu.active(this.menu);
            }
        },
        animate: function(){
            var that = null;
            // find previously clicked item
            _.each(this.menu.items, function(item){
                if (item.$el.hasClass('active') && item != this) {
                    that = item;
                }
            }, this);
            var el1 = that && that.submenu ? that.submenu.$el : null;
            var el2 = this.submenu ? this.submenu.$el : null;
            if (!el1 && !el2){
                this && this.$el.addClass('active');
                that && that.$el.removeClass('active');
                return;
            }
            var queue = [
                {
                    el: el1,
                },
                {
                    el: el2,
                },
            ];

            $.slideQueue(queue, {callback: function(arr){
                _.each(arr, function(that, index){
                    // menu is collapsing... display nothing
                    if (index == 0 && that.submenu && that.$el.hasClass('active')){
                        new module.ContentItemView({model: new Backbone.Model({})});
                        module.contentControls.hide();
                    } else if (index == 0 && that.model.get('content').get('url')) {

                    } else if (index == 0 && that.submenu){ // menu is opening... imitate click on first submenu item
                        var item = that.submenu.items[0];
                        item.model.get('content').notEmpty() && item.doClick();
                    }
                    that && that.$el.toggleClass('active');
                    that && that.submenu && that.submenu.$el.css('display', '');
                })
            }}, [this, that]);
        },
    });

    module.ContentItemView = Backbone.View.extend({
        template: _.template($('#content-item-template').html()),
        youtubeTemplate: _.template($('#youtube-template').html()),
        vimeoTemplate: _.template($('#vimeo-template').html()),
        imageTemplate: _.template($('#image-template').html()),
        events: {
            'click .embed a': function(){
                module.contentControls.next();
                return false;
            },
        },
        initialize: function(){
            var el = this.template(this.model.toJSON());
            this.$el.html(el);

            var elem = this.embed();
            this.$('.embed').append(elem);
            $('#content').html(this.el);
        },
        embed: function(){
            var url = this.model.get('url') || '';
            var isAbs = url.startsWith('http');

            if (isAbs && url.indexOf('youtube') > -1) {
                var videoId = url.replace(/.*v=([^&]*).*/gi, '$1');
                return this.youtubeTemplate({videoId: videoId});
            }

            if (isAbs && url.indexOf('vimeo') > -1) {
                var videoId = url.replace(/.*\/([^&]*).*/gi, '$1');
                return this.vimeoTemplate({videoId: videoId});
            }

            return this.imageTemplate(this.model.toJSON());
        },
        render: function() {
            return this;
        }
    });

    module.ContentControlsView = Backbone.View.extend({
        el: $('#content-controls'),
        events: {
            'click #prev': 'prev',
            'click #next': 'next'
        },
        isHidden: false,
        initialize: function(options){
            $('body').on('keydown', _.bind(this.onkeydown, this));

            this.menu = options.menu;

            //this.contentControls = contentControls;
            console.assert(module.contentControls == null, "ContentControlsView cannot be instantiated twice");
            module.contentControls = this;
            this.next();


            // imitate click on first elem
            //contentControls.next();
        },
        toggle: function(){
            // console.log(this.menu.active().hasNext())
            if (this.menu.active().hasNext())
                this.unhide();
            else
                this.hide();
        },
        unhide: function(){
            this.$el.removeClass('hidden');
            this.isHidden = false;
        },
        hide: function(){
            this.$el.addClass('hidden');
            this.isHidden = true;
        },
        prev: function(){
            var menu = this.menu.active() || this.menu.items[0].submenu;
            if (!this.isHidden)
                menu.prev();
        },
        next: function(){
            var menu = this.menu.active() || this.menu.items[0].submenu;
            if (!this.isHidden)
                menu.next();
        },
        onkeydown: function(e){
            var left = 37;
            var right = 39;
            var up = 38;
            var down = 40;
            var space = 32;
            switch (e.which) {
                case up:
                case left:
                    this.prev();
                    return false;
                case down:
                case right:
                    this.next();
                    return false;
                case space:
                    this.play() && this.next();
                    return false;
            }
            return true;
        },
        play: function(){
            var iframe = $('iframe')[0];
            if (iframe){
                var src = iframe.src;
                if (src.contains('autoplay')){
                    iframe.src = src.replace(/autoplay[^&]*[&]*/, '');
                    return false;
                }
                var query = src.contains('?') ? '&' : '?';
                query += 'autoplay=1';
                iframe.src += query;
                console.log(iframe.src);
                return false;
            }
            return true;
        },
    });



    return module;
});