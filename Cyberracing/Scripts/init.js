/**
 * Created by tom on 2016-12-19.
 *
 * This file should be loaded last in the html file. It does all initialization that is not done by individual modules.
 */

// Do init here.
var App = App || {};
var gl = null;
var gameCanvas = document.getElementById("game-canvas");

(function () {
    // let gameCanvas = document.getElementById("game-gameCanvas");

    try {
        gl = initWebGl(gameCanvas);
    }
    catch (err) {
        alert(err);
        return;
    }

    document.body.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initShaders(gl);
    initMaterials(gl);

    App.earlyUpdate = new CustomEvent();
    App.update = new CustomEvent();
    App.lateUpdate = new CustomEvent();
    App.render = new CustomEvent();
    App.lateRender = new CustomEvent();

    App.fixedDeltaT = 1000/60;

    App.running = true;
    App.lastUpdate = performance.now();
    App.lastRender = App.lastUpdate;

    App.activeScene = new App.Scene.Scene();

    let cube = new SceneObject(App.activeScene, 'cube');
    cube.addComposite(new MeshRenderer(cube, gl));
    App.activeScene.root.children.push(cube);

    let camera = new SceneObject(App.activeScene, 'camera');
    camera.addComposite(new Camera(camera, 75, null, 0.1, 1000));
    App.activeScene.root.children.push(camera);
    App.activeCamera = camera;

    App.getViewMatrix = function () {
        return this.activeCamera.getComposite('camera').getViewMatrix();
    };
    App.getProjectionMatrix = function () {
        return this.activeCamera.getComposite('camera').getPerspectiveMatrix();
    };

    App.render.subscribe(function () {
        App.activeScene.render();
    });


    mainLoop(performance.now());
})();


function initWebGl(canvas) {
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if(!gl)
        throw "Unable to initialize WebGL. Your browser may not support it.";

    return gl;
}

function mainLoop(tFrame) {
    if(App.running)
        window.requestAnimationFrame(mainLoop);

    App.nextUpdate = App.lastUpdate + App.fixedDeltaT;
    let catchupTicks = 0;

    let timeSinceLastUpdate = tFrame - App.nextUpdate;
    if(timeSinceLastUpdate > 0)
    {
        for(let timeRemaining = timeSinceLastUpdate; timeRemaining >= App.fixedDeltaT; timeRemaining -= App.fixedDeltaT)
        {
            App.lastUpdate += App.fixedDeltaT;

            App.earlyUpdate.raise();
            App.update.raise();
            App.lateUpdate.raise();
        }
    }

    App.lastUpdate = performance.now();

    App.render.raise();
    App.lateRender.raise();

    App.lastRender = tFrame;
}

function resizeCanvas() {
    gameCanvas.width = window.innerWidth;//document.body.clientWidth;
    gameCanvas.height = window.innerHeight;// document.body.clientHeight;
    gl.viewport(0, 0, gameCanvas.width, gameCanvas.height);
}