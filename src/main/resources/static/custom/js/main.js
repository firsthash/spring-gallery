var urlBase = '/crud/';

//_.templateSettings = {
//    evaluate: /\{%([\s\S]+?)%\}/g,
//    interpolate: /\{%=([\s\S]+?)%\}/g,
//    escape: /\{%-([\s\S]+?)%\}/g
//}

// attempt to find template that best works with jsp/jsf technologies
_.templateSettings = {
    evaluate: /<<([\s\S]+?)>>/g,
    interpolate: /<<=([\s\S]+?)>>/g,
    escape: /<<-([\s\S]+?)>>/g
}

// First, checks if it isn't implemented yet.
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(needle) {
        return(this.indexOf(needle) == 0);
    };
}

//first, checks if it isn't implemented yet
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments
        var index = 0
        return this.replace(/{(\d*)}/g, function(match, number) {
            if (!number) {
                number = index
            }
            index++;
            return typeof args[number] != 'undefined' ? args[number] : args[0];
        })
    }
}

var CarouselItemView = Backbone.View.extend({
    tagName: 'div',
    className: 'item',
    template: _.template($('#carousel-item-template').html()),
    events: {
        'pauseAnimation': 'pauseAnimation',
        'lazyLoad': 'lazyLoad'
    },
    toggleVideo: function(state) {
        // if state == 'hide', hide. Else: show video
        var iframe = this.$('iframe')[0];
        if (!iframe) {
            return;
        }
        var contentWindow = iframe.contentWindow;
        var func = state == 'hide' ? 'pauseVideo' : 'playVideo';
        contentWindow.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
    },
    pauseAnimation: function() {
        // stop flash video from playing in background
        if (this.model.get('embed') != "") {
            console.log('CarouselItemView.pauseAnimation');

            // TODO: work only on youtube
            this.toggleVideo('hide');
        }
    },
    lazyLoad: function() {
        // there can be loading placeholder
        var img = this.$('img:not(.placeholder)');
        // don't use img.prop('src'), on empty src it returns http://localhost:8080
        console.log('CarouselItemView, lazyLoad, before if', img.attr('src'));
        if (img.attr('src') == "") {
            console.log('CarouselItemView, lazyLoad, after if');
            img.prop('src', img.data('src'));
        }
    },
    initialize: function() {
        // to avoid image refresh don't bind to 'change' event
        // TODO: why routine called three times???
        this.listenTo(this.model, 'destroy', function(/*mod, col*/) {
            console.log('CarouselItemView destroy');
            this.remove();
        });
    },

    render: function() {
        var index = this.model.get('index');
        var model = this.model;

        // sort 'carousel' along with 'thumbnails'
        if (this.inner) {
            var list = this.inner.find('.item');
            $(list[index]).after(this.el);
        }

        var el = this.template(model.toJSON());
        // if you add handler after object has been attached event will not trigger

        var obj = $($.parseHTML(el));
        // if you add handler after object has been attached event will not trigger
        // show loading figure
        this.addPlaceholder(obj);
        console.log('obj', obj);
        // don't append there may be re-render
        this.$el.html(obj);

        return this;
    },
    addPlaceholder: function(obj) {
        // add placeholder while image is loading
        // trying to set figure always visible
        var image = obj.find('img[data-src]');
        image.on('load', _.bind(this.hidePlaceholder, this, image));
    },
    hidePlaceholder: function(image) {
        // hide our placeholder
        console.log('image loaded');
        this.$('.placeholder').remove();
        //image.fadeIn(500);
    }
});

/////////////////////////////////////////////////////////

// NOTE: create model so 'id' will be generated on server
// NOTE: example1: 'Collection.create(new Model(), {wait: true})'
// NOTE: example2: 'new Model({urlRoot: 'model_url'}).save()'

var GalleryModel = Backbone.Model;

var GalleryModelList = Backbone.Collection.extend({
    model: GalleryModel,
    url: urlBase + 'GalleryModel',
    comparator: 'index'
});

var galleryModelList = new GalleryModelList;

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

    initialize: function() {
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
            // NOTE: 'add' event fires before 'sort' event
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
        // TODO: dublicated code (see admin.js)
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
        console.log('render gallery')
        var el = this.template(this.model.toJSON())
        this.$el.html(el);
        return this;
    },

    addOne: function(model, collection) {
        console.log('add item to collection');
        // accept element that belong to our gallery
        if (this.model.get('id') != model.get('gallery_id')) {
            return this;
        }

        var carousel = new CarouselItemView({model: model, collection: collection});
        var thumbnail = new ImageModelView({model: model, collection: collection});
        thumbnail.gallery = this;
        console.log('collection == null', collection == null);
        // for sorting capability
        thumbnail.$el.data('carouselItem', carousel.$el);

        var el1 = thumbnail.render().el;
        this.$('.thumbnails').append(el1);
        var el2 = carousel.render().el;
        this.$('.carousel-inner').append(el2);

        return this;
    },
    addPseudoElems: function() {
        // remain only our models
        var filter = _.bind(function(model) {
            return model.get('gallery_id') == this.model.get('id');
        }, this);
        var collection = this.collection.filter(filter);

        var columnsNum = 5;
        var elemsNum = columnsNum - (collection.length % columnsNum);

        for (var i = 0; i < elemsNum; i++) {
            // remember about element filter inside 'addOne' function
            this.addOne(collection[i], this.collection);
        }
    },
    addAll: function() {
        console.log("add all event");

        this.collection.each(this.addOne, this);

        this.addPseudoElems();
    }

});

