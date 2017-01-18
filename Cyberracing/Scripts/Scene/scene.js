/**
 * Created by tom on 2016-12-20.
 */

var App = (function (ns) {

    ns.Scene = (function (ns) {

        ns.Scene = function Scene() {
            this.root = new SceneObject();
            this.ambientLightColor = [0,0,0,1];
            this.backgroundColor = [0,0,0,1];
            this.lights = {
                buffers: {
                    type: gl.createBuffer(),
                    position: gl.createBuffer(),
                    direction: gl.createBuffer(),
                    angle: gl.createBuffer()
                },
                arrays: {
                    type: [],
                    position: [],
                    direction: [],
                    angle: []
                }
            };
            this.restart();
        };
        ns.Scene.prototype.restart = function () {
            let clr = this.backgroundColor;
            gl.clearColor(clr[0], clr[1], clr[2], clr[3]);
        };
        ns.Scene.prototype.updateLights = function () {
            let buf = this.lights.buffers;
            let arr = this.lights.arrays;

            gl.bindBuffer(gl.ARRAY_BUFFER, buf.type);
            gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(arr.type), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, buf.position);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr.position), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, buf.direction);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr.direction), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, buf.angle);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr.angle), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        };
        ns.Scene.prototype.earlyUpdate = function () {
            treeWalkDFS(this, 'earlyUpdate');
        };
        ns.Scene.prototype.update = function () {
            treeWalkDFS(this, 'update');
        };
        ns.Scene.prototype.lateUpdate = function () {
            treeWalkDFS(this, 'lateUpdate');
        };
        ns.Scene.prototype.render = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            this.updateLights();
            treeWalkDFS(this, 'render');
        };
        ns.Scene.prototype.lateRender = function () {
            treeWalkDFS(this, 'lateRender');
        };
        ns.Scene.prototype.getObjectByName = function (name) {
            let stack = [tree.root];
            while(stack.length > 0)
            {
                let obj = stack.pop();
                for(let child of obj.children)
                    stack.push(child);

                if(obj.name == name)
                    return obj;
            }
        };
        ns.Scene.prototype.getLights = function () {
            let lights = {};
            lights.ambient = this.ambientLightColor;
            lights.scene = [];
            treeWalkDFSC(this.root, function (obj) {
                let light = obj.getComposite('light');
                if(!light)
                    return false;
                lights.scene.push({type:light.emitter.getName(), emitter:light.emitter});
                return false;
            });
        };
        ns.Scene.prototype.add = function (obj, parent) {
            if(!this.getObjectByName(parent.name))
                return false;
            if(obj.getComposite('light'))
                this.lights.push(obj);
            parent.children.push(obj);
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

            return true;
        };

        function treeWalkDFS(tree, methodName) {
            let stack = [ tree.root ];
            while(stack.length > 0)
            {
                let obj = stack.pop();
                for(let child of obj.children)
                    stack.push(child);

                for(let compositeName in obj.composites)
                {
                    let composite = obj.composites[compositeName];
                    if(composite[methodName])
                        composite[methodName]();
                }

            }
        }

        function treeWalkDFSC(tree, vertexProcessingCallback) {
            let stack = [ tree.root ];
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