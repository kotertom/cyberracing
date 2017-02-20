/**
 * Created by tom on 2017-01-13.
 */

var Shaders = (function (ns) {

    ns.programs = {};
    ns.materials = {};


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

        return compileShaderSource(gl, shaderSource, type);
    };

    ns.getTextFromId = function (id) {
        let domScript = document.getElementById(id);
        if(!domScript)
        {
            throw "Couldn't load shader of id: "+id;
        }

        return domScript.text;
    };

    function compileShaderSource(gl, source, type) {

        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);

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

    ns.createProgramFromSource = function (gl, vsText, fsText) {
        let vs = compileShaderSource(gl, vsText, gl.VERTEX_SHADER);
        let fs = compileShaderSource(gl, fsText, gl.FRAGMENT_SHADER);
        return ns.linkProgram(gl, vs, fs);
    };

    ns.Material = function (gl, shaderProgram, matInfo, preprocessCallback, renderCallback) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;
        this.preprocessCallback = preprocessCallback;
        this.renderCallback = renderCallback;
        this.diffColor = matInfo.diffColor || Vector.one(4);
        this.specColor = matInfo.specColor || Vector.one(4);
        this.kA = matInfo.kA || Vector.singleValue(3, 0.1);
        this.kD = matInfo.kD || Vector.singleValue(3, 0.1);
        this.kS = matInfo.kS || Vector.singleValue(3, 0.1);
        this.roughness = matInfo.roughness || 0.2;
        this.specType = matInfo.specType || SPECULAR_TYPE.PHONG;
    };
    ns.Material.prototype.preprocess = function (mesh, buffers) {
        this.preprocessCallback(mesh, buffers);
    };
    ns.Material.prototype.render = function (mesh, meshBuffers, lights, modelMatrix, viewMatrix, projectionMatrix) {
        this.renderCallback(mesh, meshBuffers, lights, modelMatrix, viewMatrix, projectionMatrix);
    };
    ns.Material.prototype.setActive = function () {
        this.gl.useProgram(this.shaderProgram);
    };


    return ns;
})(Shaders || {});

function initShaders(gl) {
    let s = Shaders;
    let p = Shaders.programs;

    p.flat = s.createProgramFromIds(gl, 'vs-flat', 'fs-flat');
    p.gouraud = s.createProgramFromIds(gl, 'vs-gouraud', 'fs-gouraud');
    //p.phong = s.createProgramFromIds(gl, 'vs-phong', 'fs-phong');


    p.testing = s.createProgramFromIds(gl, 'vertex-shader', 'fragment-shader');
}