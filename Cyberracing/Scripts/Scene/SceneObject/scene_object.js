/**
 * Created by tom on 2016-12-20.
 */


function SceneObject(scene, name) {
    this.composites = {};
    this.addComposite(new Transform());
    this.parent = scene ? scene.root || null : null;
    this.children = [];
    this.name = name || SceneObject.nameGen.next().value;
    this.disabled = false;
    this.hidden = false;
}
SceneObject.nameGen = (function* () {
    var i = 0;
    while(1)
    {
        yield "SceneObject."+ ( i < 1000 ? ("00"+i).slice(-3) : i);
        i++;
    }
})();
SceneObject.prototype.getComposite = function (compositeName) {
    return this.composites[compositeName];
};
SceneObject.prototype.addComposite = function (composite) {
    if(this.composites[composite.getName()])
        Error("ERROR: Composite already exists on this object");
    this.composites[composite.getName()] = composite;
    composite.owner = this;
};
SceneObject.prototype.removeComposite = function (compositeName) {
    let c = this.getComposite(compositeName);
    if(!c)
        return null;
    this.composites[compositeName] = undefined;
    c.owner = null;
    return c;
};