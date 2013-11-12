// warning: to apply editions you made you must disable cachings in chrome dev panel (gear in the bottom right hand corner)
// or use shortcut ctrl + shift + r (google chrome only?)

// editable mode - on
window.editable = true;

var BaseAppView = AppView;
AppView = AppView.extend({
    _events: {
        'click #addGallery': 'addGallery',
        'click #changeBackground': 'changeBackground'
    },
    initialize: function() {
        BaseAppView.prototype.initialize.call(this);
        _.extend(this.events, this._events);

        //this.listenTo(this.collection, 'sync', this.initBackgroundForm);
        //this.listenTo(imageModelList, 'sync', this.initBackgroundImage);

        console.log('init BaseAppView');
    },
    addForm: function(gallery) {
        this.backgroundGallery = gallery;

        console.log('gallery name, id', gallery.get('name'), gallery.get('id'));

        var form = _.template($('#change-background-template').html(), gallery.toJSON());

        this.$('#changeBackground').after(form);
    },

    initBackgroundForm: function(collection) {
        // sometimes collection is other object. why?
        var isCollection = collection instanceof Backbone.Collection;
        if (!isCollection) {
            return;
        }

        // create or get gallery with name 'changeBackground'
        var gallery = collection.findWhere({name: 'changeBackground'});
        if (!gallery) {
            gallery = new GalleryModel({name: 'changeBackground'});
            collection.create(gallery, {wait: true});
            // NOTE: wait till server assigns id
            this.listenToOnce(collection, 'add', this.addForm);
            return;
        }

        this.addForm(gallery);
    },
    getBackgroundImage: function() {
        if (!this.backgroundGallery) {
            return null;
        }

        // remove all images from gallery
        var id = this.backgroundGallery.get('id');
        console.log('id', id);
        var image = imageModelList.findWhere({gallery_id: id});
        return image;
    },

    initBackgroundImage: function() {
        var image = this.getBackgroundImage();
        console.log('image', image);
        if (!image) {
            return;
        }

        $.backstretch(image.get('file'));
    },
    changeBackground: function() {
        // remove all images from gallery
        var image = this.getBackgroundImage();
        if (image) {
            image.destroy();
        }

        // add new image to gallery
        _.delay(function() {$('#changeBackgroundForm input:file').click()}, 1000);
    },
    addGallery: function() {
        console.log('addGallery');
        this.collection.create(new GalleryModel(), {wait: true});
        // wait till server returns new id
        // click on last form
        _.delay(function() {$('input:file:last').click()}, 1000);
        return false;
    }
});

// editable header
var BaseSectionView = SectionView
SectionView = SectionView.extend({
    initialize: function() {
        BaseSectionView.prototype.initialize.call(this);

        _.extend(this.events, this._events);
    },
    _events: {
        'focusout': 'onfocusout'
    },
    getContent: function() {
        // purpose to override
        return this.$el.html().trim();
    },
    onfocusout: function() {
        console.log("SectionView.focusout");

        var content = this.getContent();

        var oldContent = this.model.get('header').trim();

        // resize number of post requests
        // save changes
        if (oldContent != content) {
            console.log('header changed');
            this.model.set('header', content).save();
        }
    }
})

ContactsView = SectionView;

var BaseContactsView = ContactsView;
ContactsView = ContactsView.extend({
    initialize: function() {
        BaseContactsView.prototype.initialize.call(this);

        // remember, add handlers, do not replace them all
        this.events['focusout li>a'] = this.onpaste;

        this.addPlaceholder();
    },
    // overridden from base class
    getContent: function() {
        var clone = this.$el.clone();

        // rem placeholder
        clone.find('li>a:last').remove();

        var content = clone.html().trim();
        return content;
    },
    addPlaceholder: function() {
        this.$el.append('<li><a class="editable" contentEditable="true" target="_blank">New Link</a></li>');
    },
    onpaste: function(e) {
        var link = $(e.currentTarget);

        // is there something inside anchor?
        // strip chrome paste anchor
        var text = link.text(); // empty field may contain <br/>, <a/>

        // extract name from url
        var name = this.filterName(text);

        // new link placeholder
        if (this.$('li>a:last').text() != "New Link") {
            this.addPlaceholder();
        }

        // change link properties
        if (name) {
            console.log('html', text);
            link.prop('href', text);
            link.text(name);
        }

        // delete link
        if (text == "") {
            // delete 'li'
            link.parent().remove();
        }

    },
    filterName: function(url) {
        var str = url;
        var match = /(http:\/\/)?(www\.)?(\w*)?/i;
        var res = str.match(match);

        if (res[1]) {
            return res[3];
        } else return null;
    }
});

