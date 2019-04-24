var socket = io();
var scene;
var ball;
var font;
var laneText;
var clock = new THREE.Clock();
var speed = 40;
var angle = 0;
const ANGLEFACTOR = 1.5;
const SPEEDFACTOR = 10;

//game state
var rolling = false;
var waitingToScore = false;
var reset = false;
var resetUIFisnih = true;
var readyToRoll = true;
var showTotalScore = false;

var rollTime = 0;
var scoreTime = 0;
var totalScore = -1;
var totalScoreTime = 0;
var delta = 1;

$('document').ready(function () {
        var camera, renderer, controls, loader;
        var WIDTH  = window.innerWidth;
        var HEIGHT = window.innerHeight;

        function init() {
            loadFont();
            Physijs.scripts.worker = '../public/game/assets/scripts/physijs_worker.js';
            Physijs.scripts.ammo = 'ammo.js';
            scene = new Physijs.Scene;
            scene.setGravity(new THREE.Vector3(0, -50, 0));
            scene.fog = new THREE.Fog(0x808080, 2000, 4000);
            initBackground();
            initMesh();
            initCamera();
            initLights();
            initRenderer();
            controls = new THREE.OrbitControls( camera, renderer.domElement );
            document.body.appendChild(renderer.domElement);

            socket.on('getMovement', function(data) {
                console.log("Receive speed and angle...");
                speed = data.xspeed;
                angle = data.yacc;
                console.log("xspeed: " + data.xspeed);
                console.log("yacc: " + data.yacc);
                triggerBallMovement();
            });

            socket.on('totalScore', function(score) {
                console.log("Receive total score...");
                totalScore = score;
                //showTotalScore = true;
                //readyToRoll = false;
            });

            socket.on('gameOver', function(name) {
                console.log("Receive game end message with player name...");
                createScore("Congradulations, " + name + " won!\nRefresh to start new game", 10);
                readyToRoll = false;
            });
        }

        function initBackground() {


          var bowlingAlly = createBowlingAlly(1000, 1000, 300);
          //bowlingAlly.position.set(-475, -10, 0);
          scene.add(bowlingAlly);
          loadPinsModel();

        }

        function initCamera() {
          camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 4000);
          camera.position.set(-320, 100, 0);
          camera.lookAt(0, 0, 0);
        }


        function initRenderer() {
            renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
            renderer.setSize(WIDTH, HEIGHT);
            renderer.setClearColor( 0x000000, 0 );
        }

        function initLights() {
            //TODO light looks weird
            var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
            keyLight.position.set(-5, 0, 5);

            var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
            fillLight.position.set(5, 0, 5);

            var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
            backLight.position.set(5, 0, -5).normalize();

            scene.add(keyLight);
            scene.add(fillLight);
            scene.add(backLight);
        }

        function initMesh() {

            // ball
            ball = createBowlingBall();
            ball.position.set(-100, 20, 0);
            scene.add( ball );

        }

        function render() {
            delta = clock.getDelta();
            scene.simulate();
            requestAnimationFrame(render);
            controls.update();
            updateGameState();
            renderer.render(scene, camera);
        }

        function updateGameState() {
            if (rolling) {
                rollTime += delta;
                if (rollTime > 12) {
                    rollTime = 0;
                    rolling = false;
                    waitingToScore = true;
                    resetUIFisnih = false;
                    scoreTime = 0;
                }
            } else if (waitingToScore) {
                points = 0;

                for (var i in scene._objects) {
                    if (scene._objects[i].name === "pin") {
                        if (scene._objects[i].position.y < 30 || scene._objects[i].rotation.x > 0.1 || scene._objects[i].rotation.z > 0.1) {
                            points++;
                        }
                    }
                }
                var message = "Score: ";
                if (points == 10) { 
                    points += 2;
                    message = message + points + " !!!";
                } else {
                    message = message + points;
                }
                console.log("Points: " + points);
                
                
                createScore(message, 30);
                console.log("Sending score to server...");
                socket.emit('sendScore', points);

                waitingToScore = false;
                reset = true;
            } else if (reset) {
                if (!resetUIFisnih) {
                    resetAll();
                    resetUIFisnih = true;
                }

                scoreTime += delta;
                if (scoreTime > 5) {
                    if (laneText != null) {
                        scene.remove(laneText);
                        if (totalScore > -1){
                            showTotalScore = true;
                        }
                    }
                    scoreTime = 0;
                    reset = false;
                    readyToRoll = !showTotalScore;
                }
            } else if (showTotalScore) {
                createScore("Total score: " + score, 30);
                totalScoreTime += delta;
                if (totalScoreTime > 5) {
                    if (laneText != null) {
                        scene.remove(laneText);
                        
                    }
                    totalScore = -1;
                    totalScoreTime = 0;
                    showTotalScore = false;
                    readyToRoll = true;
                }
            }
        }

        function resetAll() {
            for (var i in scene._objects) {
                if (scene._objects[i].name === "ball") {
                    scene.remove(scene._objects[i]);
                }
            }
            initMesh();
            resetPins();
        }

        function loadFont() {
            var loader = new THREE.FontLoader();
            loader.load('../public/game/assets/scripts/helvetiker_bold.typeface.json', function (fontN) {
                font = fontN;
            });
        }

    /***
     * For debug use only
     * @param event
     */
    function onDocumentMouseDown(event) {
            switch ( event.button ) {
                case 0: // left click to trigger movement
                    triggerBallMovement();
                    break;
                case 2: // right click to reset ball position
                    resetAll();
                    readyToRoll = true;
                    rolling = false;
                    waitingToScore = false;
                    resetUIFisnih = true;
                    reset = false;
                    break;
            }

        }

        function moveWithRotate() {
            //TODO 
            ball.setLinearVelocity(new THREE.Vector3(speed * SPEEDFACTOR, 0, angle * ANGLEFACTOR ));
        }

    function createBowlingBall() {
        var ballMaterial = new THREE.MeshPhongMaterial({color: 0xff3333});
        var ballGeometry = new THREE.SphereGeometry(5, 32, 32);

        var subMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
        var cylinderSubtract = new THREE.CylinderGeometry(1, 1, 10, 32);
        var hole1 = new THREE.Mesh(cylinderSubtract, subMaterial);
        hole1.position.set(2, 6, 2);
        var hole2 = new THREE.Mesh(cylinderSubtract, subMaterial);
        hole2.position.set(2, 6, -2);
        var hole3 = new THREE.Mesh(cylinderSubtract, subMaterial);
        hole3.position.set(-2, 6, 0);

        var result = new ThreeBSP(new THREE.Mesh(ballGeometry, subMaterial));
        result = result.subtract(new ThreeBSP(hole1));
        result = result.subtract(new ThreeBSP(hole2));
        result = result.subtract(new ThreeBSP(hole3)).toMesh();

        var ball = new Physijs.ConvexMesh(result.geometry, ballMaterial, 15);
        ball.rotation.z = Math.PI / 24;
        ball.name = "ball";
        ball.castShadow = true;

        return ball;
    }

    function createScore(message, zoom) {
        var xMid;
        var textShape = new THREE.BufferGeometry();
        var color = 0xFFFFFF;
        var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });
        
        var shapes = font.generateShapes(message, zoom);
        var geometry = new THREE.ShapeGeometry(shapes);
        geometry.computeBoundingBox();
    
        xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    
        textShape.fromGeometry(geometry);
        laneText = new THREE.Mesh(textShape, matLite);
        laneText.rotation.y = (-Math.PI / 2);

        laneText.position.set(-30, 30, -120);
        
    
        scene.add(laneText);
    }

        function triggerBallMovement() {
            if (readyToRoll) {
                rolling = true;
                readyToRoll = false;
                moveWithRotate();
            }
        }


        init();
        render();
        
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );

});


