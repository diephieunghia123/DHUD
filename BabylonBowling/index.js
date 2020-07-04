///<reference path="scripts/babylon.max.js" />


var laneheight=0.2;
var lanewidth=0.7;
var lanelength=6;

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
    //create light
    var light= createLight(scene);
    //create ground
    var ground= createGround(scene);     
    //create sphere
    var sphere=createBall(scene);
    //create lane
    var lane=createLane(scene);
    //create gravity
    var grav=createGravity(scene);   
    //create mass
    createMass(scene,sphere,ground);
    createMass2(scene,lane);

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
    var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0.1, 0.9, -5), scene);

    camera.speed = 0.8;
    camera.inertia = 0.4;

    return camera;
}
function createGround(scene){
    var ground=BABYLON.Mesh.CreateGround("ground",3,lanelength,1,scene);

    return ground;
}

function createLight(scene){
    var light=new BABYLON.DirectionalLight("directlight",new BABYLON.Vector3(0,-1,0),scene);
    light.intensity=0.7;
    return light;
}
function createBall(scene){
    var sphere=new BABYLON.Mesh.CreateSphere("ball",12,0.22,scene);
    //sphere location
    sphere.position.y=2;   
    return sphere;
}

function createLane(scene){
    var lane=new BABYLON.Mesh.CreateBox("lane",1,scene,false);
    lane.scaling=new BABYLON.Vector3(lanewidth,laneheight,lanelength);
    lane.position.y=laneheight/2;
    return lane;
}
function createGravity(scene){
    var gravity=scene.enablePhysics();
    return gravity;
}
function createPin(scene){
    
}
function createMass(scene,sphere,ground){
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.4, restitution: 0.1 }, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);    
    var spheremass = sphere.physicsImpostor;
    var groundmass = ground.physicsImpostor;  
    return [spheremass,groundmass];
}

function createMass2(scene,lane){
    lane.physicsImpostor = new BABYLON.PhysicsImpostor(lane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);    
    var lanemass=lane.physicsImpostor;
    return lanemass;
}