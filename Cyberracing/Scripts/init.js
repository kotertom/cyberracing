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

    App.start = new CustomEvent();
    App.earlyUpdate = new CustomEvent();
    App.update = new CustomEvent();
    App.lateUpdate = new CustomEvent();
    App.earlyRender = new CustomEvent();
    App.render = new CustomEvent();
    App.lateRender = new CustomEvent();


    initShaders(gl);
    initMaterials(gl);
    initInput();

    App.earlyUpdate.subscribe(updateAxes);



    App.fixedDeltaT = 1 / 60;
    App.fixedDeltaTms = 1000 * App.fixedDeltaT;

    App.running = true;
    App.lastUpdate = performance.now();
    App.lastRender = App.lastUpdate;

    App.activeScene = new App.Scene.Scene();

    // let track = [];
    // let track1 = new SceneObject('track1');
    // track1.addComponent(new MeshRenderer(gl, loadMeshFromObj('obj/track_crossing.obj')));
    // App.activeScene.add(track1);
    // track.push(track1);
    //
    // let track2 = new SceneObject('track2');
    // track2.addComponent(new MeshRenderer(gl, loadMeshFromObj('obj/track_straight.obj')));
    // track2.addComponent(new Script({
    //     start: function () {
    //         let t = this.owner.getComponent('transform');
    //         t.position = [10,0,0];
    //     }
    // }));
    // App.activeScene.add(track2);
    // track.push(track2);

    createTrack();

    let cube = new SceneObject('cube');
    cube.addComponent(new MeshRenderer(gl, loadMeshFromObj('obj/toyota.obj')));
    cube.addComponent(new Script({
        start: function () {
            let transform = this.getOwner().getComponent('transform');
            transform.position = [0,0,-5];//[10*Math.sin(performance.now()/1000),0,-5];
           // transform.rotation = [Math.PI/4,(performance.now()/1000),0];
        }
    }));
    cube.addComponent(new PlayerController());
    cube.addComponent(new Rigidbody());
    cube.addComponent(new CarMovement());
    App.activeScene.add(cube);
    let wheels = {
        fl: new SceneObject('wheel_fl'),
        fr: new SceneObject('wheel_fr'),
        rl: new SceneObject('wheel_rl'),
        rr: new SceneObject('wheel_rr')
    };
    wheels.fl.parent = cube;
    wheels.fr.parent = cube;
    wheels.rl.parent = cube;
    wheels.rr.parent = cube;
    wheels.fl.getComponent('transform').position = [0,0,1];
    wheels.fr.getComponent('transform').position = [0,0,1];
    cube.getComponent('carMovement').wheels = wheels;

    console.log(cube);

    let followerCamera = new SceneObject('camera');
    followerCamera.addComponent(new Camera(75, null, 0.1, 1000));
    let fc = new FollowerCamera();
    fc.objectToFollow = cube;
    fc.relativePosition = [0, 5, -10];
    followerCamera.addComponent(fc);
    App.activeScene.add(followerCamera);
    App.activeCamera = followerCamera;

    let staticCamera = new SceneObject('staticCamera');
    staticCamera.addComponent(new Camera(75, null, 0.1, 1000));
    staticCamera.addComponent(new Script({
        start: function () {
            let transform = this.owner.getComponent('transform');
            transform.position = [-50,50,50];
        },
        lateUpdate: function () {
            let transform = this.owner.getComponent('transform');
            transform.lookAt(cube.getComponent('transform').position);
        }
    }));
    App.activeScene.add(staticCamera);

    let dashboardHelper = new SceneObject('dashboardHelper');
    App.activeScene.add(dashboardHelper, cube);
    dashboardHelper.addComponent(new Script({
        start: function () {
            let ct = cube.getComponent('transform');
            let t = this.owner.getComponent('transform');
            t.position = ct.position.vec3.add([0,1,2].vec3).toArray();
        }
    }));
    let dashboardCamera = new SceneObject('dashboardCamera');
    dashboardCamera.addComponent(new Camera(90, null, 0.1, 1000));
    dashboardCamera.getComponent('transform').position = [0,1.3,0];
    let dc = new FollowerCamera();
    dc.objectToFollow = dashboardHelper;
    dc.relativePosition = [0, 1, -2];
    // dashboardCamera.addComponent(dc);
    App.activeScene.add(dashboardCamera, cube);
    console.log("dash parent: ",dashboardCamera.parent);


    let helperObject = new SceneObject('helperObject');
    helperObject.addComponent(new SwapCamera([
        followerCamera,
        staticCamera,
        dashboardCamera
    ]));
    App.activeScene.add(helperObject);

    let pLight = new SceneObject('pLight');
    pLight.addComponent(new Light(PointLightEmitter));
    let ple = pLight.getComponent('light');
    ple.emitter.color = [1.0, 0.0, 0.0, 1.0];
    pLight.addComponent(new MeshRenderer(gl, loadMeshFromObj('obj/bulb.obj')));
    pLight.addComponent(new Script({
        render: function () {
            let transform = this.getOwner().getComponent('transform');
            transform.position = [-10,4,-5];
            transform.rotation = [0,Math.PI/4,0];
            return;
            let t = App.activeScene.getObjectByName('cube').getComponent('transform');
            transform.position = Vector.add(t.position, [5*Math.sin(performance.now()/1000), 3, 5*Math.cos(performance.now()/1000)]);
        }
    }));
    App.activeScene.add(pLight);

    let sLight = new SceneObject('sLight');
    sLight.addComponent(new Light(PointLightEmitter));
    let le = sLight.getComponent('light');
    le.emitter.exponent = 2;
    le.emitter.angle = 40;
    le.emitter.color = [0.0, 0.0, 1.0, 1.0];
    sLight.addComponent(new MeshRenderer(gl, loadMeshFromObj('obj/bulb.obj')));
    sLight.addComponent(new Script({
        render: function () {
            let t = this.getOwner().getComponent('transform');
            let t2 = App.activeScene.getObjectByName('cube').getComponent('transform');
            t.position = [10,4,-5];
            let le = sLight.getComponent('light');
            if(!le)
                return;
            le.emitter.direction = Vector.normalize(Vector.sub(t2.position, t.position));
        }
    }));
    App.activeScene.add(sLight);

    // let sun = new SceneObject('sun');
    // sun.addComponent(new Light(DirectionalLightEmitter, [1,1,0,1]));
    // sun.addComponent(new MeshRenderer(gl));
    // sun.addComponent(new Script({
    //     update: function () {
    //         let t = this.owner.getComponent('transform');
    //         let l = this.owner.getComponent('light');
    //
    //         t.rotation = [0,0,performance.now()/10000];
    //         l.emitter.direction = [0,-1,0];
    //     }
    // }));
    // App.activeScene.add(sun);


    let waypoints = [
        createWaypoint([0,0,20]),
        // createWaypoint([0,0,40]),
        createWaypoint([0,0,60]),

        // createWaypoint([20,0,60]),
        createWaypoint([40,0,60]),
        // createWaypoint([40,0,40]),
        createWaypoint([40,0,20]),

        // createWaypoint([20,0,20]),
        // createWaypoint([0,0,20]),
        // createWaypoint([-20,0,20]),
        // createWaypoint([-40,0,20]),
        createWaypoint([-60,0,20]),

        // createWaypoint([-60,0,0]),
        // createWaypoint([-60,0,-20]),
        createWaypoint([-60,0,-40]),

        // createWaypoint([-40,0,-40]),
        // createWaypoint([-20,0,-40]),
        createWaypoint([0,0,-40]),

        createWaypoint([0,0,-20]),
        createWaypoint([0,0,0])
    ];
    for(let wp of waypoints)
        App.activeScene.add(wp);


    createOpponent([7.5,0,5], waypoints);
    createOpponent([-7.5,0,-5], waypoints);
    createOpponent([7.5,0,-15], waypoints);
    createOpponent([-7.5,0,-25], waypoints);
    createOpponent([7.5,0,-35], waypoints);
    // createOpponent([-7.5,0,-20], waypoints);
    // createOpponent([7.5,0,-25], waypoints);
    // createOpponent([-7.5,0,-30], waypoints);

    App.getViewMatrix = function () {
        return this.activeCamera.getComponent('camera').getViewMatrix();
    };
    App.getProjectionMatrix = function () {
        return this.activeCamera.getComponent('camera').getPerspectiveMatrix();
    };

    App.render.subscribe(function () {
        App.activeScene.render();
    });
    App.lateRender.subscribe(function () {
        App.activeScene.lateRender();
    });
    App.earlyUpdate.subscribe(function () {
        App.activeScene.earlyUpdate();
    });
    App.update.subscribe(function () {
        App.activeScene.update();
    });
    App.lateUpdate.subscribe(function () {
        App.activeScene.lateUpdate();
    });
    App.start.subscribe(function () {
        App.activeScene.start();
    });


    App.start.raise();
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

    App.nextUpdate = App.lastUpdate + App.fixedDeltaTms;
    let catchupTicks = 0;

    let timeSinceLastUpdate = tFrame - App.nextUpdate;
    if(timeSinceLastUpdate > 0)
    {
        for(let timeRemaining = timeSinceLastUpdate; timeRemaining >= App.fixedDeltaTms; timeRemaining -= App.fixedDeltaTms)
        {
            App.lastUpdate += App.fixedDeltaTms;

            App.earlyUpdate.raise();
            App.update.raise();
            App.lateUpdate.raise();
        }
    }

    //App.lastUpdate = performance.now();

    App.earlyRender.raise();
    App.render.raise();
    App.lateRender.raise();

    App.lastRender = tFrame;
}

