/**
 * 2018/01/12
 * author: zxy
 * description: 布局事件
 */


var layoutEvent = function () {

    /** 设置默认活动模块
     *
     *  确保第一个模块为活动模块
     * */
    var initDefaultActiveModule = function () {
        $('.menu-bar li:first').addClass('active');
        $('.main-area section:first').addClass('active');
        // 下标大于0的移除active class
        $('.menu-bar li:gt(0)').removeClass('active');
        $('.main-area section:gt(0)').removeClass('active');

    };



    /**
     * 用户登出事件
     * */
    var logout = function () {
        $('.logout button').on('click',function () {
            window.location.href = 'index.html';
        });
    };

    return {
        init : function () {
            initDefaultActiveModule();
            // menu();
            // logout();
        }
    }
}();

$(document).ready(function () {
    layoutEvent.init();
});