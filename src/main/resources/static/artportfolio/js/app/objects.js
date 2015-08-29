define(['backbone', 'app/animqueue'], function(){
    var module = {};

    module.BaseItem = Backbone.Model.extend({
        notEmpty: function() {
            return this.get('url') || this.get('description');
        },
    });

    module.MenuItem = module.BaseItem.extend({
        url: '/menuitem',
        init: false,
        initialize: function() {
            this.on('change:children', function(model, value) {
                console.log('on change MenuItem', model.title, value.length);
            });
            //if (this.init) {
            //    console.log('already initialized');
            //}
            //this.set({
            //    content: new module.BaseItem(this.get('content') || {}),
            //    children: new module.MenuItems(this.get('children') || []),
            //});

            //this.init = true;
        },
        set: function(key, val, options) {
            if (typeof key === 'object') {
                var attrs = key;
                attrs.content = new module.BaseItem(attrs.content || {});
                attrs.children = new module.MenuItems(attrs.children || []);
            }

            return Backbone.Model.prototype.set.call(this, key, val, options);
        },
        //parse: function(response) {
        //    if (this.init == false) {
        //        this.init = true;
        //        this.set({
        //            content: new module.BaseItem(),
        //            children: new module.MenuItems()
        //        });
        //    }
        //    this.content = response.content;
        //    this.children = response.children;
        //    delete response.content;
        //    delete response.children;
        //    return response;
        //},
    });

    module.MenuItems = Backbone.Collection.extend({
        model: module.MenuItem,
        url: '/menuitems',
        comparator: 'position',
    });


    module.MenuItemsDecorator = module.MenuItems.extend({
        initialize: function(models, options) {
            console.assert(options.data != null, "options.data != null");
            this.data = options.data;
            this.on('sync', this.onSync, this);
            this.on('error', this.onError, this);
            console.assert(this.length == 0, 'this.length == 0');
        },
        onError: function(){
            console.log('fetch error');
            if (this.length == 0) {
                this.reset(this.data);
                this.trigger('sync');
            }
        },
        onSync: function(){
            if (this.length == 0) {
                console.log('server returns empty collection');
                this.reset(this.data);
            }
        }
    });

    module.MenuViewDecorator = Backbone.View.extend({
        el: $('#menu'),
        initialize: function(options){
            this.data = options.data;
            this.items = new module.MenuItemsDecorator([], {data: options.data});
            console.assert(this.items.length == 0, 'this.items.length == 0');
            var menu = new module.MenuView({collection: this.items});
            var contentControls = new module.ContentControlsView({menu: menu});
            module.currentContentView = new module.ContentItemView({model: new Backbone.Model()});
            this.$el.prepend(menu.render().el);

            //this.listenTo(this.items, 'sync', this.render);
            this.items.fetch({success: function() {
                console.log('init done!!!');
                menu.item(0).doClick();
                $(document).trigger('initDone');
            }});

            this.items.on('sync', function() {
                $('#menu').find('>ul>li').eq(0).append($('#lang-switch').html());
            });
        },
        //render: function(){
        //    this.$el.empty();
        //    var menu = new module.MenuView({collection: this.items});
        //    this.$el.prepend(menu.render().el);
        //    var contentControls = new module.ContentControlsView({menu: menu});
        //    // draw first element
        //    menu.item(0).doClick();
        //    $(document).trigger('initDone');
        //    return this;
        //},
    });

    module.MenuView = Backbone.View.extend({
        tagName: 'ul',
        className: 'nav',
        active: [null], // static variable
        items: null,
        isRoot: false,
        initialize: function(){
            if (!this.active())
                this.active(this);

            this.collection.on('add', this.onAdd, this);

            if (this.collection.length > 0) {
                this.collection.each(this.onAdd, this);
            }

            //this.collection.on('change', function() {
            //    console.log('onchange');
            //}, this);
        },
        active: function(menu){
            if (menu)
                this.active[0] = menu;
            else
                return this.active[0];
        },
        onAdd: function(model, index){
            if (this.items == null) {
                this.items = [];
            }
            model.set('position', index + 1);
            var menuItem = new module.MenuItemView({model: model, menu: this});
            this.items.push(menuItem);
            this.$el.append(menuItem.render().el);
        },
        //render: function(){
        //    //this.items = [];
        //    //this.collection.each(this.onAdd, this);
        //
        //    return this;
        //},
        itemIndex: function(){
            var itemIndex = 0;
            _.each(this.active().items, function(item, index){
                if (item.$el.hasClass('active')){
                    itemIndex = index;
                }
            }, this);
            return itemIndex;   
        },
        item: function(index){
            return this.active().items[index];
        },
        prevItem: function(){
            var itemIndex = this.itemIndex();
            if (itemIndex <= 0) 
                itemIndex = this.active().items.length;
            return this.active().items[itemIndex - 1];
        },
        nextItem: function(){
            var itemIndex = this.itemIndex();
            if (itemIndex == (this.active().items.length - 1))
                itemIndex = -1;
            return this.active().items[itemIndex + 1];
        },
        hasNextItem: function(){
            var ret = false;
            if (this.nextItem().hasContent() && this.prevItem().hasContent())
                ret = true;
            return ret;
        },
    });

    module.MenuItemView = Backbone.View.extend({
        events: {
            'click': 'onClick',
            'click .lang>a': 'onMenuClick',
        },
        tagName: 'li',
        template: _.template($('#menu-item-template').html()),
        submenu: null,
        menu: null,
        initialize: function(options){
            //var content = new module.MenuItem(this.model.get('content') || {});
            //var content = this.model.get('content');
            //this.model.set('content', content);

            //var children = new module.MenuItems(this.model.get('children') || []);
            //var children = this.model.get('children');
            //this.model.set('children', children);

            this.menu = options.menu;

            this.model.on('change', this.render, this);
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
            if (module.currentContentView && module.currentContentView.model.get('id') == this.model.get('content').get('id')) {
                //module.currentContentView.model.set(this.model.get('content').toJSON());
                this.doClick();
            }
            return this;
        },
        hasContent: function(){
            var content = this.model.get('content');
            return content.notEmpty();
        },
        onMenuClick: function(e) {
            $.get(e.currentTarget.href, function() {
                menuview.items.fetch();
            });
            return false;
        },
        onClick: function(e){
            e.stopPropagation();
            this.doClick(e);
        },
        doClick: function(e){
            // draw element
            this.showContent();

            this.animate();

            // reset previously selected submenu item
            if (this.submenu && this.menu.active() != this.submenu)
                _.each(this.submenu.items, function(obj){obj.$el.removeClass('active')});
        },
        showContent: function(){
            // draw element
            var content = this.model.get('content');
            if (content.notEmpty()){
                //module.currentContentView = new module.ContentItemView({model: content});
                module.currentContentView.model.set(content.toJSON());

                this.menu.active(this.menu);
                module.contentControls.toggle();
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
                        new module.ContentItemView({model: new module.MenuItem({})});
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
            this.model.on('change', function() {
                console.log('model ContentItemView changed');
                this.render();
            }, this);
            this.render();
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
            var el = this.template(this.model.toJSON());
            this.$el.html(el);

            var elem = this.embed();
            this.$('.embed').append(elem);
            $('#content').html(this.el);
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

            console.assert(module.contentControls == null, "ContentControlsView cannot be instantiated twice");
            module.contentControls = this;
        },
        toggle: function(){
            if (this.menu.hasNextItem())
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
            if (!this.isHidden)
                this.menu.prevItem().doClick();
        },
        next: function(){
            if (!this.isHidden)
                this.menu.nextItem().doClick();
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