define(['backbone'], function(Backbone) {
    return Backbone.Router.extend({
        routes: {
            "show/item:id": "show"
        },
        show: function(id) {
            $('#' + id).trigger('click');
            console.log('route:show', id);
        },
    });
});
