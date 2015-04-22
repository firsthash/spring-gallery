define(['backbone', 'bootstrap'], function() {
    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({
        events: {},

        // Instead of generating a new element, bind to the existing element
        el: $("#container"),

        // At initialization we bind to the relevant events on the 'Collection'
        // collection, when items are added or changed.
        initialize: function(options) {
            this.options = options;

            this.bindCarouselKeys();

            //this.listenTo(this.collection, 'add', this.addOne);


            // collection of GalleryModel
            this.listenToOnce(this.collection, 'sort', function() {this.addAll(); this.listenTo(this.collection, 'add', this.addOne);});



            console.log('AppView.initialize()', this.collection);

            // all models have been loaded
            this.listenTo(this.collection, 'sync', function(collection) {
                var isCollection = collection instanceof Backbone.Collection;
                if (!isCollection) {
                    return;
                }

                new this.options.SectionView({model: collection.findWhere({name: 'header'}), collection: collection, el: $('#header'), GalleryModel: this.options.GalleryModel}).render();
                new this.options.ContactsView({model: collection.findWhere({name: 'contacts'}), collection: collection, el: $('#contacts'), GalleryModel: this.options.GalleryModel}).render();
                new this.options.SectionView({model: collection.findWhere({name: 'footer'}), collection: collection, el: $('#footer'), GalleryModel: this.options.GalleryModel}).render();

                // TODO: admin responsibility in normal class
                // Is it editable mode?
                if (!this.editable) {
                    this.$('[contentEditable]').removeAttr('contentEditable');
                }
            });


            this.collection.fetch();
        },

        // NOTE: main UI logic, think of it like entry point
        // compose UI pieces together
        addOne: function(model) {
            console.log("AppView.addOne()", model.get('index'));

            // TODO: refactor code below
            // TODO: move to admin.js
            var name = model.get('name');
            if (name == null) {
                console.log("JSON object contains wrong data", model);
                return;
            }

            // TODO: weak code
            if (name.startsWith('GalleryModel')) {

                // TODO: header, footer, contacts views will be created separately

                console.log('galleryModelCollection add');
                console.log('GalleryModel images', model.get('images'));

                // NOTE: we share images among all galleries
                var collection = this.options.imageModelCollection;
                var view = new this.options.GalleryModelView({model: model, collection: collection,
                    CarouselItemView: this.options.CarouselItemView, ImageModelView: this.options.ImageModelView});

                // 'append' instead of 'prepend' to asc sorting
                this.$('#galleries').append(view.render().el);
            }
        },

        bindCarouselKeys: function() {
            $(document).keydown(function(e) {
                var main = require('app/main');
                var carousel = main.lastCarousel;
                var modal = main.lastModal;
                if (carousel == null || modal == null) {
                    return true;
                }

                // global shortcuts
                switch (e.keyCode) {
                    case 37:
                        console.log("left pressed", carousel);
                        carousel.carousel('prev');
                        return false;
                    case 39:
                        console.log("right pressed", carousel);
                        carousel.carousel('next');
                        return false;
                    case 27:
                        console.log("escape pressed", carousel);
                        modal.modal('hide');
                        return false;
                }
            });
        },

        // Add all items in the collection at once.
        addAll: function() {
            console.log('add all', this.collection.length);
            this.collection.each(this.addOne, this);
            // collection doesn't contain any models
            if (this.collection.length == 3) {
                var model = new Backbone.Model({name: "GalleryModel99", id: 99});
                this.addOne(model);
            }
        }

    });

    return AppView;
});
