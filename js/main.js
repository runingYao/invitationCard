var app = {engine: new Engine(), elements: [], texturePath: "img/bg.webp", tilesNum: 6};
app.show3DPage = function (texture) {
    var cardCount = 10;
    var choosenSure = Array(cardCount).fill(0);
    var choosen = Array(cardCount).fill(0);
    var INTERSECTED;
    var cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var quesDeg = [[-244, -11], [-211, 24], [-181, -10], [-138, 23], [-105, -32], [-72, 1.6], [-26, -9], [1.45, 35], [34, -31], [72, 35]];
    var position = [[-1, 0, 10], [-5.8, 6, 8.14], [-9.45, -2, 3.25], [-9.58, 6, -2.84], [-6.15, -3, -7.88], [-0.436, 2, -9.99], [5.44, 0, -6.38], [9.30, 8, -3.66], [9.70, -5, 2.41], [6.49, 8, 7.6]];

    this.engine.init(document.getElementById("3dPage"));
    //初始化场景
    var geometry = new THREE.SphereGeometry(400, 240, 80);
    geometry.scale(-1.3, 1, 1);

    var material = new THREE.MeshBasicMaterial({
        map: app.texture
    });
    var mesh = new THREE.Mesh(geometry, material);
    this.engine.addMesh(mesh);

    var questions = Utils.getArrayItems(QSData.questions, cardCount);
    //生成答题卡
    for (var j = 0; j < cardCount; j++) {
        var data = questions[j];
        var resLi = "";
        for (var k = 0; k < data.answer.length; k++) {
            resLi += '<li><label><input type="radio" name="res' + j + '" value="' + (k + 1) + '">' + data.answer[k] + '</label></li>';
        }

        var ele = $('<div class="card">' +
            '<img src="img/card/' + cards[j] + '.webp" style="position: absolute">' +
            '<div >' +
            '<span>' + (j + 1) + '.' + data.question + '</span>' +
            '<ul >' + resLi + '</ul>' +
            '<img  src="img/ok.webp" ></div>' +
            '</div>')[0];
        var btn = $(ele).find("div img")[0]
        $(btn).click(commitResult);
        btn.num = j + 1;
        ele.angle = 360 - j * 35.5;
        //console.log(ele.angle);

        var y = Math.floor(Math.random() * (4 - (-4) + 1) + -4);


        // ele.position =  new THREE.Vector3(Math.sin(THREE.Math.degToRad(ele.angle)) * 10, y ,Math.cos(THREE.Math.degToRad(ele.angle)) * 10);
        ele.position = new THREE.Vector3(position[j][0], position[j][1], position[j][2]);
        var rx = 0;
        if(ele.position.y > 0)
                rx = -5;
        else if(ele.position.y < 0)
                rx = 5;
        ele.rotation = new THREE.Euler(THREE.Math.degToRad(rx), THREE.Math.degToRad( ele.angle-200), 0);
       //console.log( ele.rotation.y);
        this.engine.makeCSS3DSprite(ele);
        this.elements.push(ele);
    }


    function commitResult(e) {
/*        app.result = computeResult();
        app.showResultPage();
        return;*/
        var num = e.currentTarget.num;
        var index = num - 1;

        var result = $(e.currentTarget).parent().find('input[name="res' + index + '"]:checked').val();
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

                    $('#3dPage').delay(3500).fadeOut(500,function(){
                        app.result = computeResult();
                        app.showResultPage();
                    });
                    new TWEEN.Tween(app.engine.cameraSetting).to({
                        lon: 16000,
                    }, 4000)
                        .easing(TWEEN.Easing.Cubic.In).onComplete(function () {

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


    var imageObj = new Image();

    imageObj.onload = function () {
        app.texture = new THREE.Texture();
        app.texture.image = this;
        app.texture.needsUpdate = true;
        //app.show3DPage();
    };

    imageObj.src = app.texturePath;
};

/**显示测试结果页*/
app.showResultPage = function () {
    app.engine.dispose();
    $("#resultPage").show();

    if (app.result.title != "")
        $("#resTitle").text('你拥有的是"' + app.result.title + '#科学商#"');
    $("#resText").text(app.result.text);
    $(".two").click(function () {
        $("#resultPage").hide();
        app.showSexPage();
    });
    $(".two2").click(function () {
        window.location.reload();
    });
}


/**显示性别选择页*/
app.showSexPage = function () {
    $("#sexPage").show();
    //确认
    $(".one1_three").click(function () {
        $("#sexPage").hide();
        app.showPSPage($('#sexPage input[name="sex"]:checked').val());
    });
}

/**
 * 显示合照页
 * @param sex 性别
 * @param photo 上传的相片
 */
app.showPSPage = function (sex, photo) {
    $("#psPage").show();
    if (sex != undefined) {

        var num = Utils.getRandomNum(2, 1);
        app.result.sex = sex;
        $("#ps-bg").attr("src", "img/ps-bg-" + sex + ".webp");
        $("#face").attr("src", "img/ps-face-" + sex + ".webp");
        $("#avatar-ps").attr("class", "face-" + sex + " face");

        var text = app.result.text;
        if (app.result.title != "")
            text = '你拥有的是"' + app.result.title + '#科学商#\n"' + text;
        $(".mix li").text(text);
        var title = "幸运的你与" + app.result.name + "是一个类型的#科学商# "
        $("#psPage span").text(title);

        //设置合照的明星相片
        $(".star img").attr("src", "img/photo/" + app.result.photo);

        //上传，跳至上传图片页
        $(".two_four").click(function () {
            $("#psPage").hide();
            app.showUpPhotoPage();
        });

        //生成合照，跳转至分享页
        $(".one_four").click(goToShare);

        function goToShare() {
            if ($("#avatar-ps").attr("src") == "") {
                alert("请先上传相片");
                return;
            }
            $("#psPage").hide();
            app.showSharePage(text, title, $("#avatar-ps").attr("src"));
        }
    } else if (photo != undefined) {
        $("#face").hide();
        $("#avatar-ps").attr("src", photo);
    }


}

/**显示相片上传页*/
app.showUpPhotoPage = function () {
    $("#uploadPage").show();
    if (!app.upLoaded) {

        //选择相片
        $(".noe_five").click(function () {
            $("#uploadFile").trigger("click");
        });

        var clipArea = new bjj.PhotoClip("#clipArea", {
            size: [260, 260],
            outputSize: [640, 640],
            file: "#uploadFile",
            ok: ".two_five",
            loadStart: function () {
                console.log("照片读取中");
            },
            loadComplete: function () {
                console.log("照片读取完成");
            },
            clipFinish: function (dataURL) {
                app.upLoaded = true;
                $("#uploadPage").hide();
                app.showPSPage(undefined, dataURL);
            }
        });
    }
}

/**
 * 显示分享页
 * @param text 结果总结
 * @param title 标题
 */
app.showSharePage = function (text, title, photo) {
    $("#sharePage").show();

    $("#sharePage .bg").attr("src", "img/share-bg-" + app.result.sex + ".webp");
    $(".star2 img").attr("src", "img/photo/" + app.result.photo);
    $("#share-face").attr("src", photo);
    $("#share-face").attr("class", (app.result.sex == "men" ? "face-men" : "share-face-women") + " face");
    $(".klas li").text(text);
    $("#sharePage span").text(title);

    //查看成绩
    $(".one_sven").click(function () {
        window.location.reload();
    });

    //分享给他人
    $(".two_sven").click(function () {
        $("#share-mask").show();
    });
    //点击隐藏
    $("#share-mask").click(function () {
        $("#share-mask").hide();
    });

    setTimeout(function () {
        $("#music").hide();
        $("#sharePage input").hide();
        html2canvas($("#sharePage")[0], {
            width: $("#sharePage .bg").width(),
            height: $("#sharePage .bg").height(),
            scale: 1.5
        }).then(function (canvas) {
            $(".star2 img").hide();
            $(".klas li").hide();
            $("#sharePage span").hide();
            $("#sharePage .bg").attr("src", canvas.toDataURL());
            $("#sharePage input").show();
            $("#music").show();
        });
    }, 300);

}

/**初始化背景音乐*/
app.initAudio = function () {
    var play = $("#music-play")[0];
    $("#music").click(function () {
        if (play.paused) {
            play.play();
            this.setAttribute("class", "on");
        } else {
            play.pause();
            this.setAttribute("class", "off");
        }
    });
}

app.drawResult = function () {
    var canvas = document.createElement("canvas");
    canvas.width = $("#sharePage .bg").width();
    canvas.height = $("#sharePage .bg").height();
    var ctx = canvas.getContext("2d");
    //头像
    ctx.drawImage($("#share-face")[0], 0, 0, canvas.width, canvas.height);
    //背景
    ctx.drawImage($("#sharePage .bg")[0], 0, 0, canvas.width, canvas.height);
    var starPhoto = $("star2 img");
    //明星头像
    ctx.drawImage(starPhoto[0], starPhoto.offset().left, starPhoto.offset().top, starPhoto.width(), starPhoto.height());
}


$(function () {
    app.initAudio();
    app.loader();
    //点击开始
    $(".one").click(function () {
        $("#homePage").hide();
        app.show3DPage();
    });

    var href = window.location.href;//"http://www.runoob.com"
    new QRCode($(".result-rect")[0], {
        width : 110,
        height : 110
    }).makeCode(href);
    new QRCode($(".share-rect")[0], {
        width : 95,
        height : 95
    }).makeCode(href);

});





