define(['app/AppView2'], function(AppView2){
    var module = {};

    module.MenuItems = Backbone.Collection.extend({
        url: '/crud/menuitems',
    });

    module.Menu = Backbone.View.extend({
        tagName: 'ul',
        className: 'nav',
        active: [null], // static variable
        // items: [],
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
        getActive: function(){
            var active = -1;
            _.each(this.items, function(item, index){
                // if (item.submenu)
                //     console.log('has submenu')
                if (item.$el.hasClass('active')){
                    console.log(index)
                    active = index;
                }
            }, this);
            return active;   
        },
        up: function(){
            var active = this.getActive();
            if (active <= 0) 
                active = this.items.length;
            this.items[active - 1].doClick();
            // this.move(function(el){return el.prev();}, function(elems){return elems.last();}, false);
        },
        down: function(){
            var active = this.getActive();
            if (active == (this.items.length - 1))
                active = -1;
            this.items[active + 1].doClick();
            // this.move(function(el){return el.next();}, function(elems){return elems.first();}, true);
        },
        move: function(nearElement, firstChild, isDown){
            var activeElement = this.$('.active:not(:hidden):last');

            var element = nearElement(activeElement);
            var child = firstChild(activeElement.find('li'));
            if (!activeElement.length) { // begin of the list
                // console.log('starting point');
                element = firstChild(this.$el.children('li'));
            }

            if (child.length && isDown) { // has children
                console.log('has child');
                element = child;
            }

            if (!element.length) { // last element
                console.log('end of the list');
                var parent = activeElement.parents('.active');
                if (parent.length != 0) { // has parent
                    console.log('has parent');
                    activeElement.removeClass('active');
                    element = nearElement(parent);
                }
            }

            if (!element.length) { // first or last
                element = activeElement;
            }

            element.trigger('click');

            newElem = firstChild(element.find('li'));
            if (element.length) {
                newElem.trigger('click');
            }
        }
    });

    module.MenuItem = Backbone.View.extend({
        events: {
            'click': 'onClick'
        },
        tagName: 'li',
        template: _.template($('#menu-item-template').html()),
        render: function(){
            var el = this.template(this.model.toJSON());
            this.$el.html(el);
            if (this.model.has('children') && this.model.get('children') != '') {
                var nested = new module.Menu({collection: new module.MenuItems(this.model.get('children'))});
                this.$el.append(nested.render().el);
            }
            return this;
        },
        onClick: function(e){
            e.stopPropagation();
            this.doClick(e);
        },
        doClick: function(e){
            if (typeof(e) == 'undefined' && !this.$el.parents('.active').length){
                this.$el.parents('li').trigger('click'); // unfold if: 'li li.active li.active'
            }
            // if (!this.submenu) {
            //     console.log('no submenu', this.$el);
            //     this.menu.active[0] = this.menu;
            // }
            // draw element
            if (this.model.has('content') && this.model.get('content') != ''){
                new module.ContentItem({model: new Backbone.Model(this.model.get('content'))});
                if (this.model.has('single')){
                    module.app.contentControls.hide();
                } else {
                    module.app.contentControls.unhide();
                    this.menu.active[0] = this.menu;
                }
            }
            
            this.$el.siblings().removeClass('active'); // near link

            var fn = _.bind(function(){
                this.$el.removeClass('active');
            }, this);

            // this.$el.siblings().hide(500, fn);
            
            // this.$el.toggleClass('active');
            // this.$el.parents('li').addClass('active'); // unfold if: 'li li.active li.active'

            var children = this.$('ul>li');
            children.removeClass('active');
            if (!this.$el.hasClass('active')) {
                this.$el.addClass('active');
                children.css('display', 'none');
                children.show(500);
            } else {
                children.hide(500, fn);
            }

        },
    });

    module.ContentItem = Backbone.View.extend({
        template: _.template($('#content-item-template').html()),
        youtubeTemplate: _.template($('#youtube-template').html()),
        vimeoTemplate: _.template($('#vimeo-template').html()),
        imageTemplate: _.template($('#image-template').html()),
        events: {
            'click a': function(){
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
        el: $('#contentControls'),
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
            if (!this.isHidden)
                this.menu.active[0].up();
        },
        next: function(){
            if (!this.isHidden)
                this.menu.active[0].down();
        },
    });

    // Main Controller
    module.AppView2 = AppView2;

    return module;
});