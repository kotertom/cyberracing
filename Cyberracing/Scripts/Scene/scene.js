/**
 * Created by tom on 2016-12-20.
 */

var App = (function (ns) {

    ns.Scene = (function (ns) {

        ns.Scene = function Scene() {
            this.root = new SceneObject(undefined, 'root');
            this.ambientLightColor = [0,0,0,1];
            this.backgroundColor = [0,0,0,1];
            this.lights = {
                buffers: {
                    type: gl.createBuffer(),
                    position: gl.createBuffer(),
                    direction: gl.createBuffer(),
                    angle: gl.createBuffer()
                },
            };
            this.activeCamera = null;
            this.restart();
        };
        ns.Scene.prototype.restart = function () {
            let clr = this.backgroundColor;
            gl.clearColor(clr[0], clr[1], clr[2], clr[3]);
        };
        ns.Scene.prototype.updateLightBuffers = function () {
            let buf = this.lights.buffers;
            let arr = this.getLightsArray();
            this.lights.ambientColor = this.ambientLightColor;

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
            this.updateLightBuffers();
            treeWalkDFS(this.root, 'render');
        };
        ns.Scene.prototype.lateRender = function () {
            treeWalkDFS(this, 'lateRender');
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
        ns.Scene.prototype.getLightsArray = function () {

            let lights = {
                type: [],
                position: [],
                direction: [],
                angle: []
            };
            treeWalkDFSC(this.root, function (obj) {
                let light = obj.getComposite('light');
                let transform = obj.getComposite('transform');
                if(!light)
                    return false;

                lights.type.push(lightEmitterTypeToInt(light.getEmitterType()));
                lights.position.concat(transform.position);
                lights.direction.concat(light.emitter.direction || Vector.zero(3));
                lights.angle.push(light.emitter.angle || 0);

                return false;
            });
            return lights;
        };
        ns.Scene.prototype.getLightBuffers = function () {
            return this.lights;
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

        function treeWalkDFS(root, methodName) {
            let stack = [ root ];
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