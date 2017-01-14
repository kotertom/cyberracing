/**
 * Created by tom on 2017-01-13.
 */

var Shaders = (function (ns) {

    ns.Vertex = (function (ns) {


        return ns;
    })(ns.Vertex || {});


    ns.Fragment = (function (ns) {

        return ns;
    })(ns.Fragment || {});


    ns.loadShaderFromDOM = function (gl, id, type) {

        let domScript = document.getElementById(id);
        if(!domScript)
        {
            throw "Couldn't load shader of id: "+id;
        }

        let shaderSource = domScript.text;
        if(!type)
        {
            if(domScript.type == "x-shader/x-vertex")
                type = gl.VERTEX_SHADER;
            else if (domScript.type = "x-shader/x-fragment")
                type = gl.FRAGMENT_SHADER;
            else {
                throw "Unrecognizable type";
            }
        }

        let shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSource);

        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    };
    
    
    ns.linkProgram = function (gl, vertexShader, fragmentShader) {
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        {
            console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
            return null;
        }

        return shaderProgram;
    };

    ns.createProgramFromIds = function (gl, vertexShaderId, fragmentShaderId) {
        let vs = ns.loadShaderFromDOM(gl, vertexShaderId);
        let fs = ns.loadShaderFromDOM(gl, fragmentShaderId);
        return ns.linkProgram(gl, vs, fs);
    };


    return ns;
})(Shaders || {});