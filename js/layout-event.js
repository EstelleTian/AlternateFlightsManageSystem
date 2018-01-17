/**
 * 2018/01/12
 * author: zxy
 * description: 布局事件
 */


var layoutEvent = function () {
    /**
     *  菜单栏事件
     * */
    var menu = function () {
        $('.menu-bar li').on('click',function () {
            // 取得当前点击对象
            var $that = $(this);
            // 若当前点击对象已经是活动的对象()则不作操作
            if($that.hasClass('active')){
                return;
            }
            // 反之将当前点击对象及内容设置为活动对象
            var index = $that.index();
            $('.menu-bar li').removeClass('active');
            $('.main-area section').removeClass('active');
            $that.addClass('active');
            $('.main-area section').eq(index).addClass('active');
        });
    };
    /**
     * 用户登出事件
     * */
    var logout = function () {
        $('.logout button').on('click',function () {
            window.location.href = 'index.html';
        });
    }

    return {
        init : function () {
            menu();
            logout();
        }
    }
}();

$(document).ready(function () {
    layoutEvent.init();
});