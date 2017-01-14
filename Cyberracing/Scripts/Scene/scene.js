/**
 * Created by tom on 2016-12-20.
 */

var App = (function (ns) {

    ns.Scene = (function (ns) {

        ns.Scene = function Scene() {
            this.root = new SceneObject();
            this.ambientLightColor = Vector.zero(4);
            this.backgroundColor = Vector.zero(4);
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
            treeWalkDFS(this, 'render');
        };
        ns.Scene.prototype.lateRender = function () {
            treeWalkDFS(this, 'lateRender');
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


        return ns;
    })(ns.Scene || {});

    return ns;
})(App || {});