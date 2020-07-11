const laneheight = 0.2;
const lanewidth = 1;
const lanelength = 9;

const pinHeight = 0.48;
const pinDiameter = 0.15;
const distanceBetweenRows = 0.3;
const distanceBetweenPins = 0.1;
const pinYPosition = pinHeight / 2 + laneheight;

function init() {
    if (BABYLON.Engine.isSupported()) {
        const canvas = document.getElementById("renderCanvas");
        const engine = initEngine(canvas);
        const scene = createScene(engine);
        const camera = createUniversalCamera(scene);
        camera.attachControl(canvas, true);
        scene.activeCamera = camera;
        const followCam = createFollowCam(scene);
        const light = createLight(scene);
        const ground = createGround(scene);
        const sky = createSky(scene);
        const lane = createLane(scene);
        const gutter1 = createGutter(scene);
        const gutter2 = createGutter(scene);
        gutter2.position.x = -(0.35 + lanewidth / 2);
        const pin = createPins(scene);
        const ball = createBall(scene);
        generateActionManager(canvas, scene, followCam);
    }
}

function showLoadingScreen(canvas, engine) {
    let defaultLoadingScreen = new BABYLON.DefaultLoadingScreen(canvas, "Please Wait", "black");
    engine.loadingScreen = defaultLoadingScreen;
    engine.displayLoadingUI();
};

let hideLoadingScreen = function (engine) {
    engine.hideLoadingUI();
};

function initEngine(canvas) {
    delete engine;
    engine = new BABYLON.Engine(canvas, true, {
        deterministicLockstep: true,
        lockstepMaxSteps: 4
    });
    showLoadingScreen(canvas, engine);
    window.addEventListener("resize", function () {
        engine.resize();
    });
    return engine;
}

function createScene(engine) {
    const scene = new BABYLON.Scene(engine);
    engine.runRenderLoop(function () {
        scene.render();
        scene.afterRender = function () {
            hideLoadingScreen(engine);
        }
    });
    let physEngine = new BABYLON.CannonJSPlugin(false);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), physEngine);
    physEngine.setTimeStep(1 / 60);
    scene.collisionsEnabled = true;
    //scene.debugLayer.show();
    return scene;
}

function createUniversalCamera(scene) {
    const camera = new BABYLON.UniversalCamera("cam", new BABYLON.Vector3(0, 1.5, -8), scene);
    camera.speed = 0.8;
    camera.inertia = 0.4;
    camera.checkCollisions = true;
    return camera;
}

function createFollowCam(scene, canvas) {
    const followCam = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 3, -5), scene);
    followCam.radius = 1;
    followCam.cameraAcceleration = 0;
    return followCam
}

function createGround(scene) {
    const ground = BABYLON.Mesh.CreateGround("ground", 12, 12, 1, scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseTexture = new BABYLON.Texture("texture/grass2.jpg", scene);
    ground.material = groundMat;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 100,
        restitution: 0
    }, scene);
    ground.receiveShadows = true;
    ground.checkCollisions = true;
    return ground;
}

function createLight(scene) {
    const light = new BABYLON.DirectionalLight("directlight1", new BABYLON.Vector3(0, -1, 0), scene);
    light.intensity = 1.4;
    const secondLight = new BABYLON.DirectionalLight("directlight2", new BABYLON.Vector3(-0.5, -0.5, 0.5), scene);
    secondLight.intensity = 0.9;
    const thirdLight = new BABYLON.DirectionalLight("directlight3", new BABYLON.Vector3(0.5, 0.5, 0.5), scene);
    thirdLight.intensity = 0.5;
    return light;
}

function createBall(scene) {
    const ball = new BABYLON.Mesh.CreateSphere("ball", 12, 0.22, scene);
    const ballMat = new BABYLON.StandardMaterial("ballMat", scene);
    ballMat.diffuseTexture = new BABYLON.Texture("texture/bowling.jpg", scene);
    ball.material = ballMat;
    ball.position.y = 0.31;
    ball.position.z = -lanelength / 2 + 0.5;
    ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass: 10,
        friction: 15,
        restitution: 0
    }, scene);
    ball.checkCollisions = true;
    return ball;
}

