define(['app/AppView2Admin'], function(AppView2Admin) {

    var module = {};

    module.MenuItems = Backbone.Collection.extend({
        url: '/crud/menuitems',
    });

    module.ItemBase = Backbone.View.extend({
        hideFields: function(){
            if (!this.menu.hideFields)
                this.menu.hideFields = this.menu.hideFieldsDefault;
            var arr = this.menu.hideFields.split(/\s+/);
            _.each(arr, function(str){
                this.$(".{}".format(str)).addClass('hidden');
            }, this);
        }
    });

    module.Menu = Backbone.View.extend({
        tagName: 'ul',
        events: {
            'click >.btn-add': 'add',
        },
        template: _.template($('#menu-template').html()),
        add: function(){
            this.addItem(new Backbone.Model({}));
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
            var menuItem = new module.MenuItem({model: model});
            menuItem.menu = this;
            // if (this.isRoot) {
            //     menuItem.template = _.template($('#root-menu-item-template').html());
            // }
            var menuItemElem = menuItem.render().el;
            this.$el.append(menuItemElem);
        },
    });

    module.MenuItem = module.ItemBase.extend({
        tagName: 'li',
        className: 'panel', // workaround: makes collapse behave like accordion
        template: _.template($('#menu-item-template').html()),
        events: {
            'click .btn-remove': 'remove',
            'click .btn-collapse': 'collapse',
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

            var contentModel = this.model.get('content') || {};
            var contentItem = new module.ContentItem({model: new Backbone.Model(contentModel)});
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
            var menu = new module.Menu({collection: items});
            menu.hideFields = this.model.get('hide'); // list of hidden stuff
            this.$('.collapse').append(menu.render().el);
        },
    });

    module.ContentItem = module.ItemBase.extend({
        tagName: 'span', // workaround: makes form inline
        template: _.template($('#content-item-template').html()),
        render: function(){
            this.$el.append(this.template(this.model.toJSON())) && this.hideFields(); // hide some unneeded stuff
            return this;
        },
    });

    // Main Controller
    module.AppView2Admin = AppView2Admin;

    return module;
});