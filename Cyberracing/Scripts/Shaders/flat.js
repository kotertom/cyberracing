/**
 * Created by tom on 2017-01-13.
 */

var Shaders = (function (ns) {

    ns.flat = Shaders.createProgramFromIds(App.gl, "vertex-shader", "fragment-shader");

    return ns;
})(Shaders || {});