/**
 * Created by tom on 2016-12-20.
 */

var App = (function (ns) {

    ns.Scene = (function (ns) {

        ns.Scene = function Scene() {
            this.root = new SceneObject('root');
            this.ambientLightColor = [0.2,0.2,0.2,1];
            this.backgroundColor = [0.1,0.1,0.1,1];
            this.lights = [];
            this.activeCamera = null;
            this.restart();
        };

        ns.Scene.defineProperties({

            root: {
                get: function () {
                    return this._root;
                },
                set: function (value) {
                    this._root = value;
                    editor.notifyPropertyChanged.raise(this, 'root');
                }
            }
        });

        ns.Scene.prototype.restart = function () {
            let clr = this.backgroundColor;
            gl.clearColor(clr[0], clr[1], clr[2], clr[3]);
        };
        ns.Scene.prototype.updateLights = function () {
            this.lights = [];
            let lights = this.lights;
            lights.push({
                type: LIGHT_TYPE.AMBIENT,
                color: this.ambientLightColor,
                position: Vector.zero(3),
                direction: Vector.zero(3),
                angle: 0,
                exponent: 0
            });
            treeWalkDFSC(this.root, function (obj) {
                let light = obj.getComponent('light');
                let transform = obj.getComponent('transform');
                if(!light)
                    return false;

                lights.push({
                    type: lightEmitterTypeToInt(light.getEmitterType()),
                    color: light.emitter.color,
                    position: transform.position,
                    direction: light.emitter.direction || Vector.zero(3),
                    angle: light.emitter.angle || 0,
                    exponent: light.emitter.exponent || 0
                });

                return false;
            });
        };
        ns.Scene.prototype.start = function () {
            treeWalkDFS(this.root, 'start');
        };
        ns.Scene.prototype.earlyUpdate = function () {
            treeWalkDFS(this.root, 'earlyUpdate');
        };
        ns.Scene.prototype.update = function () {
            treeWalkDFS(this.root, 'update');
        };
        ns.Scene.prototype.lateUpdate = function () {
            treeWalkDFS(this.root, 'lateUpdate');
        };
        ns.Scene.prototype.render = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.updateLights();
            treeWalkDFS(this.root, 'render');
        };
        ns.Scene.prototype.lateRender = function () {
            treeWalkDFS(this.root, 'lateRender');
        };
        ns.Scene.prototype.getObjectByName = function (name) {
            let stack = [ this.root ];
            while(stack.length > 0)
            {
                let obj = stack.pop();
                for(let child of obj.children)
                    stack.push(child);

                if(obj.name == name)
                    return obj;
            }
        };
        ns.Scene.prototype.getObjectByRef = function (obj) {
            let ret = treeWalkDFSC(this.root, function (o) {
                let r = { done: false };
                if(o === obj)
                {
                    r.done = true;
                    r.ret = o;
                }
                return r;
            }) || null;

            return ret;
        };
        ns.Scene.prototype.getLightsArray = function () {
            return this.lights;
        };
        ns.Scene.prototype.add = function (obj, parent) {
            if(!parent)
                parent = this.root;
            if(typeof parent == "string")
            {
                parent = this.getObjectByName(parent);
                if(!parent)
                    return false;
            } else
            {
                if(!this.getObjectByRef(parent))
                    return false;
            }

            obj.parent = parent;
            parent.children.push(obj);
            editor.notifyPropertyChanged.raise(this, 'root');
            return true;
        };
        ns.Scene.prototype.remove = function (obj_or_name) {
            let obj = obj_or_name;
            if(typeof obj == "string")
                obj = this.getObjectByName(obj);
            if(!obj)
                return false;

            let parent = obj.parent;
            let id = parent.children.indexOf(obj);
            parent.children.splice(id,1);
            obj.parent = null;

            editor.notifyPropertyChanged.raise(this, 'root');
            return true;
        };

        function treeWalkDFS(root, methodName) {
            let stack = [ root ];
            while(stack.length > 0)
            {
                let obj = stack.pop();
                if(obj.disabled)
                    continue;
                for(let child of obj.children)
                    stack.push(child);

                for(let componentName in obj.components)
                {
                    let component = obj.components[componentName];
                    if(!component || component.disabled)
                        continue;
                    if(component[methodName])
                    {
                        component[methodName]();
                    }
                }

            }
        }

        function treeWalkDFSC(root, vertexProcessingCallback) {
            let stack = [ root ];
            while(stack.length > 0)
            {
                let obj = stack.pop();
                for(let child of obj.children)
                    stack.push(child);

                let result = vertexProcessingCallback(obj);
                if(result.done)
                    return result.ret;
            }
        }


        return ns;
    })(ns.Scene || {});

    return ns;
})(App || {});