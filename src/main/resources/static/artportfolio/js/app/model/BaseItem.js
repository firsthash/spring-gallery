define(['backbone', 'app/app'], function(none, app) {
    return Backbone.Model.extend({
        notEmpty: function() {
            return this.get('url') || this.get('description');
        },
    });
});