///////////////////////////////////////////////////////////

// Model
// ----------

var ImageModel = Backbone.Model.extend({
});

// Collection
// ---------------

var ImageModelList = Backbone.Collection.extend({
    model: ImageModel,

    url: urlBase + 'ImageModel',

    comparator: 'index'

});

// Create our global collection
var imageModelList = new ImageModelList;

// Item View
// --------------

// TODO: rename to ThumbnailView
var ImageModelView = Backbone.View.extend({
    events: {
        'click img': 'showCarousel',
        'load img': 'imageLoaded'
    },

    tagName: "li",

    className: 'thumbnail',

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    initialize: function() {
        // to avoid refresh view again and again
        // so don't bind to 'change' event
    },

    render: function() {
        var template = this.template(this.model.toJSON());
        // simple jquery wrapping produce parse error
        template = $($.parseHTML(template));
        // show loading placeholder
        this.addPlaceholder(template);
        this.$el.append(template);
        return this;
    },

    addPlaceholder: function(obj) {
        // add placeholder while image is loading
        var image = obj.find('img');
        var el = '<img class="placeholder" src="/static/custom/img/blank.gif"/>';
        image.before(el);
        image.hide();
        // if you add handler after object has been attached event will not trigger
        image.on('load', _.bind(this.imageLoaded, this, image));
    },

    imageLoaded: function(image) {
        // hide our placeholder
        console.log('image loaded');
        this.$('.placeholder').remove();
        image.fadeIn(500);
    },

    showCarousel: function() {
        // showing 'carousel' inside 'modal'

        // TODO: hardcoded identifiers is bad
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
        AppView.lastCarousel = carousel;
        AppView.lastModal = modal;

        // don't open link in browser
        return false;
    }

});

var SectionView = Backbone.View.extend({
    // add chance to override
    events: {},
    assignContent: function() {
        this.$el.html(this.model.get('header'));
    },

    initialize: function() {
        if (!this.model) {
            console.log("id of section is ", this.$el.prop('id'));
            var newModel = new GalleryModel({
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

var ContactsView = SectionView;

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
var AppView = Backbone.View.extend({
    events: {},

    // Instead of generating a new element, bind to the existing element
    el: $("#container"),

    // At initialization we bind to the relevant events on the 'Collection'
    // collection, when items are added or changed.
    initialize: function() {

        this.bindCarouselKeys();

        this.listenTo(this.collection, 'add', this.addOne);
        this.collection.fetch();

        this.listenTo(this.collection, 'sync', function(collection) {console.log("collection sync, lenght", this.collection.length);});
        this.listenTo(this.collection, 'remove', function(collection) {console.log("collection remove, lenght", this.collection.length);});

        console.log('AppView.initialize()', this.collection)

        // all models have been loaded
        this.listenTo(this.collection, 'sync', function(collection) {
            var isCollection = collection instanceof Backbone.Collection;
            if (!isCollection) {
                return;
            }

            new SectionView({model: collection.findWhere({name: 'header'}), collection: collection, el: $('#header')}).render();
            new ContactsView({model: collection.findWhere({name: 'contacts'}), collection: collection, el: $('#contacts')}).render();
            new SectionView({model: collection.findWhere({name: 'footer'}), collection: collection, el: $('#footer')}).render();

            // are we in editable mode?
            if (!window.editable) {
                this.$('[contentEditable]').removeAttr('contentEditable');
            }
        });

    },

    // NOTE: main UI logic, think of it like entry point
    // compose UI pieces together
    addOne: function(model) {
        console.log("AppView.addOne()", model);

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

            console.log('galleryModelList add')
            console.log('GalleryModel images', model.get('images'))

            // NOTE: we share images among all galleries
            var collection = imageModelList;
            var view = new GalleryModelView({model: model, collection: collection});

            // 'append' instead of 'prepend' to asc sorting
            this.$('#galleries').append(view.render().el);
        }
    },

    bindCarouselKeys: function() {
        $(document).keydown(function(e) {
            var carousel = AppView.lastCarousel;
            var modal = AppView.lastModal;
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
        this.collection.each(this.addOne, this);
    }

});

// Top level piece of UI that contains all other elements

// give a chance to subclass 'backbone' objects in admin script
$(function() {
    window.app = new AppView({collection: galleryModelList});
});
