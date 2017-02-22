/**
 * Created by tom on 2017-02-21.
 */


function View(model, parentNode) {
    this.model = model;
    this.parentNode = parentNode;
}

View.prototype.defineProperties({

    model: {

    },

    parentNode: {

    },

    dom: {

    },

    rebuildDom: {
        value: function () {

        },
        writable: true
    },
});
