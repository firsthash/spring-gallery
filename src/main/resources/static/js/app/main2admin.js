define(['app/AppView2Admin', 'data'], function(AppView2Admin, data) {

    var module = {};

    module.MenuItems = Backbone.Collection.extend({
        url: '/crud/menuitems',
    });

    module.Menu = Backbone.View.extend({
        tagName: 'ul',
        isRoot: false,
        render: function(){
            this.collection.each(function(model){
                var menuItem = new module.MenuItem({model: model});
                if (this.isRoot) {
                    menuItem.template = _.template($('#root-list-item-template').html());
                }
                var menuItemElem = menuItem.render().el;
                this.$el.append(menuItemElem);
            }, this);
            return this;
        },
    });

    module.MenuItem = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#list-item-template').html()),
        render: function(){
            // var template = _.template($('#input-item-template').html());
            // _.each(this.model.toJSON(), function(value, key){
            //     this.$el.append(template({name: key, value: value}));
            // }, this);
            this.$el.append(this.template(this.model.toJSON()));
            if (this.model.has('content')){
                var menu = new module.Menu({collection: new module.MenuItems(this.model.get('content'))});
                this.$el.append(menu.render().el);
            }
            if (this.model.has('children') && this.model.get('children') != '') {
                var menu = new module.Menu({collection: new module.MenuItems(this.model.get('children'))});
                this.$el.append(menu.render().el);
            }
            return this;
        },
    });

    // Main Controller
    module.AppView2Admin = AppView2Admin;

    return module;
});