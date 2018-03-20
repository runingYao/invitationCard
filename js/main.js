var app = {engine: new Engine(), elements: [], texturePath: "img/bg.jpg", tilesNum: 6};
app.initPages = function (textures) {

/*    var materials = [];

    for (var i = 0; i < 6; i++) {

        materials.push(new THREE.MeshBasicMaterial({
            map: textures[i]
        }));

    }
    var skyBox = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshFaceMaterial(materials));
    skyBox.applyMatrix(new THREE.Matrix4().makeScale(1, 1, -1));
    this.engine.scene.add(skyBox);*/


    var geometry = new THREE.SphereGeometry(500, 120, 40);
    geometry.scale(-1, 1, 1);

    var material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(app.texturePath)
    });

    var mesh = new THREE.Mesh(geometry, material);

    this.engine.scene.add(mesh);

    this.elements[0] = $('<button type="button" name = "forward">跳到下一个位置</button>')[0];
    this.elements[0].position = new THREE.Vector3(0, 0.3, -0.49);
    this.elements[0].rotation = new THREE.Euler(0, 0, 0);
    this.elements[0].num = 1;

    this.elements[1] = $('<button type="button" name = "right">跳到下一个位置</button>')[0];
    this.elements[1].position = new THREE.Vector3(0.49, 0.3, 0);
    this.elements[1].rotation = new THREE.Euler(0, Math.PI / 180 * -90, 0);
    this.elements[1].num = 2;

    this.elements[2] = $('<button type="button" name = "back">跳到下一个位置</button>')[0];
    this.elements[2].position = new THREE.Vector3(0, 0.3, 0.49);
    this.elements[2].rotation = new THREE.Euler(0, Math.PI, 0);
    this.elements[2].num = 3;

    this.elements[3] = $('<button type="button" name = "left">跳到下一个位置</button>')[0];
    this.elements[3].position = new THREE.Vector3(-0.49, 0.3, 0);
    this.elements[3].rotation = new THREE.Euler(0, Math.PI / 180 * 90, 0);
    this.elements[3].num = 4;


    for (var i = 0; i < this.elements.length; i++) {
        var ele = this.elements[i];
        this.engine.makeCSS3DSprite(ele);
        ele.addEventListener("mousedown", onClickEvent);
        ele.nextPoint = this.elements[(i + 1) % this.elements.length].position;
    }

    function onClickEvent(e) {


/*        var position = app.engine.camera.getWorldDirection();
        new TWEEN.Tween(position).to(e.target.nextPoint, 1000).easing(TWEEN.Easing.Circular.Out).onUpdate(function (a) {
            var target =  new THREE.Vector3();//app.engine.controls.target;
            var vec = new THREE.Vector3().subVectors(target, position).normalize();
            var pos = vec.multiplyScalar(app.engine.camera.position.distanceTo(target)).add(target);
            app.engine.camera.position.copy(pos);
            app.engine.camera.lookAt(target);
        }).onComplete(function () {
        }).start();*/
    }
}

app.loader = function () {
    this.engine.init();
    var textures = [];

    for (var i = 0; i < this.tilesNum; i++) {

        textures[i] = new THREE.Texture();

    }

    var imageObj = new Image();

    imageObj.onload = function () {
        app.initPages(textures);

        //var canvas, context;
        //var tileWidth = imageObj.height;
        //
        //for (var i = 0; i < textures.length; i++) {
        //
        //    canvas = document.createElement('canvas');
        //    context = canvas.getContext('2d');
        //    canvas.height = tileWidth;
        //    canvas.width = tileWidth;
        //    context.drawImage(imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
        //    textures[i].image = canvas
        //    textures[i].needsUpdate = true;
        //
        //}


    };

    imageObj.src = app.texturePath;
}


$(function() {
    app.loader();
});


/*function loadImage(uri,callback){
    if(typeof callback!='function'){
        callback=function(uri){
            console.log(uri);
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onprogress = function(evt){
        console.log(evt.loaded / evt.total * 100 + "%");
    }
    xhr.onload = function() {
        callback(window.URL.createObjectURL(xhr.response));
    }
    xhr.open('GET', uri, true);
    xhr.send();
}

//使用方法
var imgUrl='img/sun_temple_stripe.jpg';
loadImage(imgUrl,function(URI){
    //Do some thing while image is load
});*/



