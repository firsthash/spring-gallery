define(['backbone', 'app/app', 'app/model/MenuItem'], function(none, app, MenuItem) {
    return Backbone.Collection.extend({
        model: MenuItem, url: '/menuitems', comparator: 'position',
    });
});
