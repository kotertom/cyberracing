/**
 * Created by tom on 2017-01-16.
 */

Object.defineProperty(Object.prototype, 'inheritsFrom', {
    value: function (constructor) {
        this.prototype = Object.create(constructor.prototype);
        this.prototype.constructor = this;
        },
    enumerable: false,
    writable: false
});

Object.defineProperties(Object.prototype, {
    defineProperties: {
        enumerable: false,
        writable: false,
        value: function (arg) {
            return Object.defineProperties(this, arg);
        }
    },
    defineProperty: {
        enumerable: false,
        writable: false,
        value: function (name, opts) {
            return Object.defineProperty(this, name, opts);
        }
    }
});

function inherit(subConstructor, baseConstructor) {
    subConstructor.prototype = Object.create(baseConstructor.prototype);
    subConstructor.prototype.constructor = subConstructor;
}