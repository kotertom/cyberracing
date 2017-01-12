/**
 * Created by tom on 2016-12-19.
 *
 * This file should be loaded last in the html file. It does all initialization that is not done by individual modules.
 */

// Do init here.
var App = App || {};
var gl = null;
var gameCanvas = document.getElementById("game-gameCanvas");

(function () {
    document.body.addEventListener("resize", onBodyResize);

    // let gameCanvas = document.getElementById("game-gameCanvas");

    try {
        gl = initWebGl(gameCanvas);
    }
    catch (err) {
        alert(err);
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    App.earlyUpdate = new CustomEvent();
    App.update = new CustomEvent();
    App.lateUpdate = new CustomEvent();
    App.render = new CustomEvent();
    App.lateRender = new CustomEvent();

    App.fixedDeltaT = 1000/60;

    App.running = true;
    App.lastUpdate = performance.now();
    App.lastRender = App.lastUpdate;

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

function onBodyResize() {
    gl.viewport(0, 0, gameCanvas.width, gameCanvas.height);
}