var scene;
var mesh = null;
var camera, renderer, controls, loader;
var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

    function createBowlingBall() {
        //var ballMaterial = new THREE.MeshPhongMaterial({color: 0xff3333});
        var ballMaterial = new THREE.MeshBasicMaterial({color: 0xff3333});
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
        ball.rotation.z = Math.PI / 16;
        ball.name = "ball";
        ball.castShadow = true;

        return ball;
    }
        function initMesh() {

            // ball
            mesh = createBowlingBall();
            // loader = new THREE.GLTFLoader();
            // loader.load( 'assets/models/ball.gltf', function ( gltf ) {
            //   mesh = gltf.scene;
            //   mesh.traverse( function ( child ) {
            //     if ( child.isMesh ) {
            //       child.geometry.center();//in order to make rotation work
            //     }
            //   });
            //   mesh.scale.set(20,20,20);
            //   mesh.position.set(-100, 20, 0);
            //   scene.add( mesh );
            // });
              //mesh.scale.set(20,20,20);
            mesh.position.set(-100, 20, 0);
            scene.add( mesh );

        }
        function onDocumentMouseDown(event) {
            switch ( event.button ) {
                case 0: // left click to trigger movement
                    moveWithRotate();
                    break;
                case 1: // middle
                    break;
                case 2: // right click to reset ball position
                    for (var i in scene._objects) {
                        if (scene._objects[i].name === "ball") {
                            scene.remove(scene._objects[i]);
                        }
                    }
                    initMesh();
                    resetPins();
                    break;
            }

        }
        function moveWithRotate() {
            mesh.setLinearVelocity(new THREE.Vector3(200, 0, 0 ));
            // if (mesh.position.x < 700) {
            //     requestAnimationFrame(moveWithRotate);
            //     renderer.render(scene, camera);
            //
            //     var direction = new THREE.Vector3( 1, 0, 0 );
            //
            //     // scalar to simulate speed
            //     var speed = 5;
            //
            //     var vector = direction.multiplyScalar( speed, speed, speed );
            //     mesh.position.x += vector.x;
            //     mesh.position.y += vector.y;
            //     mesh.position.z += vector.z;
            //     rotateAboutPoint(mesh, new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z),new THREE.Vector3(0,0,1),-0.1, true);
            // }
        }

    function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
        pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

        if(pointIsWorld){
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }

        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset

        if(pointIsWorld){
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }

        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }
$('document').ready(function () {


        function init() {
            Physijs.scripts.worker = 'assets/scripts/physijs_worker.js';
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
        }

        function initBackground() {


          var bowlingAlly = createBowlingAlly(1000, 1000, 300);
          //bowlingAlly.position.set(-475, -10, 0);
          scene.add(bowlingAlly);
          loadPinsModel();

        }

        function initCamera() {
          camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 4000);
          camera.position.set(-250, 100, 0);
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

        


        function render() {
            scene.simulate();
            requestAnimationFrame(render);
            controls.update();
            renderer.render(scene, camera);
        }








        init();
        render();
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
});