function createLane(scene) {
    const lane = new BABYLON.Mesh.CreateBox("lane", 1, scene, false);
    const laneMat = new BABYLON.StandardMaterial("ballMat", scene);
    laneMat.diffuseTexture = new BABYLON.Texture("texture/wood.jpg", scene);
    lane.material = laneMat;
    lane.scaling = new BABYLON.Vector3(lanewidth, laneheight, lanelength);
    lane.position.y = laneheight / 2;
    lane.physicsImpostor = new BABYLON.PhysicsImpostor(lane, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 0.5,
        restitution: 0
    }, scene);
    lane.checkCollisions = true;
    lane.receiveShadows = true;
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
    gutter.scaling = new BABYLON.Vector3(0.2, laneheight * 4, lanelength);
    const gutterMat = new BABYLON.StandardMaterial("gutterMat", scene);
    const cloudTexture = new BABYLON.CloudProceduralTexture("cloudTexture", 128, scene);
    cloudTexture.uScale = 10;
    gutterMat.diffuseTexture = cloudTexture;
    gutter.material = gutterMat;
    gutter.position.x = 0.35 + lanewidth / 2;
    gutter.position.y = 4 * laneheight / 2;
    gutter.physicsImpostor = new BABYLON.PhysicsImpostor(gutter, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 1,
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
        pins[i] = new BABYLON.Mesh.CreateCylinder("pin" + (i + 1), pinHeight, pinDiameter / 2, pinDiameter, 16, scene);
        pins[i].position.y = pinYPosition;
        pins[i].material = pinMat;
        pins[i].physicsImpostor = new BABYLON.PhysicsImpostor(pins[i], BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 0.5,
            friction: 0.5,
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

function createForceIndicator(scene) {
    const powerMat = new BABYLON.StandardMaterial("powerMat", scene);
    powerMat.diffuseTexture = new BABYLON.Texture("texture/grass2.jpg", scene);
    let power = new BABYLON.Mesh.CreateBox("power", 1, scene, false);
    power.scaling = new BABYLON.Vector3(0.06, 0.03, 0.02);
    power.position.x = -2;
    power.position.z = -lanelength / 2 + 0.6;
    power.material = powerMat;

    const backpowerMat = new BABYLON.StandardMaterial("backpowerMat", scene);
    backpowerMat.diffuseTexture = new BABYLON.Texture("texture/power-texture.jpg", scene);
    let backPlaneBox = new BABYLON.Mesh.CreateBox("backPlaneBox", 1, scene, false);
    backPlaneBox.scaling = new BABYLON.Vector3(0.1, 2.01, 0.01);
    backPlaneBox.material = backpowerMat;
    backPlaneBox.position.y = 1.255;
    backPlaneBox.position.x = -2;
    backPlaneBox.position.z = -3.867;
    return power;
}

function createAngleIndicator(scene) {
    const powerMat = new BABYLON.StandardMaterial("powerMat", scene);
    powerMat.diffuseTexture = new BABYLON.Texture("texture/power-texture.jpg", scene);

    let angleIndicator = new BABYLON.Mesh.CreateSphere("angleIndicator", 12, 0.1, scene);
    angleIndicator.position.x = 2.5;
    angleIndicator.position.y = 0.025;
    angleIndicator.position.z = -3.867;
    angleIndicator.material = powerMat;

    const discMat = new BABYLON.StandardMaterial("discMat", scene);
    discMat.diffuseTexture = new BABYLON.Texture("texture/angle-texture.png", scene);
    var disc = BABYLON.MeshBuilder.CreateDisc("disc", { radius: 0.7, arc: 0.5, tessellation: 100, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    disc.position.x = 1.6;
    disc.position.y = 1.2;
    disc.position.z = -3.5;
    disc.material = discMat;
    return angleIndicator;
}

function generateActionManager(canvas, scene, followCam) {
    scene.actionManager = new BABYLON.ActionManager(scene);
    const ball = scene.getMeshByName("ball");
    const pin1 = scene.getMeshByName("pin1");
    let power = createForceIndicator(scene);
    let angleIndicator = createAngleIndicator(scene);
    let w_roll = 0;
    let w_force = 0;
    let w_angle = 0;
    let stopRolling = false;
    let stopModifyingAngle = false;
    let stopModifyingForce = false;
    let gameOver = false;
    let alreadyShot = false;
    let shootAngle;
    let force;

    scene.registerAfterRender(function () {
        if (!stopRolling) {
            ball.position.x = lanewidth / 2.5 * Math.cos(w_roll);
            ball.rotate(BABYLON.Axis.Z, lanewidth / 20 * Math.sin(w_roll), BABYLON.Space.WORLD);
            w_roll += 5 * Math.PI / 1000;
        }

        if (!stopModifyingForce) {
            force = 40 * Math.abs(Math.cos(w_force));
            power.position.y = force / 20 + 0.25;
            w_force += 5 * Math.PI / 1000;
        }

        if (!stopModifyingAngle) {
            shootAngle = (Math.PI / 4) * Math.cos(w_angle) + Math.PI / 2;
            angleIndicator.position.x = 1.46 + 0.5 * Math.cos(shootAngle);
            angleIndicator.position.y = 0.5 * Math.sin(shootAngle) + 1.3;
            angleIndicator.rotate(BABYLON.Axis.Z, Math.sin(w_angle) / 10, BABYLON.Space.WORLD);
            w_angle += 6 * Math.PI / 1000;
        }

        // Check game over
        let ballVelocity = ball.physicsImpostor.getLinearVelocity();
        gameOver =
            alreadyShot &&
            ((Math.abs(ball.position.x) >= 0.61 && ball.position.z < pin1.position.z)
                || (ball.position.y < 0)
                || (ballVelocity.lengthSquared() < 0.01)
            );
        if (gameOver) {
            window.alert("Game over!");
        }
    });

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        { trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: "c" },
        function () {
            if (!alreadyShot) { stopRolling = !stopRolling; }
        }))

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        { trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: "x" },
        function () {
            if (!alreadyShot) { stopModifyingForce = !stopModifyingForce; }
        }))

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        { trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: "z" },
        function () {
            if (!alreadyShot) { stopModifyingAngle = !stopModifyingAngle; }
        }))

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        { trigger: BABYLON.ActionManager.OnKeyUpTrigger, parameter: "v" },
        function () {
            if (!alreadyShot) {
                stopRolling = true;
                stopModifyingAngle = true;
                stopModifyingForce = true;
                alreadyShot = true;
                const forceDirection = new BABYLON.Vector3(100 * Math.cos(shootAngle), 5, 100 * Math.sin(shootAngle));
                const forceMagnitude = force * 1.3;
                const contactLocalRefPoint = BABYLON.Vector3.Zero();
                ball.physicsImpostor.applyForce(forceDirection.scale(forceMagnitude), ball.getAbsolutePosition().add(contactLocalRefPoint));
                followCam.lockedTarget = ball;
                followCam.attachControl(canvas, true);
                scene.activeCamera = followCam;
                scene.registerAfterRender(function () {
                    if (ball.position.y < 0) {
                        followCam.lockedTarget = null;
                    }
                });
            }
        }))
};