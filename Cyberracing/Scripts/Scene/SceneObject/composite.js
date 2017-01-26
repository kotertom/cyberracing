/**
 * Created by tom on 2016-12-20.
 */

function Composite() {
    this.owner = null;
    this.disabled = false;
}
Composite.prototype.getName = function () {
    let str = this.constructor.name;
    return str.substr(0,1).toLowerCase() + str.slice(1);
};
Composite.prototype.getOwner = function () {
    return this.owner;
};