var app = {engine: new Engine(), elements: [], texturePath: "img/bg.jpg", tilesNum: 6};
app.show3DPage = function (texture) {
    var cardCount = 10;
    var choosenSure = Array(cardCount).fill(0);
    var choosen = Array(cardCount).fill(0);
    var INTERSECTED;
    var cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var quesDeg = [[-254, -35], [-222, 29], [-179, -23], [-151, 30], [-113, -35], [-80, 5.4], [-33, -11], [-9, 35], [25, 0.5], [66, -35]];
    var position = [[-1, -6, 10], [-5.8, 6, 8.14], [-9.45, -2, 3.25], [-9.58, 6, -2.84], [-6.15, -8, -7.88], [-0.436, 2, -9.99], [5.44, 0, -6.38], [9.30, 8, -3.66], [9.70, 0, 2.41], [6.49, -8, 7.6]];

    //初始化场景
/*    var geometry = new THREE.SphereGeometry(400, 240, 80);
    geometry.scale(-1.3, 1, 1);

    var material = new THREE.MeshBasicMaterial({
        map: texture
    });
    var mesh = new THREE.Mesh(geometry, material);
    this.engine.scene.add(mesh);*/

    var questions = Utils.getArrayItems(QSData.questions, cardCount);
    //生成答题卡
    for (var j = 0; j < cardCount; j++) {
        var data = questions[j];
        var resLi = "";
        for (var k = 0; k < data.answer.length; k++) {
            resLi += '<li><label><input type="radio" name="res'+j+'" value="' + (k + 1) + '">' + data.answer[k] + '</label></li>';
        }

        var ele = $('<div class="card">' +
            '<img src="img/card/' + cards[j] + '.png" style="position: absolute">' +
            '<div >' +
            '<spa>' + (j + 1) + '.' + data.question + '</spa>' +
            '<ul >' + resLi + '</ul>' +
            '<img  src="img/ok.png" ></div>' +
            '</div>')[0];
        var btn = $(ele).find("div img")[0]
        $(btn).click(commitResult);
        btn.num = j + 1;
        ele.angle = 360 - j * 35.5;
        console.log(ele.angle);

        var y = Math.floor(Math.random() * (4 - (-4) + 1) + -4);


        // ele.position =  new THREE.Vector3(Math.sin(THREE.Math.degToRad(ele.angle)) * 10, y ,Math.cos(THREE.Math.degToRad(ele.angle)) * 10);
        ele.position = new THREE.Vector3(position[j][0], position[j][1], position[j][2]);
        ele.rotation = new THREE.Vector3(THREE.Math.degToRad(Utils.getRandomNum(40, -45)), THREE.Math.degToRad(ele.angle + 90), 0);
        this.engine.makeCSS3DSprite(ele);
        this.elements.push(ele);
    }


    function commitResult(e) {
        app.result = computeResult();
        app.showResultPage();
        return;
        var num = e.currentTarget.num;
        var index = num-1;

        var result = $(e.currentTarget).parent().find('input[name="res'+index+'"]:checked').val();
        if (result == undefined) {
            alert("请选择答案");
            return;
        }
        else
            questions[index].result = parseInt(result);

        choosen[index] = num;
        var correct = choosen[index];
        choosenSure[index] = choosen[index];
        var score = 0;
        for (var i = index; i < 20; i++) {
            if (choosenSure[i % 10] == 0) {
                new TWEEN.Tween(app.engine.cameraSetting).to({
                    lon: quesDeg[i % 10][0],
                    lat: quesDeg[i % 10][1],
                }, 500)
                    .easing(TWEEN.Easing.Circular.Out).onComplete(function () {
                    console.log();
                }).start();
                break;
            }
        }

        for (var i = 0; i < 10; i++) {
            if (choosenSure[i] > 0) {
                score += choosenSure[i];
                if (i == 9) {
                    new TWEEN.Tween(app.engine.cameraSetting).to({
                        lon: 16000,
                    }, 4000)
                        .easing(TWEEN.Easing.Cubic.In).onComplete(function () {
                            app.result = computeResult();
                            app.showResultPage();
                    }).start();
                }
            }
            else {
                break;
            }
        }
    }

    /**计算成绩*/
    function computeResult() {
        return QSData.result[2];
        var count = 0, i;
        for (i = 0; i < questions.length; i++) {
            if (questions[i].rightIdx == questions[i].result)
                count++;
        }

        for (i = 0; i < QSData.result.length; i++) {
            var result = QSData.result[i];
            if (count > result.min && count <= result.max)
                return result;
        }
    }

    app.engine.cameraSetting.lon = quesDeg[0][0];
    app.engine.cameraSetting.lat = quesDeg[0][1];

}

