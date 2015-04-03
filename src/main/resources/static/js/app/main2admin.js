define(['app/AppView2Admin'], function(AppView2Admin) {

    var module = {};

    module.MenuItem = Backbone.Model.extend({
        url: '/crud/menuitem',
    });
    
    module.ContentItem = Backbone.Model.extend({
        url: '/crud/contentitem',
    });

    module.MenuItems = Backbone.Collection.extend({
        model: module.MenuItem,
        // url: '/crud/menuitems',
        url: 'http://www.nikitaliskov.com/crud/ImageModel',
    });


    module.ItemViewBase = Backbone.View.extend({
        hideFields: function(){
            if (!this.menu.hideFields)
                this.menu.hideFields = this.menu.hideFieldsDefault;
            var arr = this.menu.hideFields.split(/\s+/);
            _.each(arr, function(str){
                this.$(".{}".format(str)).addClass('hidden');
            }, this);
        }
    });

    module.MenuView = Backbone.View.extend({
        tagName: 'ul',
        events: {
            'click >.btn-add': 'add',
        },
        template: _.template($('#menu-template').html()),
        add: function(){
            var model = new module.MenuItem({});
            this.addItem(model);
            this.collection.add(model);
        },
        id: function(){
            return this.cid;
        },
        isRoot: false,
        hideFieldsDefault: "content-title content-upload position url style",
        render: function(){
            this.$el.append(this.template());
            this.collection.each(function(model){
                this.addItem(model);
            }, this);
            return this;
        },
        addItem: function(model){
            var menuItem = new module.MenuItemView({model: model});
            menuItem.menu = this;
            // if (this.isRoot) {
            //     menuItem.template = _.template($('#root-menu-item-template').html());
            // }
            var menuItemElem = menuItem.render().el;
            this.$el.append(menuItemElem);
        },
    });

    module.MenuItemView = module.ItemViewBase.extend({
        tagName: 'li',
        className: 'panel', // workaround: makes collapse behave like accordion
        template: _.template($('#menu-item-template').html()),
        events: {
            'click .btn-remove': 'remove2',
            'click .btn-collapse': 'collapse',
        },
        remove2: function(){
            this.remove();
            this.model.destroy();
            // this.parent.collection.remove(this.model);
        },
        hasChildren: function(){
            return this.model.has('children') && this.model.get('children') != '';
        },
        collapse: function(){
            if (!this.hasChildren()) {
                console.log('no subm')
                this.addSubmenu([{title: ""}]);
            }
        },
        render: function(){
            var model = this.model.toJSON();
            model.cid = this.cid;
            model.pid = this.menu.cid;
            this.$el.append(this.template(model)) && this.hideFields(); // hide some unneeded stuff

            var content = this.model.get('content') || {};
            var contentItem = new module.ContentItemView({model: new module.ContentItem(content)});
            contentItem.menu = this.menu;
            this.$('.content').append(contentItem.render().el);

            this.hasChildren() && this.addSubmenu();
            return this;
        },
        addSubmenu: function(children){
            if (children) {
                items = new module.MenuItems(children);
                this.model.set('children', children);
            } else
                items = new module.MenuItems(this.model.get('children'));
            var menu = new module.MenuView({collection: items});
            menu.hideFields = this.model.get('hide'); // list of hidden stuff
            this.$('.collapse').append(menu.render().el);
        },
    });

    module.ContentItemView = module.ItemViewBase.extend({
        tagName: 'span', // workaround: makes form inline
        template: _.template($('#content-item-template').html()),
        render: function(){
            this.$el.append(this.template(this.model.toJSON())) && this.hideFields(); // hide some unneeded stuff
            return this;
        },
    });

    // Main Controller
    module.AppView2Admin = AppView2Admin;

    // Backbone.sync = function(method, model){
    //     console.log(method, model)
    // }

    return module;
});