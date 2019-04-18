<!DOCTYPE html>
<html>
	<head>
		<title>AbleAlley</title>
		<meta charset="UTF-8">
		<style>
			body { margin: 0; }
			canvas { width: 100%; height: 100% }
		</style>
        <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js"></script>
		    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/100/three.min.js"></script>
        <script src="https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js"></script>

        <script src="/socket.io/socket.io.js"></script>
        <script src="../public/game/assets/scripts/physi.js"></script>
        <script src="../public/game/assets/scripts/ammo.js"></script>
        <script src="../public/game/assets/scripts/physijs_worker.js"></script>
        <script src="../public/game/assets/scripts/ThreeCSG.js"></script>
        <script src="../public/game/assets/scripts/layout.js"></script>
        <script src="../public/game/assets/scripts/pins.js"></script>
        <script src="../public/game/assets/scripts/DDSLoader.js"></script>
        <script src="../public/game/assets/scripts/MTLLoader.js"></script>
        <script src="../public/game/assets/scripts/OBJLoader.js"></script>
        <script src="../public/game/assets/dependencies/OrbitControls.js"></script>
		    <script src="../public/game/assets/scripts/index.js"></script>

        <div hidden>
          <video autoplay muted="muted" loop id = "video" width="320" height="240" controls>
            <source src="../public/game/textures/space.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
	</head>
	<body>

	</body>
</html>