define(['backbone', 'app/app', 'app/view/MenuItemView'],
    function(Backbone, app, MenuItemView) {
        return Backbone.View.extend({
            tagName: 'ul',
            className: 'nav',
            active: [null], // static variable
            items: null,
            isRoot: false,
            initialize: function(){
                if (!this.active())
                    this.active(this);

                this.collection.on('add', this.onAdd, this);

                if (this.collection.length > 0) {
                    this.collection.each(this.onAdd, this);
                }
            },
            active: function(menu){
                if (menu)
                    this.active[0] = menu;
                else
                    return this.active[0];
            },
            onAdd: function(model, index){
                if (this.items == null) {
                    this.items = [];
                }
                model.set('position', index + 1);
                var menuItem = new MenuItemView({model: model, menu: this});
                this.items.push(menuItem);
                this.$el.append(menuItem.render().el);
            },
            itemIndex: function(){
                var itemIndex = 0;
                _.each(this.active().items, function(item, index){
                    if (item.$el.hasClass('active')){
                        itemIndex = index;
                    }
                }, this);
                return itemIndex;
            },
            item: function(index){
                return this.active().items[index];
            },
            prevItem: function(){
                var itemIndex = this.itemIndex();
                if (itemIndex <= 0)
                    itemIndex = this.active().items.length;
                return this.active().items[itemIndex - 1];
            },
            nextItem: function(){
                var itemIndex = this.itemIndex();
                if (itemIndex == (this.active().items.length - 1))
                    itemIndex = -1;
                return this.active().items[itemIndex + 1];
            },
            hasNextItem: function(){
                var ret = false;
                if (this.nextItem().hasContent() && this.prevItem().hasContent())
                    ret = true;
                return ret;
            },
        });
    });
