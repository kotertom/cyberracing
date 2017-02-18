/**
 * Created by tom on 2016-12-20.
 */


function SceneObject(name) {
    this.components = {};
    this.addComponent(new Transform());
    this.parent = null;
    this.children = [];
    this.name = name || SceneObject.nameGen.next().value;
    this.disabled = false;
    this.hidden = false;

    this.tags = {};
    this.carryParentTags = true;
}
SceneObject.nameGen = (function* () {
    var i = 0;
    while(1)
    {
        yield "SceneObject."+ ( i < 1000 ? ("00"+i).slice(-3) : i);
        i++;
    }
})();

Object.defineProperties(SceneObject.prototype, {
    getComponent: {
        value: function (componentName) {
            return this.components[componentName];
        }
    },

    addComponent: {
        value: function (component) {
            if(this.components[component.getName()])
                Error("ERROR: Component already exists on this object");
            this.components[component.getName()] = component;
            component.owner = this;
        }
    },

    removeComponent: {
        value: function (componentName) {
            let c = this.getComponent(componentName);
            if(!c)
                return null;
            this.components[componentName] = undefined;
            c.owner = null;
            return c;
        }
    },
});

// SceneObject.prototype.getComponent = function (componentName) {
//     return this.components[componentName];
// };
// SceneObject.prototype.addComponent = function (component) {
//     if(this.components[component.getName()])
//         Error("ERROR: Component already exists on this object");
//     this.components[component.getName()] = component;
//     component.owner = this;
// };
// SceneObject.prototype.removeComponent = function (componentName) {
//     let c = this.getComponent(componentName);
//     if(!c)
//         return null;
//     this.components[componentName] = undefined;
//     c.owner = null;
//     return c;
// };

