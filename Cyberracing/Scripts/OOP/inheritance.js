/**
 * Created by tom on 2017-01-16.
 */

Object.prototype.inheritsFrom = function (constructor) {
    this.prototype = Object.create(constructor.prototype);
    this.prototype.constructor = this;
};

function inherit(subConstructor, baseConstructor) {
    subConstructor.prototype = Object.create(baseConstructor.prototype);
    subConstructor.prototype.constructor = subConstructor;
}