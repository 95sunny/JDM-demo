/**
 * Created by Administrator on 2017/5/20.
 */

window.mjd = {};

/**
 * 1.如果手指滑动了,就不是tap了
 * 2.如果 touchstart于touchend 两个事件间隔超过 duration, 认为不是tap, 而是LongPress
 * */
mjd.tap = function (obj, callback) {// obj是tap的对象, callback是tap的回调
    if (typeof(obj) != 'object'){
        console.log('error:typeof(obj) != object ');
        return;
    }

    var ismoving = false;
    var duration = 300; // 毫秒级别
    var startTime = Date.now();
    obj.addEventListener('touchstart', function (e) {
        startTime = Date.now();
    })
    obj.addEventListener('touchmove', function (e) {
        e.preventDefault();

        ismoving = true;
    })
    obj.addEventListener('touchend', function (e) {
        if (ismoving == false && (Date.now() - startTime < duration)){
            if (callback){ // 如果有回调就执行回调
                callback(e);
            }
        }

        // 数据还原
        ismoving = false;
    })
}

// shortcutDisplay
function shortcutDisplay() {
    // 1.拿到标签
    var header = document.getElementsByClassName('jd_base_header')[0];
    var tap_box = header.getElementsByClassName('icon_shortcut')[0];
    var shortcutBox = header.getElementsByClassName('jd_shortcut')[0];

    // 2.给tap_box添加tap
    mjd.tap(tap_box, function (e) {
        // 3.拿到当前 shortcutBox.style.display
        var cur_display = shortcutBox.style.display;
        if (cur_display == 'none'){
            shortcutBox.style.display = 'table';
        }else if (cur_display == 'table'){
            shortcutBox.style.display = 'none';
        }
    })
}