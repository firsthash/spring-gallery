define(['app/appview_admin'], function(AppView) {

    var module = {};

    module.MenuItem = Backbone.Model.extend({
        url: '/menuitem',
        sync: function(){
            return false;
        },
        notEmpty: function() {
            return this.get('url') || this.get('description');
        },
        cleanup: function() {
            if (this.has('children')) {
                console.log('has children');
                var model;
                var collection = this.get('children');
                while (model = collection.pop()){
                    model.cleanup();
                }
            }
            var url = this.get('content').get('url');
            console.log('deleting', url);
            if (url) {
                $.ajax({
                    url: '/uploadcleanup',
                    type: 'POST',
                    data: url,
                    error: function(xhr, error) {
                        console.log('cleanup error');
                        console.log(error);
                    },
                    cache: false,
                    processData: false,
                    context: this,
                    contentType: 'text/html'
                });
            }

            this.destroy();
        },
    });
    
    module.ContentItem = Backbone.Model.extend({
        url: '/contentitem',
    });

    module.MenuItems = Backbone.Collection.extend({
        model: module.MenuItem,
        url: '/menuitems',
        comparator: 'position',
    });


    // workaround: upload full object graph at once, call 'save' method
    module.MenuWrapper = Backbone.Model.extend({
        url: '/menuitems',
        initialize: function(options) {
            this.items = new module.MenuItems();
            this.data = options.data;
        },
        reset: function(data){
            this.items.reset(data);
        },
        toJSON: function() {
            return this.items.toJSON();
        },
        fetch: function(){
            this.items.on('error', function(){this.reset(this.data);}, this);
            this.items.fetch();
        }
    });




    module.ItemViewBase = Backbone.View.extend({
        baseEvents: {
            'change >input[type=file]': 'uploadFile',
            'change >input[type=text], >textarea': 'saveChanges',
        },
        baseInitialize: function(options) {
            if (!this.events)
                this.events = {};
            _.extend(this.events, this.baseEvents);
            if (options.hide)
                this.hide = options.hide;
        },
        hide: "content-title url style",
        hideFields: function(){
            var arr = this.hide.split(/\s+/);
            _.each(arr, function(str){
                this.$("[data-name={}]".format(str)).addClass('hidden');
            }, this);
        },
        saveChanges: function(e) {
            console.log('saveChanges');
            var el = $(e.target);
            var name = el.data('name').replace(this.prefix, '');
            var value = el.val();
            if (typeof value != 'undefined') {
                if (name == 'position')
                    value = this.filterPos(value, this.model.get(name));
                console.log(value);
                this.model.set(name, value);
            }
        },
        filterPos: function(val, oldVal){
            if (val > oldVal)
                return ++val;
            if (val < oldVal)
                return --val;
            return val;
        },
        uploadFile: function(e) {
            console.log('doUpload');
            var formData = new FormData();
            var file = e.target.files[0];
            formData.append('upload', file);
            $.ajax({
                url: '/menuitemupload',
                type: 'POST',
                data: formData,
                success: function (data) {
                    this.$('>input[data-name=content-url]').val(data).trigger('change');
                },
                error: function(xhr, error) {
                    console.log('upload error');
                    console.log(error);
                },
                cache: false,
                contentType: false,
                processData: false,
                context: this,
            });
            console.log('doUpload');
        },
    });

    module.MenuViewWrapper = Backbone.View.extend({
        template: _.template($('#menu-wrapper-template').html()),
        events: {
            'click >.btn-save-all': 'saveAll',
        },
        el: $('#list'),
        saveAll: function(e){
            console.log('saving to the server');
            this.menu.save();
        },
        initialize: function(options){
            this.menu = new module.MenuWrapper({data: options.data});
            this.listenToOnce(this.menu.items, 'reset', function() {console.log('reset');this.render()});
            this.listenToOnce(this.menu.items, 'sync', function() {console.log('sync');this.render()});
            this.menu.fetch();
        },
        render: function(){
            var view = new module.MenuView({collection: this.menu.items});
            this.$el.append(this.template());
            this.$el.prepend(view.render().el);
            return this;
        },
    });

    module.MenuView = Backbone.View.extend({
        tagName: 'ul',
        events: {
            'click >.btn-add': 'add',
        },
        template: _.template($('#menu-template').html()),
        initialize: function(options) {
            this.hide = options.hide;
        },
        add: function(){
            var model = this.collection.create();
            model.set('position', this.collection.length);
            this.addItem(model);
        },
        id: function(){
            return this.cid;
        },
        render: function(){
            this.$el.append(this.template());
            this.collection.each(function(model, index){
                model.set('position', index + 1);
                this.addItem(model);
            }, this);
            return this;
        },
        addItem: function(model){
            var view = new module.MenuItemView({model: model, menu: this, hide: this.hide});
            var el = view.render().el;
            this.$el.append(el);
        },
    });



    module.MenuItemView = module.ItemViewBase.extend({
        tagName: 'li',
        className: 'panel', // workaround: makes collapse behave like accordion
        template: _.template($('#menu-item-template').html()),
        events: {
            'click .btn-remove': 'removeItem',
        },
        initialize: function(options) {
            this.baseInitialize(options);
            this.menu = options.menu;
        },
        removeItem: function(){
            this.remove();
            this.model.cleanup();
        },
        hasChildren: function(){
            return this.model.has('children') && this.model.get('children') != '';
        },
        render: function(){
            var model = this.model.toJSON();
            model.viewId = this.cid;
            model.parentViewId = this.menu.cid;
            this.$el.append(this.template(model)) && this.hideFields(); // hide some unneeded stuff

            var content = new module.ContentItem(this.model.get('content') || {});
            this.model.set('content', content);
            var contentItem = new module.ContentItemView({model: content, hide: this.hide});

            this.$('.content').append(contentItem.render().el);

            this.addSubmenu(this.model.get('children'));

            return this;
        },
        addSubmenu: function(children){
            var items = new module.MenuItems(children);
            // replace json object with backbone collection
            this.model.set('children', items);
            var menu = new module.MenuView({collection: items, hide: this.model.get('hide')});
            this.$('.collapse').append(menu.render().el);
        },
    });

    module.ContentItemView = module.ItemViewBase.extend({
        tagName: 'span', // workaround: makes form inline
        template: _.template($('#content-item-template').html()),
        prefix: 'content-',
        initialize: function(options) {
            this.baseInitialize(options);
        },
        render: function(){
            this.$el.append(this.template(this.model.toJSON())) && this.hideFields(); // hide some unneeded stuff
            return this;
        },
    });

    // Main Controller
    module.AppView = AppView;

    return module;
});