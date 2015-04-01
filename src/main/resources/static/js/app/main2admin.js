define(['app/AppView2Admin', 'data'], function(AppView2Admin, data) {

    var module = {};

    module.MenuItems = Backbone.Collection.extend({
        url: '/crud/menuitems',
    });

    module.ItemBase = Backbone.View.extend({
        hideFields: function(){
            // console.log(this.menu.hideFields, this.cid)
            if (!this.menu.hideFields)
                return;
            var arr = this.menu.hideFields.split(/\s+/);
            _.each(arr, function(str){
                this.$("[data-name={}]".format(str)).addClass('hidden');
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
        hideFields: "style hide content-title",
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
            if (this.isRoot) {
                menuItem.template = _.template($('#root-menu-item-template').html());
            }
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

            if (this.model.has('children') && this.model.get('children') != '') {
                var menu = new module.Menu({collection: new module.MenuItems(this.model.get('children'))});
                menu.hideFields = this.model.get('hide'); // list of hidden stuff
                this.$('.collapse').append(menu.render().el);
            }
            return this;
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