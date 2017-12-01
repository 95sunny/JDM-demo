/**
 * Created by Administrator on 2017/5/24.
 */
window.onload = function () {
    // 展示快捷栏
    shortcutDisplay();

    // 垃圾篓的点击
    rubbishboxTap();

    // 残缺的check
    changeChecked();


    // 作业2.实现点击+标签,实现input里面+1
    // goods_count> + / input,+添加tap, callback: 1.拿到input.value-> 强制转整数(value)+1, 再复制input.value
}

// 垃圾篓 点击
/**
 * 1.垃圾篓打开盖子, 就是让up旋转
 *
 * 2.弹出自定义alert
 * */
function rubbishboxTap() {
    // 1.拿到标签
    var rubbishBoxs = document.getElementsByClassName('rubbishbox');
    var alertCover = document.getElementsByClassName('alert_cover')[0];
    var alert = alertCover.getElementsByClassName('alert')[0];

    var cancleBox = alert.getElementsByClassName('alert_bottom_left')[0];
    var sureBox = alert.getElementsByClassName('alert_bottom_right')[0];

    // 标记点击tap_box的盖子
    var up;
    for (var i = 0; i < rubbishBoxs.length; i++){
        (function (index) {
            var tap_box = rubbishBoxs[index];
            mjd.tap(tap_box, function (e) {
                // console.log(e.target.parentNode == tap_box);
                // 1.拿到盖子
                up = tap_box.getElementsByClassName('up')[0];

                // 2.让他旋转
                // 2.1 设置过渡
                up.style.transition = 'all .2s ease';
                up.style.webkitTransition = 'all .2s ease';

                // 2.2设置旋转原点
                up.style.transformOrigin = 'left 3px';
                up.style.webkitTransformOrigin = 'left 3px';

                // 2.3 设置旋转
                up.style.transform = 'rotate(-30deg)';
                up.style.webkitTransform = 'rotate(-30deg)';

                // 3.弹出自定义alert(alertcover:display切换)
                alertCover.style.display = 'block';

                // 4.解决弹出动画
                alert.className = 'alert spring_jump';
            })
        })(i);
    }


    // 给取消按钮添加tap
    mjd.tap(cancleBox, function (e) {
        // 转回去
        up.style.transform = 'none';
        up.style.webkitTransform = 'none';
        // 再通过延时操作,解决display与过渡冲突问题
        setTimeout(function () {
            // css3里,display切换会对 css的过渡/动画效果,产生破坏
            alertCover.style.display = 'none';
        }, 222);
    })

    mjd.tap(sureBox, function (e) {
        // 1.转回去
        up.style.transform = 'none';
        up.style.webkitTransform = 'none';
        // 2.再通过延时操作,解决display与过渡冲突问题
        setTimeout(function () {
            // css3里,display切换会对 css的过渡/动画效果,产生破坏
            alertCover.style.display = 'none';
        }, 222);

        // 3.将垃圾篓所在的商品给干掉
        // console.log(up.parentNode.parentNode.parentNode.parentNode.parentNode);
        for (var box = up.parentNode; box.className != 'jd_shop'; box = box.parentNode){
            // console.log(box.className);
            if (box.className == 'shop_goods'){
                // 让box父标签移出他的儿子box
                box.parentNode.removeChild(box);
                // 之所以使用break而不是用return原因, 可以之后 还有 4.5.6的操作没有写
                break;
            }
        }
    })
}


/**
 * 1.由于checkbox过小,导致手势可能点到他爹身上
 *
 * 2.与真实业务逻辑不符
 *
 * */
function changeChecked() {
    // 1.拿到标签
    var checkBoxs = document.getElementsByClassName('checkbox');

    for (var i = 0; i < checkBoxs.length; i++){
        // 2.给checkbox添加tap事件
        mjd.tap(checkBoxs[i], function (e) {
            console.log(e.target);
            var checkBox = e.target;
            // 检测checkBox是否有checked
            if (checkBox.hasAttribute('checked')){
                // 移出checked属性
                checkBox.removeAttribute('checked');
            }else {
                // 添加checked属性以及checked属性的value
                checkBox.setAttribute('checked', '');
            }
        })
    }
}