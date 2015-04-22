define(['backbone', 'bootstrap'], function() {
    var ImageModelView = Backbone.View.extend({
        events: {
            'click img': 'showCarousel',
            'load img': 'imageLoaded'
        },

        tagName: "li",

        className: '',

        // Cache the template function for a single item.
        template: _.template($('#item-template').html()),

        initialize: function() {
            // to avoid refresh view again and again
            // so don't bind to 'change' event
        },

        render: function() {
            var template = this.template(this.model.toJSON());
            // simple jquery wrapping produce parse error
            var obj = $(template);
            // overlay real image with placeholder
            this.addHandler(obj);
            this.$el.append(obj);
            return this;
        },

        addHandler: function(obj) {
            // add placeholder while image is loading
            var image = obj.find('img').first();



            image.hide();

            // if you add handler after object has been attached event will not trigger
            image.on('load', _.bind(this.onImageLoad, this, image));
        },

        onImageLoad: function(image) {
            // hide our placeholder
            console.log('image loaded');
            this.$('.placeholder').remove();

            image.fadeIn(500);
        },

        showCarousel: function() {
            // showing 'carousel' inside 'modal'

            // TODO: avoid hardcoded identifiers
            var galleryId = this.model.get('gallery_id');
            var modal = $('#GalleryModel' + galleryId + 'Modal');
            var carousel = $('#GalleryModel' + galleryId + 'Carousel');

            console.log("ImageModelView, viewing gallery with id", galleryId);

            // carousel require to mark one element as 'active'
            if (!carousel.find('.active')[0]) {
                $(carousel.find('.item')[0]).addClass('active');
            }

            // carousel initialization
            carousel.carousel('pause');
            var index = this.model.get('index');
            carousel.carousel(index);
            carousel.carousel('pause');
            modal.modal('show');

            // global carousel, use in App object
            var main = require('app/main');
            main.lastCarousel = carousel;
            main.lastModal = modal;

            // don't open link in browser
            return false;
        }

    });

    return ImageModelView;
});