app.loader = function () {

    this.engine.init(document.getElementById("3dPage"));
    var imageObj = new Image();

    imageObj.onload = function () {
        var texture = new THREE.Texture();
        texture.image = this;
        texture.needsUpdate = true;
        app.show3DPage(texture);
    };

    imageObj.src = app.texturePath;
};

/**显示测试结果页*/
app.showResultPage = function (noUpdate) {
    $("#3dPage").hide();
    $("#resultPage").show();
    if(app.result.title != "")
        $("#resTitle").text('你拥有的是"'+app.result.title+'#科学商#"');
    $("#resText").text(app.result.text);
    $(".two").click(function(){
        $("#resultPage").hide();
        app.showSexPage();
    });
}


/**显示性别选择页*/
app.showSexPage = function(){
    $("#sexPage").show();
    //确认
    $(".one1_three").click(function(){
        $("#sexPage").hide();
        app.showPSPage(1);
    });
}

/**显示合照页*/
app.showPSPage = function(sex){
    $("#psPage").show();
    var num = Utils.getRandomNum(2,1);
    var type = sex == 0 ? "men" : "women";

    $("#ps-bg").attr("src","img/share-bg-"+type+num+".png");
    var text = app.result.text;
    if(app.result.title != "")
        text = '你拥有的是"'+app.result.title+'#科学商#"'+ text;
    $(".mix li").text(text);
    var title = "幸运的你与"+app.result.name+"是一个类型的#科学商# "
    $("#psPage span").text(title);

    //设置合照的明星相片
    $("").attr("src",app.result.photo);

    //上传，跳至上传图片页
    $(".two_four").click(function(){
        $("#psPage").hide();
        app.showUpPhotoPage();
    });

    //生成合照，跳转至分享页
    $(".one_four").click(function(){
        $("#psPage").hide();
        app.showSharePage(text,title);
    });

}

/**显示相片上传页*/
app.showUpPhotoPage = function(){
    $("#uploadPage").show();

    //选择相片
    $(".noe_five").click(function(){
        $("#uploadFile").trigger("click");
    });
    var file;
    $("#uploadFile").change(function(e){
        var element = e.target;
        if (!element.files[0]) {
            return;
        }
        file = element.files[0];
        var reader = new FileReader();
        reader.onload = function (theFile) {
            $("#preview").attr("src",theFile.target.result);
        };
        reader.readAsDataURL(file);

    });

    //确定上传，跳转至合照页
    $(".two_five").click(function(){
        if(file == undefined){
            alert("请先上传照片");
            return;
        }
        $("#psPage").hide();
        app.showPSPage();
    });
}

/**显示分享页*/
app.showSharePage = function(text,title){
    $("#sharePage").show();

    $(".klas li").text(text);
    $("#sharePage span").text(title);

    //查看成绩
    $(".one_sven").click(function(){
        $("#sharePage").hide();
        $("#resultPage").show();
    });

    //分享给他人
    $(".two_sven").click(function(){

    });
}

$(function () {
    $(".one").click(function(){
        $("#homePage").hide();
        app.loader();
    })
    // app.loader();
});





