define(['app/AppView2'], function(AppView2){
    var module = {};

    module.MenuItems = Backbone.Collection.extend({
        url: '/crud/menuitems',
    });

    module.Menu = Backbone.View.extend({
        tagName: 'ul',
        className: 'nav',
        active: [null], // static variable
        items: null,
        active: function(menu){
            if (menu)
                this.active[0] = menu;
            else
                return this.active[0];
        },
        render: function(){
            this.items = [];
            this.collection.each(function(model){
                var menuItem = new module.MenuItem({model: model});
                menuItem.menu = this;
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
                    // console.log(index)
                    itemIndex = index;
                }
            }, this);
            return itemIndex;   
        },
        up: function(){
            var itemIndex = this.itemIndex();
            if (itemIndex <= 0) 
                itemIndex = this.items.length;
            this.items[itemIndex - 1].doClick();
        },
        down: function(){
            var itemIndex = this.itemIndex();
            if (itemIndex == (this.items.length - 1))
                itemIndex = -1;
            this.items[itemIndex + 1].doClick();
        },
    });

    module.MenuItem = Backbone.View.extend({
        events: {
            'click': 'onClick'
        },
        tagName: 'li',
        template: _.template($('#menu-item-template').html()),
        submenu: null,
        className: function(){
            var className = '';
            if (this.model.has('style'))
                className = this.model.get('style');
            return className;
        },
        render: function(){
            // this.busy(false);
            var el = this.template(this.model.toJSON());
            this.$el.html(el);
            if (this.model.has('children') && this.model.get('children') != '') {
                var submenu = new module.Menu({collection: new module.MenuItems(this.model.get('children'))});
                this.submenu = submenu;
                submenu.parentItem = this;
                this.$el.append(submenu.render().el);
                // if (!submenu.active()) // activate by default first gallery
                //     submenu.active(submenu);
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
            // this.animateOldSubmenu();

            //this.$el.siblings().removeClass('active'); // hide other submenus

            // reset previously selected submenu item
            if (this.submenu && this.menu.active() != this.submenu)
                _.each(this.submenu.items, function(obj){obj.$el.removeClass('active')});

            // open parent menu
            if (this.menu.parentItem && !this.menu.parentItem.$el.hasClass('active')) {
                console.log('open parent')
                this.menu.parentItem.doClick();
            }
        },
        drawContent: function(){
            // draw element
            if (this.model.has('content') && this.model.get('content') != ''){
                new module.ContentItem({model: new Backbone.Model(this.model.get('content'))});
                if (this.model.has('single')){
                    module.app.contentControls.hide();
                } else {
                    module.app.contentControls.unhide();
                }
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
                        new module.ContentItem({model: new Backbone.Model({})});
                        module.app.contentControls.hide();
                    // } else if (index == 0 && that.submenu && that.submenu != that.menu.active()){
                    } else if (index == 0 && that.submenu){ // menu is opening... imitate click on first submenu item
                        var item = that.submenu.items[0];
                        item.model.has('content') && item.doClick();
                    }
                    that && that.$el.toggleClass('active') && console.log('toggle');
                    that && that.submenu && that.submenu.$el.css('display', '');
                })
            }}, [this, that]);
        },
    });

    module.ContentItem = Backbone.View.extend({
        template: _.template($('#content-item-template').html()),
        youtubeTemplate: _.template($('#youtube-template').html()),
        vimeoTemplate: _.template($('#vimeo-template').html()),
        imageTemplate: _.template($('#image-template').html()),
        events: {
            'click .embed a': function(){
                module.app.contentControls.next();
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

            if (url.indexOf('youtube') > -1) {
                var videoId = url.replace(/.*v=([^&]*).*/gi, '$1');
                return this.youtubeTemplate({videoId: videoId});
            }

            if (url.indexOf('vimeo') > -1) {
                var videoId = url.replace(/.*\/([^&]*).*/gi, '$1');
                return this.vimeoTemplate({videoId: videoId});
            }

            return this.imageTemplate(this.model.toJSON());
        },
        render: function() {
            return this;
        }
    });

    module.ContentControls = Backbone.View.extend({
        el: $('#content-controls'),
        events: {
            'click #prev': 'prev',
            'click #next': 'next'
        },
        isHidden: false,
        initialize: function(options){
            this.menu = options.menu;
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
                menu.up();
        },
        next: function(){
            var menu = this.menu.active() || this.menu.items[0].submenu;
            if (!this.isHidden)
                menu.down();
        },
    });

    // Main Controller
    module.AppView2 = AppView2;

    return module;
});