define(['backbone', 'bootstrap'], function() {
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
            // TODO: investigate why routine called three times???
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

            console.log('LOG', model.toJSON());
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

    return CarouselItemView;
});
