define(['app/CarouselItemView', 'app/ImageModelView', 'app/GalleryModelView', 'app/SectionView', 'app/AppView'], function(CarouselItemView, ImageModelView, GalleryModelView, SectionView, AppView) {

    var module = {};
    module.CarouselItemView = CarouselItemView;

    module.GalleryModelView = GalleryModelView;

    // TODO: rename to ThumbnailView
    module.ImageModelView = ImageModelView;

    module.ContactsView = module.SectionView = SectionView;

    var urlBase = '/crud/';

    // NOTE: create model so 'id' will be generated on server
    // NOTE: example1: 'Collection.create(new Model(), {wait: true})'
    // NOTE: example2: 'new Model({urlRoot: 'model_url'}).save()'

    module.GalleryModel = Backbone.Model.extend({
        url: urlBase + 'GalleryModel',
    });

    var GalleryModelCollection = Backbone.Collection.extend({
        model: module.GalleryModel,
        url: urlBase + 'GalleryModel',
        comparator: 'index'
    });

    module.galleryModelCollection = new GalleryModelCollection;

    var ImageModel = Backbone.Model.extend({
    });

    var ImageModelCollection = Backbone.Collection.extend({
        model: ImageModel,

        url: urlBase + 'ImageModel',

        comparator: 'index'

    });

    // Create our global collection
    module.imageModelCollection = new ImageModelCollection;

    // Our overall **AppView** is the top-level piece of UI.
    module.AppView = AppView;

    return module;
});