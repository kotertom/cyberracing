/**
 * Created by tom on 2016-12-20.
 */


function SceneObject() {
    this.transform = new Transform();
}
SceneObject.getComposite = function (compositeName) {
    return this[compositeName];
};
SceneObject.addComposite = function (composite) {
    if(this[composite.getName()])
        Error("ERROR: composite already exists on this object");
    this[composite.getName()] = composite;
};