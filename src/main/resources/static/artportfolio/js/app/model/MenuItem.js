define(['backbone', 'app/app', 'app/model/BaseItem', 'app/model/MenuItems'], function(Backbone, app, BaseItem, MenuItems) {
    return BaseItem.extend({
        url: '/menuitem',
        init: false,
        initialize: function() {
            this.on('change:children', function(model, value) {
                console.log('on change MenuItem', model.title, value.length);
            });
        },
        set: function(key, val, options) {
            if (typeof key === 'object') {
                var attrs = key;
                attrs.content = new BaseItem(attrs.content || {});
                var MenuItems = require('app/model/MenuItems');
                attrs.children = new MenuItems(attrs.children || []);
            }

            return Backbone.Model.prototype.set.call(this, key, val, options);
        },
    });
});
