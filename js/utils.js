var Utils = {
    getArrayItems:function  (array,length) {
        //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
        var temp_array = new Array();
        for (var index in array) {
            temp_array.push(array[index]);
        }
        //取出的数值项,保存在此数组
        var return_array = new Array();
        for (var i = 0; i < length; i++) {
            //判断如果数组还有可以取出的元素,以防下标越界
            if (temp_array.length > 0) {
                //在数组中产生一个随机索引
                var arrIndex = Math.floor(Math.random() * temp_array.length);
                //将此随机索引的对应的数组元素值复制出来
                return_array[i] = temp_array[arrIndex];
                //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                temp_array.splice(arrIndex, 1);
            } else {
                //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                break;
            }
        }
        return return_array;
    },
    getRandomNum:function( max, min) {return Math.floor(Math.random()*(max-min+1)+min);}
};


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