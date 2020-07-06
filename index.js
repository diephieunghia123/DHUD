const laneheight = 0.2;
const lanewidth = 1;
const lanelength = 9;
//bowl constant
const pinHeight = 0.48;
const pinDiameter = 0.15;
const distanceBetweenRows = 0.3;
const distanceBetweenPins = 0.1;
const pinYPosition = pinHeight / 2 + laneheight;

function init() {
    //Init the engine
    const engine = initEngine();
    //Create a new scene
    const scene = createScene(engine);
    //Create the main player camera
    const camera = createFreeCamera(scene);
    //Attach the control from the canvas' user input
    camera.attachControl(engine.getRenderingCanvas());
    //set the camera to be the main active camera;
    scene.activeCamera = camera;
    //create light
    const light = createLight(scene);
    //create ground
    const ground = createGround(scene);
    //create sky
    const sky = createSky(scene);
    //create sphere
    const sphere = createBall(scene);
    //create lane
    const lane = createLane(scene);
    //create gutters
    const gutter1 = createGutter(scene);
    const gutter2 = createGutter(scene);
    gutter2.position.x = -(0.3 + lanewidth / 2);
    //create bowling
    const pin = createPins(scene);
    generateActionManager(scene);
}

function showLoadingScreen(canvas, engine) {
    let defaultLoadingScreen = new BABYLON.DefaultLoadingScreen(canvas, "Please Wait", "black");
    engine.loadingScreen = defaultLoadingScreen;
    engine.displayLoadingUI();
};

let hideLoadingScreen = function (engine) {
    engine.hideLoadingUI();
};

function initEngine() {
    // Get the canvas element from index.html
    const canvas = document.getElementById("renderCanvas");
    // Initialize the BABYLON 3D engine
    const engine = new BABYLON.Engine(canvas, true);
    showLoadingScreen(canvas, engine);
    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
    return engine;
}

function createScene(engine) {
    const scene = new BABYLON.Scene(engine);
    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
        scene.afterRender = function () {
            hideLoadingScreen(engine);
        }
    });
    scene.enablePhysics();
    scene.collisionsEnabled = true;
    scene.debugLayer.show();
    return scene;
}

function createFreeCamera(scene) {
    const camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(0, 1.5, -8), scene);
    camera.speed = 0.8;
    camera.inertia = 0.4;

    return camera;
}

function createGround(scene) {
    const ground = BABYLON.Mesh.CreateGround("ground", 12, 12, 1, scene);
    //create Material
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseTexture = new BABYLON.Texture("texture/grass2.jpg", scene);
    ground.material = groundMat;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0.9
    }, scene);

    return ground;
}

function createLight(scene) {
    const light = new BABYLON.DirectionalLight("directlight", new BABYLON.Vector3(0, -1, 0), scene);
    light.intensity = 0.9;

    //create a second one to simulate light on dark sides
    const secondLight = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(-0.5, -0.5, 0.5), scene);
    secondLight.intensity = 0.6;

    return light;
}

function createBall(scene) {
    const sphere = new BABYLON.Mesh.CreateSphere("ball", 12, 0.22, scene);
    //material
    const sphereMat = new BABYLON.StandardMaterial("ballMat", scene);
    sphereMat.diffuseTexture = new BABYLON.Texture("texture/bowling.jpg", scene);
    sphere.material = sphereMat;
    //sphere location
    sphere.position.y = 1.5;
    sphere.position.z = -lanelength / 2 + 0.1;
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass: 10,
        friction: 0.4,
        restitution: 0.1
    }, scene);
    return sphere;
}

function createLane(scene) {
    const lane = new BABYLON.Mesh.CreateBox("lane", 1, scene, false);
    //create material
    const laneMat = new BABYLON.StandardMaterial("ballMat", scene);
    laneMat.diffuseTexture = new BABYLON.Texture("texture/wood.jpg", scene);
    lane.material = laneMat;
    //lane scaling
    lane.scaling = new BABYLON.Vector3(lanewidth, laneheight, lanelength);
    lane.position.y = laneheight / 2;
    lane.physicsImpostor = new BABYLON.PhysicsImpostor(lane, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 0.4,
        restitution: 0
    }, scene);
    lane.checkCollisions = true;

    return lane;
}

