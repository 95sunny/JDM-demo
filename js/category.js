/**
 * Created by Administrator on 2017/5/23.
 */

window.onload = function () {
    // 搞mainH
    getMainH();

    // 与左边列表的交互
    mainLeftInteraction();

    // shortcut的展示
    shortcutDisplay();

    // 作业1.,事项右边的滑动手势(参考左边列表的手势效果)
    zuoye();
}

window.onresize = function () {
    setTimeout(function () {
        getMainH();
    }, 100);
}

// 获取main高度
function getMainH() {
    // 1.拿到标签
    var mainbox = document.getElementsByClassName('jd_main')[0];
    var header = document.getElementsByClassName('jd_base_header')[0];
    // 2.拿到常量
    var headerH = header.offsetHeight;
    var screenH = window.screen.height;

    var mainH = screenH - headerH;

    // 3.赋值
    mainbox.style.height = mainH + 'px';
}

// 与左边列表的交互
/**
 * 一.跟随手势进行移动
 *
 * 二.tap事件
 * */
function mainLeftInteraction() {
   // 一.跟随手势进行移动
    // 1.拿到标签
    var mainLeftBox = document.getElementsByClassName('jd_main_left')[0];
    var ul_box = mainLeftBox.getElementsByTagName('ul')[0];

    // 2.拿到常量
    var ulH = ul_box.offsetHeight;
    var mainLeftH = mainLeftBox.offsetHeight;

    // topY值的变化的范围
    var topY = 0;
    var ul_topMaxY = 0;
    var ul_topMinY = mainLeftH - ulH; // 524 - 1104
    // 缓冲范围
    var bufferH = 138; // 46 * 3
    var ul_topBufferMaxY = ul_topMaxY + bufferH;
    var ul_topBufferMinY = ul_topMinY - bufferH;


    // 3.设置guodu,移出缓冲 ,竖直方向位移
    // 3.1 设置过渡
    function setTransition() {
        ul_box.style.transition = 'all .2s ease';
        ul_box.style.webkitTransition = 'all .2s ease';
    }

    // 3.2 移除过度
    function removeTransition() {
        ul_box.style.transition = 'none';
        ul_box.style.webkitTransition = 'none';
    }

    // 3.3 设置竖直方向位移
    function changeTranslateY(y) {
        ul_box.style.transform = 'translateY(' + y + 'px)';
        ul_box.style.webkitTransform = 'translateY(' + y + 'px)';
    }

    // 4.跟随手势位移
    var startY,movingY,changedY;
    startY = 0;
    movingY = 0;
    changedY = 0;
    // 4.1 手势开始
    ul_box.addEventListener('touchstart', function (e) {
        // 拿到初始y值
        startY = e.touches[0].clientY;
    })
    // 4.2 开始滑动
    ul_box.addEventListener('touchmove', function (e) {
        e.preventDefault(); // 取消默认事件

        // 4.2.1 拿到竖直位移的改变
        movingY = e.touches[0].clientY;
        changedY = movingY - startY;

        // 跟随非过渡位移
        // 4.2.2 确定topY能位移的范围,若超过范围,让滑动手势的跟随位移失效
        var temp_topY = topY + changedY;
        console.log(temp_topY);
        if (temp_topY > ul_topBufferMinY && temp_topY < ul_topBufferMaxY){
            removeTransition();
            changeTranslateY(temp_topY);
        }else {
            // ul_box非过渡位移 忽略
        }

    })
    // 4.3 结束手势
    ul_box.addEventListener('touchend', function (e) {
        // 4.3.0 手势结束的时候,记录topY的改变
        // 注意:changedY 并未进行范围判断过滤,所以topY不必考虑太多
        topY = topY + changedY; // 将temp_topY赋值给topY
        // 4.3.1 判断topY是否在缓冲区域,如果在进行过渡的位置就找
        console.log('touchend:', topY);
        if (topY > ul_topMaxY){ // 若比最大值大,回复成最大值,并进行过渡
            topY = ul_topMaxY;
            setTransition();
            changeTranslateY(topY);
        }else if(topY < ul_topMinY){ // 若比最小值小,回复成最小值,并进行过渡
            topY = ul_topMinY;
            setTransition();
            changeTranslateY(topY);
        }else {
            // 不需要过渡
            removeTransition();
        }

        // 4.3.2 数据还原
        startY = 0;
        movingY = 0;
        changedY = 0;
    })

    // 二.tap事件
    // 1.切换选中的li  2.让ul_box进行过渡位移->让选中的恰好处于最顶部->让topY= 负的(li的下标 * li的高度46)

    mjd.tap(ul_box, function (e) {
        // console.log(e.target);
        // console.log(e.target.parentNode);
        // 1.拿到标签
        var li_array = ul_box.getElementsByTagName('li');
        var tap_li = e.target.parentNode;
        // 2.判断若当前tap_li就是选中的,那直接返回
        if (tap_li.className == 'current'){
                console.log("tap_li is current li!!");
                return;
        }else {
            // 3.如果不是,消除原先的选中
            for (var i = 0; i < li_array.length; i++){
                li_array[i].className = '';

                // 记录index
                li_array[i].index = i;
            }

            // 4.让当前tap_li是选中的
            tap_li.className = 'current';

            // 5.过渡位移
            // 5.1 拿到改变后的topY
            topY = - tap_li.index * 46;
            // 5.2 topY值过滤
            if (topY < ul_topMinY) topY = ul_topMinY;
            // 5.3 进行过渡位移
            setTransition();
            changeTranslateY(topY);

            // 6.刷新右边内容的数据(伪刷新)
            var mainRight = mainLeftBox.parentNode.getElementsByClassName('jd_main_right')[0];
            // console.log(mainRight);
            // 若想要拿到 element.style.display , element在html中需要有style的设置
            mainRight.style.display = 'none';
            setTimeout(function () {
                mainRight.style.display = 'block';
            }, 200);
        }
    })
}

// 把变量名字修改一下
// 或者是


function zuoye() {
    // 1.拿到标签


    // 2.拿到常量


    // topY值的变化的范围

    // 缓冲范围
    var bufferH = 138; // 46 * 3



    // 3.设置guodu,移出缓冲 ,竖直方向位移
    // 3.1 设置过渡


    // 3.2 移除过度


    // 3.3 设置竖直方向位移


    // 4.跟随手势位移
    var startY,movingY,changedY;
    startY = 0;
    movingY = 0;
    changedY = 0;
    // 4.1 手势开始

    // 4.2 开始滑动

    // 4.3 结束手势

        // 4.3.0 手势结束的时候,记录topY的改变
        // 注意:changedY 并未进行范围判断过滤,所以topY不必考虑太多
         // 将temp_topY赋值给topY
        // 4.3.1 判断topY是否在缓冲区域,如果在进行过渡的位置就找

    // 若比最大值大,回复成最大值,并进行过渡
    // 若比最小值小,回复成最小值,并进行过渡


        // 4.3.2 数据还原
        startY = 0;
        movingY = 0;
        changedY = 0;

}