function resizeCanvas() {
    gameCanvas.width = window.innerWidth;//document.body.clientWidth;
    gameCanvas.height = window.innerHeight;// document.body.clientHeight;
    gl.viewport(0, 0, gameCanvas.width, gameCanvas.height);
}

function createTrack() {
    createTrackSegment('track_finish', [0,0,0], [0,toRad(90),0]);
    createTrackSegment('track_crossing', [0,0,20], [0,0,0]);
    createTrackSegment('track_straight', [0,0,40], [0,toRad(90),0]);
    createTrackSegment('track_turn', [0,0,60], [0,0,0]);

    createTrackSegment('track_straight', [20,0,60], [0,0,0]);
    createTrackSegment('track_turn', [40,0,60], [0,toRad(90),0]);
    createTrackSegment('track_straight', [40,0,40], [0,toRad(90),0]);
    createTrackSegment('track_turn', [40,0,20], [0,toRad(180),0]);

    createTrackSegment('track_straight', [20,0,20], [0,0,0]);
    createTrackSegment('track_straight', [-20,0,20], [0,0,0]);
    createTrackSegment('track_straight', [-40,0,20], [0,0,0]);
    createTrackSegment('track_turn', [-60,0,20], [0,0,0]);

    createTrackSegment('track_straight', [-60,0,0], [0,toRad(90),0]);
    createTrackSegment('track_straight', [-60,0,-20], [0,toRad(90),0]);
    createTrackSegment('track_turn', [-60,0,-40], [0,toRad(-90),0]);
    createTrackSegment('track_straight', [-40,0,-40], [0,0,0]);

    createTrackSegment('track_straight', [-20,0,-40], [0,0,0]);
    createTrackSegment('track_turn', [0,0,-40], [0,toRad(180),0]);
    createTrackSegment('track_straight', [0,0,-20], [0,toRad(90),0]);
}

