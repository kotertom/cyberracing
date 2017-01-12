/**
 * Created by tom on 2016-12-20.
 */

var App = (function (ns) {

    ns.Scene = (function (ns) {

        ns.Scene = function Scene() {
            this.root = new SceneObject();
        };
        ns.Scene.prototype.update = function () {

        };


        return ns;
    })(ns.Scene || {});

    return ns;
})(App || {});