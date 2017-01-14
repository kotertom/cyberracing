/**
 * Created by tom on 2016-12-20.
 */

function Composite(name, owner) {
    this.name = name;
    this.owner = owner;
}
Composite.prototype.getName = function () {
    return this.name;
};
Composite.prototype.getOwner = function () {
    return this.owner;
};