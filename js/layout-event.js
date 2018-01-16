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

    return {
        init : function () {
            menu();
        }
    }
}();

$(document).ready(function () {
    layoutEvent.init();
});