var BaseImageModelView = ImageModelView;
ImageModelView = ImageModelView.extend({
    _events: {
        'click .close': 'delete',
        'posUpdate': 'posUpdate'
    },
    posUpdate: function(event, index) {
        if (this.model.get('index') != index) {
            console.log('updating index:', index, this.model.get('name'));
            this.model.set('index', index).save();
        }
    },
    initialize: function() {
        BaseImageModelView.prototype.initialize.call(this);

        _.extend(this.events, this._events);

        this.$el.data('view', this);
    },

    // adds 'x' button to top right corner of image
    render: function() {
        // call base class
        BaseImageModelView.prototype.render.call(this)

        this.addButton();

        return this;
    },
    addButton: function() {
        var close = $('<div class="close delete">&times;</div>');
        this.$el.prepend(close);
    },
    delete: function() {
        this.remove();
        this.model.destroy();
    }
});

var BaseCarouselItemView = CarouselItemView;
CarouselItemView = CarouselItemView.extend({
    _events: {
        'focusout [contenteditable]': 'onfocusout'
    },
    initialize: function() {
        BaseCarouselItemView.prototype.initialize.call(this);

        _.extend(this.events, this._events);

        // update content immediately
        //this.listenTo(this.model, 'change:embed', this.render);

    },
    onfocusout: function(event) {
        // html has escaped characters
        var embed = $(event.target).text().trim();
        console.log('CarouselItemView.focusout');

        if (this.prevEmbed != embed) {
            this.model.set('embed', embed).save();
            this.render();
            this.lazyLoad();
        }
    },
    render: function() {
        BaseCarouselItemView.prototype.render.call(this);

        this.addEmbed();

        return this;
    },
    addEmbed: function() {
        var tmpl = '<h4 contenteditable="true" style="color: white;">{%- embed %}</h4>';
        var embed = _.template(tmpl, {embed: this.$el.html()});
        this.prevEmbed = this.$el.html().trim();
        this.$el.append(embed);
    }
});

var BaseGalleryModelView = GalleryModelView;
GalleryModelView = GalleryModelView.extend({
    _events: {
        'sortupdate .thumbnails': 'sortupdate',
        'focusout .header': 'focusout',
        'click .upload-btn': 'upload',
        'click .delete-btn': 'delete'
    },

    initialize: function() {
        BaseGalleryModelView.prototype.initialize.call(this);

        _.extend(this.events, this._events);

        this.listenTo(this.collection, 'sync', function() {
            var length = this.collection.where({gallery_id: this.model.get('id')}).length;
            console.log("collection length", length);
            if (length == 0) {
                console.log("prepare to open image select dialog");
                // NOTE: direct click is not working
                this.upload();
            }
        });
    },

    delete: function() {
        console.log('delete button clicked');

        // NOTE: we share images among all galleries
        var length = this.collection.where({gallery_id: this.model.get('id')}).length;

        if (length > 0 && !confirm('Gallery is not empty. Are you sure?')) {
            return false;
        }

        this.model.destroy();

        // don't refresh page
        return false;
    },

    upload: function() {
        console.log('upload button clicked');

        this.$('.upload-hidden').click();

        // don't refresh page
        return false;
    },

    focusout: function(e) {
        // TODO: duplicated code with SectionView, FooterView

        // NOTE: use 'trim' to proper comparison
        var content = $(e.currentTarget).html().trim();
        var oldContent = this.model.get('header').trim();

        // resize number of post requests
        if (oldContent != content) {
            console.log('header changed');
            this.model.set('header', content).save();
        }
    },

    sortupdate: function(e, ui) {
        console.log('sortupdate');

        this.syncWithCarousel(ui);

        this.updateImageIndex();
    },

    updateImageIndex: function() {
        // resort thumbnails
        this.$('li').each(function(index, obj) {
            // redirect event to image view
            $(obj).trigger('posUpdate', index);
        });
    },

    renderUploaded: function() {
        console.log('renderUploaded');
        var callback = _.bind(this.updateAllViews, this);
        this.$('iframe').on('load', callback);
    },

    updateAllViews: function() {
        // NOTE: do sync with server so give a chance to handle 'update' events
        this.collection.fetch();
        console.log('NewGalleryModelView.render()->fetch()');
        // assign index to new images by triggering sort update
    },

    syncWithCarousel: function(ui) {
        var thumbnailItem = ui.item;
        var carouselItem = thumbnailItem.data('carouselItem');
        var thumbnailList = this.$('li');
        var carouselList = this.$('.carousel-inner>.item');
        var newIndex = thumbnailList.index(thumbnailItem);
        var oldIndex = carouselList.index(carouselItem);
        var newItem = carouselList.get(newIndex);
        console.log('move carousel item to index', newIndex);
        if (newIndex > oldIndex) {
            $(newItem).after(carouselItem);

        } else {

            $(newItem).before(carouselItem);
        }
    },

    // adds big buttons on top of gallery and 'contentEditable' property
    render: function() {
        // render upon creation otherwise child views can be removed
        console.log('NewGalleryModelView.render');

        // base class function call
        BaseGalleryModelView.prototype.render.call(this);

        // sortable initializer
        this.$('.thumbnails').sortable({items: 'li'});

        // 'ajax' file upload form
        var form = _.template($('#upload-template').html(), this.model.toJSON())

        this.$el.append(form);

        // 'onload' triggers three times before place where our event is useful
        var callback = _.bind(this.renderUploaded, this);
        _.delay(callback, 100);

        return this;
    }
});