function createTrackSegment(name, pos, rot) {
    let track = new SceneObject();
    track.addComponent(new MeshRenderer(gl, loadMeshFromObj('obj/'+name+'.obj')));
    track.addComponent(new Script({
        start: function () {
            let t = this.owner.getComponent('transform');
            t.position = pos;
            t.rotation = rot;
        }
    }));
    App.activeScene.add(track);
}

function createWaypoint(pos) {
    let wp = new SceneObject();
    wp.getComponent('transform').position = pos;
    wp.addComponent(new MeshRenderer(gl));

    return wp;
}

function createOpponent(pos, waypoints) {
    let opp = new SceneObject();
    opp.addComponent(new MeshRenderer(gl, loadMeshFromObj('obj/toyota.obj')));
    opp.addComponent(new Script({
        start: function () {
            let transform = this.getOwner().getComponent('transform');
            transform.position = pos;//[10*Math.sin(performance.now()/1000),0,-5];
            // transform.rotation = [Math.PI/4,(performance.now()/1000),0];
        }
    }));
    opp.addComponent(new Rigidbody());
    opp.addComponent(new CarMovement());
    opp.addComponent(new WaypointDriver());
    opp.getComponent('waypointDriver').waypoints = waypoints;
    App.activeScene.add(opp);
}