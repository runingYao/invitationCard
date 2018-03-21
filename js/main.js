var app = {engine: new Engine(), elements: [], texturePath: "img/bg.jpg", tilesNum: 6};
app.initPages = function (texture) {
    var choosenSure = Array(10).fill(0);
    var choosen = Array(10).fill(0);
    var INTERSECTED;
    var quesDeg =[[-265,-22],[-230,2.8],[-200,8.7],[-164,-4.3],[-127,-27.8],[-91,17.45],[-58,0.75],[-22,15],[14,-13.8],[49,-1.92]];
    var position = [[-1,-4,10],[-5.8,1,8.14],[-9.45,3,3.25],[-9.58,-1,-2.84],[-6.15,-4,-7.88],[-0.436,3,-9.99],[5.44,0,-8.38],[9.30,3,-3.66],[9.70,-3,2.41],[6.49,0,7.6]];


    var geometry = new THREE.SphereGeometry(500, 120, 40);
    geometry.scale(-1, 1, 1);

    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    var mesh = new THREE.Mesh(geometry, material);

    this.engine.scene.add(mesh);
    for(var j = 0; j < 10; j++){
        // var ele = $('<img src="img/question10.png" title="问题'+(j+1)+'">')[0];
        var ele =  $('<div> 问题' +(j+1)+
            '<br><input type="radio" name="colors" id="red">选项1<br>' +
            '<input type="radio" name="colors" id="red">选项2<br>' +
            '<input type="radio" name="colors" id="red">选项三<br></div>')[0];
        ele.num = j+1;
        ele.angle = 360 - j * 35.5;console.log(ele.angle);
        var y = Math.floor(Math.random()*(4-(-4)+1)+-4);
        //quesDeg.push([ele.angle,y*6]);

        // ele.position =  new THREE.Vector3(Math.sin(THREE.Math.degToRad(ele.angle)) * 10, y ,Math.cos(THREE.Math.degToRad(ele.angle)) * 10);
        ele.position =  new THREE.Vector3(position[j][0],position[j][1],position[j][2]);
        console.log(ele.position );
        this.elements.push(ele);
    }


    for (var i = 0; i < this.elements.length; i++) {
        var ele = this.elements[i];
        this.engine.makeCSS3DSprite(ele);
        ele.addEventListener("mousedown", onClickEvent);
        ele.nextPoint = this.elements[(i + 1) % this.elements.length].position;
    }

    function onClickEvent(e) {

        var num = e.target.num;
        choosen[num-1] = num;
        var correct = choosen[num - 1];
        choosenSure[num - 1] = choosen[num - 1];
        //  window._hmt && _hmt.push(['_trackEvent', '选定定第'+num+'道题', '选定�?'+choosen[num - 1]+'个�?�项']);
        var score = 0;
        for(var i = num - 1; i < 20; i++){
            if(choosenSure[i % 10] == 0){
                new TWEEN.Tween(app.engine.cameraSetting).to({
                    lon: quesDeg[i % 10][0],
                    lat: quesDeg[i % 10][1],
                }, 500)
                    .easing(TWEEN.Easing.Circular.Out).onComplete(function(){
                        console.log();
                    }).start();
                break;
            }
        }

        for(var i = 0;i < 10;i++){
            if(choosenSure[i] > 0){
                score += choosenSure[i];
                if(i == 9){
                    new TWEEN.Tween(app.engine.cameraSetting).to({
                        lon: 16000,
                    }, 8000)
                        .easing(TWEEN.Easing.Cubic.In).start();
                }
            }
            else{
                break;
            }
        }
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
    app.engine.cameraSetting.lon = quesDeg[0][0];
    app.engine.cameraSetting.lat = quesDeg[0][1];

}

app.loader = function () {
    this.engine.init();


    var imageObj = new Image();

    imageObj.onload = function () {
        var texture = new THREE.Texture();
        texture.image = this;
        texture.needsUpdate = true;
        app.initPages(texture);
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


