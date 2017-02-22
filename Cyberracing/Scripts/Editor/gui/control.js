/**
 * Created by tom on 2017-02-20.
 */


function Control() {

}

Control.prototype.defineProperties({

    generatedDom: {
        get: function () {
            return this._generatedDom;
        },
        set: function (value) {
            this.parentNode.replaceChild(value, this._generatedDom);
            this._generatedDom = value;
        }
    },

    parentNode: {
        get: function () {
            return this._parentNode;
        },
        set: function (value) {
            this.parentNode.removeChild(this.generatedDom);
            this._parentNode = value;
        }
    },

    bindingContext: {
        get: function () {
            return this._bindingContext;
        },
        set: function (value) {
            this._bindingContext = value;
        }
    },

    bind: {
        value: function (obj, prop) {
            this.unbind();
            // path = path.split('/');
            this.binding = {
                obj: obj,
                prop: prop
            };
            editor.notifyPropertyChanged.subscribe(this.updateDom, this);
        },
        writable: true
    },

    unbind: {
        value: function () {
            this.binding = {
                obj: null,
                prop: ''
            };
            editor.notifyPropertyChanged.unsubscribe(this.updateDom, this);
        }
    },

    bindProperty: {
        value: function (prop, obj, objProp) {

        }
    },

    unbindProperty: {
        value: function (prop) {

        }
    },

    updateDom: {
        value: function () {

        },
        writable: true,
        configurable: true
    }
});

Control.defineProperties({

});