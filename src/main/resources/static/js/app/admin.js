// warning: to apply editions you made you must disable caching in chrome dev panel (gear in the bottom right hand corner)
// or use shortcut ctrl + shift + r (google chrome only?)

define(['./main', 'jquery.ui.sortable'], function(module) {

    // save base class
    var AppView = module.AppView;
    module.AppView = module.AppView.extend({
        _events: {
            'click #addGallery': 'addGallery'
        }, initialize: function(options) {
            this.editable = true;
            // call base constructor
            AppView.prototype.initialize.call(this, options);
            _.extend(this.events, this._events);

            console.log('init BaseAppView');

            this.listenTo(this.collection, 'moveUp', this.update);

        },

        update: function() {
            //this.$('#galleries').empty();
            //this.addAll();
            console.log('update collection');
        },

        addGallery: function() {
            console.log('addGallery');
            this.collection.create(new module.GalleryModel(), {wait: true});
            // wait till server returns new id
            // click on last form
            _.delay(function() {$('input:file:last').click()}, 1000);
            return false;
        }
    });

    // editable header
    var SectionView = module.SectionView;
    module.SectionView = module.SectionView.extend({
        initialize: function() {
            SectionView.prototype.initialize.call(this);

            _.extend(this.events, this._events);
        }, _events: {
            'focusout': 'onfocusout'
        }, getContent: function() {
            // purpose to override
            return this.$el.html().trim();
        }, onfocusout: function() {
            console.log("SectionView.focusout", this.$el);

            var content = this.getContent();

            var oldContent = this.model.get('header').trim();

            // resize number of post requests, save changes
            if (oldContent != content) {
                console.log('header changed');
                this.model.set('header', content).save();
            }
        }
    });

    module.ContactsView = module.SectionView;

    var ContactsView = module.ContactsView;
    module.ContactsView = module.ContactsView.extend({
        initialize: function() {
            ContactsView.prototype.initialize.call(this);

            // remember, add handlers, do not replace them all
            this.events['focusout li>a'] = this.onpaste;

            this.addPlaceholder();
        }, // filter placeholder element from saving to database
        getContent: function() {
            var clone = this.$el.clone();

            // rem placeholder
            clone.find('li:last').remove();

            return clone.html().trim();
        }, addPlaceholder: function() {
            this.$('ul').append('<li><a class="editable" contentEditable="true" target="_blank">New Link</a></li>');
        }, onpaste: function(e) {
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
                link.closest('li').remove();
            }

        }, filterName: function(url) {
            var str = url;
            // match to http/https
            var match = /(http.*:\/\/)?(www\.)?(\w*)?/i;
            var res = str.match(match);

            if (res[1]) {
                return res[3];
            } else return null;
        }
    });

    var ImageModelView = module.ImageModelView;
    module.ImageModelView = module.ImageModelView.extend({
        _events: {
            'click .close': '_delete', 'posUpdate': 'posUpdate'
        },

        posUpdate: function(event, index) {
            var oldIndex = this.model.get('index');
            if (oldIndex == index)
                return;

            this.model.set('index', index).save();

            this.$el.data('oldIndex', oldIndex);
            this.$el.data('newIndex', index);
        },

        initialize: function() {
            ImageModelView.prototype.initialize.call(this);

            _.extend(this.events, this._events);

            this.$el.data('view', this);
        },

        attachViewToElement: function() {
            this.$el.data('view', this);
        }, // adds 'x' button to top right corner of image

        render: function() {
            // call base class
            ImageModelView.prototype.render.call(this);

            this.addCloseIcon();
            this.attachViewToElement();

            return this;
        },

        addCloseIcon: function() {
            var close = $('<div class="close delete">&times;</div>');
            this.$el.prepend(close);
        },

        _delete: function() {
            // update index
            this.remove();
            this.model.destroy();
        }
    });

    var CarouselItemView = module.CarouselItemView;
    module.CarouselItemView = module.CarouselItemView.extend({
        _events: {
            'focusout [contenteditable]': 'onfocusout'
        }, initialize: function() {
            CarouselItemView.prototype.initialize.call(this);

            _.extend(this.events, this._events);
        }, onfocusout: function(event) {
            var target = $(event.target);
            // unescape characters
            var embed = target.text().trim();
            console.log('CarouselItemView.focusout');

            // field is not changed
            if (this.embedCode && embed == this.embedCode) {
                return;
            }

            // match returns array or null if not found
            var isTag = embed.match(/<.{10,}>/g);

            // changed to valid embed code or fully erased
            if (isTag || embed == '') {
                this.model.set('embed', embed).save();
                this.render();
                this.lazyLoad();
            }

            // all others, must be last
            target.text(this.embedMessage);
        }, render: function() {
            CarouselItemView.prototype.render.call(this);

            this.addEmbed();

            return this;
        }, addEmbed: function() {
            this.embedMessage = "Paste embed code here";
            this.embedCode = this.model.get('embed');

            var tmpl = '<h4 contenteditable="true" style="color: white;"><<- embed >></h4>';
            var embed = _.template(tmpl, {embed: this.embedCode || this.embedMessage});
            this.$el.append(embed);
        }
    });

    // save ref to call base class constructor later
    var GalleryModelView = module.GalleryModelView;

    //require(['app/GalleryModelViewAdmin'], function(GalleryModelViewAdmin) {
    //   module.GalleryModelView = GalleryModelViewAdmin;
    //});

    module.GalleryModelView = module.GalleryModelView.extend({
        _events: {
            'sortstart .thumbnails': 'sortstart',
            'sortstop .thumbnails': 'sortstop',
            'focusout .header': 'focusout',
            'click .upload-btn': 'uploadClicked',
            'click .add-btn': 'addClicked',
            'click .up-btn': 'upClicked',
            'click .delete-btn': 'deleteClicked'
        },

        addNewCarouselItem: function(thumbs) {
            return thumbs;
        },

        addPseudoElems: function() {
            // NOP, so pseudo elements don't showed up
        },

        initialize: function(options) {
            GalleryModelView.prototype.initialize.call(this, options);

            _.extend(this.events, this._events);

            this.listenTo(this.collection, 'delete', this.updateImageIndex);
        },

        addClicked: function() {
            console.log('GalleryModelView:addClicked');
            module.galleryModelCollection.create(new module.GalleryModel(), {wait: true});
            // wait till server returns new id
            // click on last form
            _.delay(function() {$('input:file:last').click()}, 1000);
            return false;
        },

        moveUp: function(pos) {
            console.log('moveUp', pos);
            var collection = $('#galleries').children();
            var cur = collection.get(pos);
            var prev = collection.get(pos - 1);
            $(cur).insertBefore(prev);
        },

        upClicked: function() {
            var filtered = this.model.collection.where({name: 'GalleryModel'});
            var curpos = _.indexOf(filtered, this.model);
            if (curpos == 0) return;
            filtered[curpos - 1].set('index', curpos).save();
            filtered[curpos].set('index', curpos - 1).save();
            this.model.collection.sort();

            this.moveUp(curpos);
        },

        deleteClicked: function() {
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

        uploadClicked: function() {
            var collection = this.collection.where({gallery_id: this.model.get('id')});
            var length = collection.length;

            console.log('upload button clicked');

            // update index
            var indexField = this.$('form input[name="index"]');
            if (!indexField) {
                console.error('unable to find index field');
            }

            // set last index
            console.log('collection length', length);
            indexField.val(length);

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

        sortstart: function(e, ui) {
            this.oldIndex = ui.item.index();
        },

        sortstop: function(e, ui) {
            this.newIndex = ui.item.index();
            if (this.newIndex == this.oldIndex)
                return;

            this.reorderCarousel(ui);
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
            // assign index to new images by triggering sort update
        },

        reorderCarousel: function() {
            var carouselItems = this.$('.carousel-inner>.item');
            // attention: arrays isn't zero based
            var newItem = carouselItems.eq(this.newIndex + 1);
            var oldItem = carouselItems.eq(this.oldIndex + 1);

            if (this.newIndex < this.oldIndex) {
                newItem.before(oldItem);
            } else {
                newItem.after(oldItem);
            }
        },

        // adds big buttons on top of gallery and 'contentEditable' property
        render: function() {

            // base class function call
            GalleryModelView.prototype.render.call(this);

            // sortable initializer
            this.$('.thumbnails').sortable({items: 'li'});

            // 'ajax' file upload form
            var form = _.template($('#upload-template').html(), this.model.toJSON());

            this.$el.append(form);

            // 'onload' triggers three times before place where our event is useful
            var callback = _.bind(this.renderUploaded, this);
            _.delay(callback, 100);

            return this;
        }
    });

    return module;

});