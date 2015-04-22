define(['backbone'], function() {
    var SectionView = Backbone.View.extend({
        // add chance to override
        events: {},
        assignContent: function() {
            // display default value instead of empty one
            var header = this.model.get('header').trim();
            if (header) {
                //console.log("SectionView header is not empty", header);
                this.$el.html(header);
            }
            // bypass blinking of default content
            this.$el.fadeIn(1000);
        },

        initialize: function(opts) {
            this.options = opts;
            if (!this.model) {
                console.log("id of section is ", this.$el.prop('id'));
                var newModel = new this.options.GalleryModel({
                    // TODO: hardcoded stuff
                    name: this.$el.prop('id'),
                    header: this.$el.html()
                });
                // get model's id from server
                this.model = this.collection.create(newModel, {wait: true});
            }

            this.assignContent();
        }
    });

    return SectionView;
});
