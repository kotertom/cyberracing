/**
 * Created by tom on 2017-02-21.
 */


var itemsChanged = new CustomEvent();

function CollectionControl() {
    Control.call(this);
    itemsChanged.subscribe(this.onItemsChanged, this);
}
CollectionControl.inheritsFrom(Control);

CollectionControl.prototype.defineProperties({

    itemSource: {
        get: function () {
            return this._itemSource;
        },
        set: function (value) {
            this._itemSource = value;
            this.updateDom();
        }
    },

    itemControlConstructor: {

    },

    items: {

    },

    onItemsChanged: {
        value: function (sender, e) {
            if(sender !== this.itemSource)
                return;

            if(e.action == 'deleted') {
                this.items.splice(e.i, 1);
            } else if(e.action == 'added') {
                this.items.splice(e.i, 0, new this.itemControlConstructor());
            }
        }
    }

});

CollectionControl.defineProperties({

});