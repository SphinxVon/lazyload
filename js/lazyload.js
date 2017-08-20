window.lazyload = function (json) {
    if (!json){return false}
//  没有设置本地地址时，则默认从unspalah获取图片
    if (json.data.length===0){json.random = true}
//  没有设置获取的数量时，默认50
    if (json.random&&!json.count) {json.count = 50}
    var $container = json.container;
    var $pic_wrapper = $container.find('.pic-content .pic-wrapper');
// 宽度默认固定与$pic_wrapper宽度一致
    var width = json.width?json.width:$pic_wrapper.height();
    var height;
    /*存储取imgsrc的地址*/
    var dataSrc = json.data;
// 是否从unsplash获取图片
    var getRandom = json.random;
// 欲从unsplash随机加载的图片数量
    var count = getRandom?json.count:0;
// 每次请求的图片数量
    var num = json.num?json.num:5;
// 临界值 当可视区域离图片还有 threshold 个象素的时候开始加载图片
    var threshold = json.threshold?json.threshold:150;
// 加载动画
    var animate = json.animate?json.animate:'fade';
// 动画加载时间
    var time = json.time?json.time:400;
// 图片的数量
    var length = dataSrc.length;


// setUrl() 从upsplash随机加载图片
    function setUrl() {
        /**  https://unsplash.it/500/900?random //   ?random 随机
         *    https://unsplash.it/g/200/300     //    /g 灰度
         *    https://unsplash.it/200/300/?gravity=east  // 重心朝东
         **/
        var format = ['random','blur','gravity=east','gravity=west','gravity=north','gravity=south','gravity=center'];
        var style = format[Math.floor(Math.random()*format.length)];
        var w = width;
        height  = Math.floor(Math.random()*100)+360;
        var url = 'https://unsplash.it/'+w+'/'+height+'/?'+style+'';
        dataSrc.push(url);
        length ++;
    }
    for(var i=0;i<count;i++){
        setUrl();
    }
// 创建Img的初始值
    var index = 0;
    /*create(),创建*/
    function create() {
        var aImg = new Image();
        aImg.src = dataSrc[index%length];
        aImg.onload = function () {
// 图片加载完成后立即执行
            var $con = $('<a href=""><img src="' + aImg.src + '"/></a>');
//                    $con.css({display:"none"});
            getShortLi($pic_wrapper).append($con);
            setAnimate($con);
        };
    }
    /* 图片加载动画 setAnimate(obj) */
    function setAnimate(obj) {
        switch (animate) {

            // 还可以设置些弹性动画
            case 'fade' : obj.stop().css('dispaly','blcok').fadeIn();break;
            case 'slideDown' : obj.slideDown();break;
            case 'scale' :
                obj.stop().css({
                    "display":'block',
                    "opacity":0,
                    "transform":"scale(0)"
                }).animate({
                    "opacity":1,
                },time);obj.addClass('scale');break;
        }
    }
    /* getShortLi(),获取加载队列中最短的一个li */
    function getShortLi($obj) {
// 返回出去的对象
        var obj;
// 定义无限高
        var maxH = Infinity;
        $.each($obj,function (i) {
            var height = $(this).height();
            if (height  < maxH) {
                maxH = height;
                obj = $(this);
            }
        });
        return obj;
    }

// 记录已经加载的图片数量
    var sum = 0;
    /* upload() 加载图片 */
    function upload() {
        if (index < num) {
            for (; index < num; index++) {
                create();
            }
        } else {
            sum = index;
            for (; index < sum + num; index++) {
                create();
            }
        }
    }
    upload();
    /* 向下滚动时懒加载 */
// 定义文档高度
    var scrollH = "";
// 定义滚动条高度
    var scrollT = "";
    $(function () {
// 获取可视区域的高度
        var _height = $(window).height();
        $(window).scroll(function () {
// 获取文档的高度
            scrollH = document.body.scrollHeight;
// 滚动条的高度
            scrollT = document.body.scrollTop;
            if (_height + scrollT + threshold > scrollH) {
                upload();
            }
        });
    });
};