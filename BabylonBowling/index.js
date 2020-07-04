///<reference path="scripts/babylon.max.js" />



function init() {
    //Init the engine
    var engine = initEngine();
    //Create a new scene
    var scene = createScene(engine);
    //Create the main player camera
    var camera = createFreeCamera(scene);
    //Attach the control from the canvas' user input
    camera.attachControl(engine.getRenderingCanvas());
    //set the camera to be the main active camera;
    scene.activeCamera = camera;
    //create ground
    var ground = CreateGround(scene);
    //create light
    var light=createLight(scene);
}

function initEngine() {
    // Get the canvas element from index.html
    var canvas = document.getElementById("renderCanvas");
    // Initialize the BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

    return engine;
}

function createScene(engine) {
    var scene = new BABYLON.Scene(engine);
    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
    });
    scene.debugLayer.show();
    return scene;
}

function createFreeCamera(scene) {
    var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 1.6, 0), scene);

    camera.speed = 0.8;
    camera.inertia = 0.4;

    return camera;
}
function createLane(scene){
    var ground=BABYLON.Mesh.CreateGround("ground",50,100,1,scene);
    return ground;
}

function createLight(scene){
    var light=new BABYLON.DirectionalLight("light",new BABYLON.Vec3b(0,-1,0),scene);
    return light;
}

