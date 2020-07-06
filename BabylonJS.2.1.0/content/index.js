
var laneheight=0.2;
var lanewidth=1;
var lanelength=9;
//bowl constant
var bowlHeight=0.48;
var bowldiameter=0.15;
var distanceBetweenRows = 0.3;
var distanceBetweenBowl = 0.1;
var bowlYPosition=bowlHeight/2+laneheight;
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
    //create sky
    var sky=createSky(scene);  
    //create sphere
    var sphere=createBall(scene);
    //create lane
    var lane=createLane(scene);
    //create pin 1 2
    var pin=createPin(scene);
    var pin2=createPin2(scene);
    //create bowling
    var bowl=createBowl(scene);
    //create gravity
    var grav=createGravity(scene);   
    //create mass
    createMass(scene,sphere,ground);
    createMass2(scene,lane,pin,pin2);
    createBowlMass(scene,bowl);
    
    generateActionManager(scene);

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
    scene.collisionsEnabled = true;
    //scene.debugLayer.show();
    return scene;
}
function createFreeCamera(scene) {
    var camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(2, 1, -8), scene);
2
    camera.speed = 0.8;
    camera.inertia = 0.4;

    return camera;
}
function createGround(scene){
    var ground=BABYLON.Mesh.CreateGround("ground",12,12,1,scene);
    //create Material
    var groundMat=new BABYLON.StandardMaterial("groundMat",scene);
    groundMat.diffuseTexture=new BABYLON.Texture("texture/grass2.jpg",scene);
    ground.material=groundMat;
    return ground;
}
function createLight(scene){
    var light=new BABYLON.DirectionalLight("directlight",new BABYLON.Vector3(0,-1,0),scene);
    light.intensity=0.9;

    //create a second one to simulate light on dark sides
    var secondLight = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(-0.5, -0.5, 0.5), scene);
    secondLight.intensity = 0.6;

    return light;
}
function createBall(scene){
    var sphere=new BABYLON.Mesh.CreateSphere("ball",12,0.22,scene);
    //material
    var sphereMat=new BABYLON.StandardMaterial("ballMat",scene);
    sphereMat.diffuseTexture=new BABYLON.Texture("texture/bowling.jpg",scene);
    sphere.material=sphereMat;
    //sphere location
    sphere.position.y=1.5;  
    sphere.position.z=-lanelength/2+0.1; 

    return sphere;
}
function createLane(scene){
    var lane=new BABYLON.Mesh.CreateBox("lane",1,scene,false);
    //create material
    var laneMat=new BABYLON.StandardMaterial("ballMat",scene);
    laneMat.diffuseTexture=new BABYLON.Texture("texture/wood.jpg",scene);
    lane.material=laneMat;
    //lane scaling
    lane.scaling=new BABYLON.Vector3(lanewidth,laneheight,lanelength);
    lane.position.y=laneheight/2;
    return lane;
}
function createSky(scene){
    var sky= new BABYLON.Mesh.CreateBox("sky",50,scene);
    var skyMat=new BABYLON.StandardMaterial("skybox",scene);
    skyMat.backFaceCulling=false;
    skyMat.reflectionTexture=new BABYLON.CubeTexture("texture/TropicalSunnyDay",scene);
    skyMat.reflectionTexture.coordinatesMode=BABYLON.Texture.SKYBOX_MODE;
    skyMat.diffuseColor=new BABYLON.Color3(0,0,0);
    skyMat.specularColor=new BABYLON.Color3(0,0,0);
    sky.material=skyMat;
    
    return sky;
}
function createGravity(scene){
    var gravity=scene.enablePhysics();
    return gravity;
}
function createPin(scene){
    var pin=new BABYLON.Mesh.CreateBox("pin",1,scene,false);
    pin.scaling=new BABYLON.Vector3(0.2,laneheight,lanelength);
    //create material
    var pinMat=new BABYLON.StandardMaterial("ballMat",scene);
    var brickTexture = new BABYLON.BrickProceduralTexture("brickTexture", 128, scene);
    brickTexture.numberOfBricksWidth = 10;
    brickTexture.numberOfBric0ksHeight = 2;
    brickTexture.uScale = 10;
    pinMat.diffuseTexture=brickTexture;
    pin.material=pinMat;
    //pin position
    pin.position.x=0.3+lanewidth/2;
    pin.position.y=laneheight/2;
    return pin;
}
function createPin2(scene){
    var pin=new BABYLON.Mesh.CreateBox("pin",1,scene,false);
    pin.scaling=new BABYLON.Vector3(0.2,laneheight,lanelength);
    //create material
    //create material
    var pinMat=new BABYLON.StandardMaterial("ballMat",scene);
    var brickTexture = new BABYLON.BrickProceduralTexture("brickTexture", 128, scene);
    brickTexture.numberOfBricksWidth = 10;
    brickTexture.numberOfBric0ksHeight = 2;
    brickTexture.uScale = 10;
    pinMat.diffuseTexture=brickTexture;
    pin.material=pinMat;
    //pin location
    pin.position.x=-(0.3+lanewidth/2);
    pin.position.y=laneheight/2;
    return pin;
}
function createBowl(scene){
    var length=10;
    var bowl=[length];  
    var i;
    var pinMat=new BABYLON.StandardMaterial("pinMat",scene);
    pinMat.diffuseTexture=new BABYLON.Texture("texture/pin-texture.png",scene);
    for(i=0;i<length;i++){
        bowl[i]=new BABYLON.Mesh.CreateCylinder("bowl",bowlHeight,bowldiameter/2,bowldiameter,16, scene);
        bowl[i].position.y=bowlYPosition;     
        bowl[i].material=pinMat;
    }
    //row 1   
    bowl[0].position.z=lanelength/2-distanceBetweenRows*3-0.01-bowldiameter*3;
    //row 2
    bowl[1].position.x=-distanceBetweenBowl/2-bowldiameter/2;
    bowl[1].position.z=bowl[0].position.z+distanceBetweenRows;
    bowl[2].position.x=distanceBetweenBowl/2+bowldiameter/2;
    bowl[2].position.z=bowl[0].position.z+distanceBetweenRows;
    //row 3
    bowl[3].position.z=bowl[2].position.z+distanceBetweenRows;
    bowl[4].position.x=-bowldiameter-distanceBetweenBowl;
    bowl[4].position.z=bowl[2].position.z+distanceBetweenRows;
    bowl[5].position.x=bowldiameter+distanceBetweenBowl;
    bowl[5].position.z=bowl[2].position.z+distanceBetweenRows;
    //row 4
    bowl[6].position.x=-distanceBetweenBowl/2-bowldiameter/2;
    bowl[6].position.z=bowl[5].position.z+distanceBetweenRows;
    bowl[7].position.x=distanceBetweenBowl/2+bowldiameter/2;
    bowl[7].position.z=bowl[5].position.z+distanceBetweenRows;
    bowl[8].position.x=3*(-distanceBetweenBowl-bowldiameter)/2;
    bowl[8].position.z=bowl[5].position.z+distanceBetweenRows;
    bowl[9].position.x=3*(distanceBetweenBowl+bowldiameter)/2;
    bowl[9].position.z=bowl[5].position.z+distanceBetweenRows;

    return bowl;
}
function createMass(scene,sphere,ground){
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10,friction:0.4, restitution: 0.1 }, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);  
    sphere.checkCollisions = true;  
    var spheremass = sphere.physicsImpostor;
    var groundmass = ground.physicsImpostor;  
    return [spheremass,groundmass];
}
function createMass2(scene,lane,pin,pin2){
    lane.physicsImpostor = new BABYLON.PhysicsImpostor(lane, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0,fricion:0.4, restitution: 0.5 }, scene);    
    pin.physicsImpostor = new BABYLON.PhysicsImpostor(pin, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);    
    pin2.physicsImpostor = new BABYLON.PhysicsImpostor(pin2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);   
    lane.checkCollisions = true;  
    pin.checkCollisions = true;
    pin2.checkCollisions = true;
    var lanemass=lane.physicsImpostor;
    var pinmass=pin.physicsImpostor;
    var pin2mass=pin2.physicsImpostor;
    return [lanemass,pinmass,pin2mass];
}
function createBowlMass(scene,bowl){
    var i;
    var bowlmass=[10];
    for(i=0;i<10;i++){
        bowl[i].physicsImpostor = new BABYLON.PhysicsImpostor(bowl[i], BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 1,fricion:0.1, restitution: 0.1 }, scene);
        bowl[i].checkCollisions=true;
        bowlmass[i]=bowl[i].physicsImpostor;      
    }
    
    return bowlmass;
}

function generateActionManager(scene) {
    scene.actionManager = new BABYLON.ActionManager(scene);

    //generate a new color each time I press "c"
    var ball = scene.getMeshByName("ball");
    //scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: "c" },
        //the function that will be executed
        scene.registerBeforeRender(function () {
            //ball.rotate(BABYLON.Axis.Z, 0.1);
            //ball.position.z += 0.01;
            var forceDirection = new BABYLON.Vector3(0, 0, 0.3);
            var forceMagnitude = 50;
            var contactLocalRefPoint = BABYLON.Vector3.Zero();
    
                ball.physicsImpostor.applyForce(forceDirection.scale(forceMagnitude), ball.getAbsolutePosition().add(contactLocalRefPoint));

        })
    ;
}