define(['bootstrap', 'backbone'], function(CarouselItemView, ImageModelView) {
    var GalleryModelView = Backbone.View.extend({
        tagName: 'div',
        template: _.template($('#container-template').html()),
        events: {
            'click .carousel .active img': 'nextImage',
            'slide.bs.carousel .carousel': 'pauseAnimation',
            'slid.bs.carousel .carousel': 'lazyLoad',
            'show.bs.modal .modal': 'lazyLoad',
            'hidden.bs.modal .modal': 'pauseAnimation'
        },
        counter: 0,
        numElems: 20,

        lazyLoad: function() {
            console.log('GalleryModelView, lazyLoad');
            this.$('.carousel .item.active').trigger('lazyLoad');
        },

        pauseAnimation: function() {
            // redirect to correct handler
            console.log('GalleryModelView.pauseAnimation');
            this.$('.item.active').trigger('pauseAnimation');
        },

        nextImage: function() {
            console.log('carousel has been clicked');
            this.$('.carousel').carousel('next');
        },

        initialize: function(options) {
            this.options = options;
            // initialize header on first run
            if (!this.model.get('header')) {
                this.model.set('header', _.template($('#gallery-header-template').html(), {}))
            }

            // TODO: delicately listen to 'change:param' event so re-render only part of big element
            this.listenTo(this.model, 'remove', function() {
                this.remove();
            });

            this.listenTo(this.collection, 'remove', this.removeOne);

            // sort once, right after page load
            this.listenToOnce(this.collection, 'sort', function() {
                // 'add' event fires before 'sort' event
                console.log("collection reset event");
                this.addAll();
                this.listenTo(this.collection, 'add', this.addOne);
            });

            this.listenTo(this.collection, 'reset', function() {console.log("collection reset event");});
            this.listenTo(this.collection, 'change', function(item) {console.log("collection change event", item);});
            this.listenTo(this.collection, 'sync', function(item) {console.log("collection sync event", item);});

            this.collection.fetch();
        },

        removeOne: function(model) {
            // TODO: duplicated code (see admin.js)
            // TODO: move to admin.js
            var models = this.collection.where({'gallery_id': model.get('gallery_id')});
            _.each(models, function(model, index) {
                if (model.get('index') != index) {
                    model.set('index', index).save();
                }
            })
        },

        // NOTE: all child views will be removed after next change
        render: function() {
            console.log('render gallery');
            var el = this.template(this.model.toJSON());
            this.$el.html(el);
            this.$('.embed-carousel').carousel({interval: 2000});
            return this;
        },

        addNewCarouselItem: function(thumbs) {
            if (this.counter != 0 && this.counter % this.numElems == 0) {
                var newThumbs = $('<ul class="thumbnails item"/>');
                thumbs.after(newThumbs);
                thumbs = newThumbs;
            }
            return thumbs;
        },
        appendToCarousel: function(element) {
            var thumbs = this.$('.embed-carousel .thumbnails').last();
            thumbs = this.addNewCarouselItem(thumbs);
            thumbs.append(element);
            this.counter++;
        },
        addOne: function(model, collection) {
            console.log('add item to collection', model);
            // does image belongs to our gallery?
            if (model == undefined || this.model.get('id') != model.get('gallery_id')) {
                return this;
            }

            var carousel = new this.options.CarouselItemView({model: model, collection: collection});
            var thumbnail = new this.options.ImageModelView({model: model, collection: collection});
            thumbnail.gallery = this;
            console.log('collection == null', collection == null);
            // used for sorting capability
            thumbnail.$el.data('carouselItem', carousel.$el);


            var el1 = thumbnail.render().el;
            this.appendToCarousel(el1);
            //this.$('.thumbnails').append(el1);
            var el2 = carousel.render().el;
            this.$('.popup-carousel .carousel-inner').append(el2);

            return this;
        },
        addPseudoElems: function() {
            // remain only our models
            var filter = _.bind(function(model) {
                return model.get('gallery_id') == this.model.get('id');
            }, this);
            var collection = this.collection.filter(filter);

            //var columnsNum = 5;
            //var rowsNum = 4;
            //var total = rowsNum * columnsNum;
            var elemsNum = this.numElems - (collection.length % this.numElems);

            for (var i = 0; i < elemsNum; i++) {
                // remember about element filter inside 'addOne' function
                this.addOne(collection[i], this.collection);
            }
        },
        addAll: function() {
            console.log("gallery add all event");

            this.collection.each(this.addOne, this);

            // there number of such items inside
            this.$('.placeholder').first().remove();

            this.addPseudoElems();
        }

    });

    return GalleryModelView;
});