function createSky(scene) {
    const sky = new BABYLON.Mesh.CreateBox("sky", 50, scene);
    const skyMat = new BABYLON.StandardMaterial("skybox", scene);
    skyMat.backFaceCulling = false;
    skyMat.reflectionTexture = new BABYLON.CubeTexture("texture/TropicalSunnyDay", scene);
    skyMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyMat.specularColor = new BABYLON.Color3(0, 0, 0);
    sky.material = skyMat;

    return sky;
}

function createGutter(scene) {
    const gutter = new BABYLON.Mesh.CreateBox("gutter", 1, scene, false);
    gutter.scaling = new BABYLON.Vector3(0.2, laneheight, lanelength);
    //create material
    const gutterMat = new BABYLON.StandardMaterial("gutterMat", scene);
    const brickTexture = new BABYLON.BrickProceduralTexture("brickTexture", 128, scene);
    brickTexture.numberOfBricksWidth = 10;
    brickTexture.numberOfBric0ksHeight = 2;
    brickTexture.uScale = 10;
    gutterMat.diffuseTexture = brickTexture;
    gutter.material = gutterMat;
    //pin position
    gutter.position.x = 0.3 + lanewidth / 2;
    gutter.position.y = laneheight / 2;
    gutter.physicsImpostor = new BABYLON.PhysicsImpostor(gutter, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0.9
    }, scene);
    gutter.checkCollisions = true;

    return gutter;
}

function createPins(scene) {
    const length = 10;
    const pins = [length];
    let i;
    const pinMat = new BABYLON.StandardMaterial("pinMat", scene);
    pinMat.diffuseTexture = new BABYLON.Texture("texture/pin-texture.png", scene);
    for (i = 0; i < length; i++) {
        pins[i] = new BABYLON.Mesh.CreateCylinder("pins", pinHeight, pinDiameter / 2, pinDiameter, 16, scene);
        pins[i].position.y = pinYPosition;
        pins[i].material = pinMat;
        pins[i].physicsImpostor = new BABYLON.PhysicsImpostor(pins[i], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 1,
            friction: 0.1,
            restitution: 0
        }, scene);
        pins[i].checkCollisions = true;
    }
    //row 1   
    pins[0].position.z = lanelength / 2 - distanceBetweenRows * 3 - 0.01 - pinDiameter * 3;
    //row 2
    pins[1].position.x = -distanceBetweenPins / 2 - pinDiameter / 2;
    pins[1].position.z = pins[0].position.z + distanceBetweenRows;
    pins[2].position.x = distanceBetweenPins / 2 + pinDiameter / 2;
    pins[2].position.z = pins[0].position.z + distanceBetweenRows;
    //row 3
    pins[3].position.z = pins[2].position.z + distanceBetweenRows;
    pins[4].position.x = -pinDiameter - distanceBetweenPins;
    pins[4].position.z = pins[2].position.z + distanceBetweenRows;
    pins[5].position.x = pinDiameter + distanceBetweenPins;
    pins[5].position.z = pins[2].position.z + distanceBetweenRows;
    //row 4
    pins[6].position.x = -distanceBetweenPins / 2 - pinDiameter / 2;
    pins[6].position.z = pins[5].position.z + distanceBetweenRows;
    pins[7].position.x = distanceBetweenPins / 2 + pinDiameter / 2;
    pins[7].position.z = pins[5].position.z + distanceBetweenRows;
    pins[8].position.x = 3 * (-distanceBetweenPins - pinDiameter) / 2;
    pins[8].position.z = pins[5].position.z + distanceBetweenRows;
    pins[9].position.x = 3 * (distanceBetweenPins + pinDiameter) / 2;
    pins[9].position.z = pins[5].position.z + distanceBetweenRows;

    return pins;
}


function generateActionManager(scene) {
    //scene.actionManager = new BABYLON.ActionManager(scene);
    const ball = scene.getMeshByName("ball");
    //the function that will be executed
    scene.registerAfterRender(function () {
        const forceDirection = new BABYLON.Vector3(0, 0, 0.3);
        const forceMagnitude = 30;
        const contactLocalRefPoint = BABYLON.Vector3.Zero();

        ball.physicsImpostor.applyForce(forceDirection.scale(forceMagnitude), ball.getAbsolutePosition().add(contactLocalRefPoint));
    });
}