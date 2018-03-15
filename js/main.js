var elements = [];
var engine = new Engine();
engine.init();
initCSS3DUI();
//var tween = new TWEEN.Tween(engine.camera.rotation);

function initCSS3DUI() {
	engine.scene.add(makeSkyBox());
	elements[0] = $('<button type="button" name = "forward">跳到下一个位置</button>')[0];
	elements[0].position = new THREE.Vector3(0, 0.3, -0.49);
	elements[0].rotation = new THREE.Euler(0,0,0);
	
	elements[1] = $('<button type="button" name = "right">跳到下一个位置</button>')[0];
	elements[1].position = new THREE.Vector3(0.49, 0.3, 0);
	elements[1].rotation = new THREE.Euler(0,Math.PI/180*-90,0);


	elements[2] = $('<button type="button" name = "back">跳到下一个位置</button>')[0];
	elements[2].position = new THREE.Vector3(0, 0.3, 0.49);
	elements[2].rotation = new THREE.Euler(0,Math.PI,0);

	elements[3] = $('<button type="button" name = "left">跳到下一个位置</button>')[0];
	elements[3].position = new THREE.Vector3(-0.49, 0.3, 0);
	elements[3].rotation = new THREE.Euler(0,Math.PI/180*90,0);


	for(var i = 0; i < elements.length; i++) {
		var ele = elements[i];
		engine.makeCSS3DSprite(ele);
		ele.addEventListener("click", onClickEvent);
		ele.nextPoint = elements[(i + 1) % elements.length].position;
	}

}

function onClickEvent(e) {
	var position = engine.camera.getWorldDirection();

	new TWEEN.Tween(position).to(e.target.nextPoint, 1000).easing(TWEEN.Easing.Circular.Out).onUpdate(function(a) {
		var target = engine.controls.target;
		var vec = new THREE.Vector3().subVectors( target, position ).normalize();
		var pos = vec.multiplyScalar( engine.camera.position.distanceTo( target ) ).add( target );
		engine.camera.position.copy( pos );
		engine.camera.lookAt( engine.controls.target );
	}).onComplete(function(){
		//engine.controls.update();
	}).start();
}

function makeSkyBox() {
	var textures = getTexturesFromAtlasFile("img/sun_temple_stripe.jpg", 6);
	var materials = [];

	for(var i = 0; i < 6; i++) {

		materials.push(new THREE.MeshBasicMaterial({
			map: textures[i]
		}));

	}
	var skyBox = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshFaceMaterial(materials));
	skyBox.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
	return skyBox;
}

function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {

	var textures = [];

	for(var i = 0; i < tilesNum; i++) {

		textures[i] = new THREE.Texture();

	}

	var imageObj = new Image();

	imageObj.onload = function() {

		var canvas, context;
		var tileWidth = imageObj.height;

		for(var i = 0; i < textures.length; i++) {

			canvas = document.createElement('canvas');
			context = canvas.getContext('2d');
			canvas.height = tileWidth;
			canvas.width = tileWidth;
			context.drawImage(imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
			textures[i].image = canvas
			textures[i].needsUpdate = true;

		}

	};

	imageObj.src = atlasImgUrl;

	return textures;
}