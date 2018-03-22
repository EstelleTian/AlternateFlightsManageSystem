/**
 * Created by FQL on 2018/3/22.
 */

var Common = {
    /**
     * 提示框 (仅用于提示作用)
     * */
    alertDialog : function (text) {
        var options = {
            title : "提示",
            content : '<p class="modal-text">'+text+'</p>',
            status: 2,// 1:正常 2:警告 3:危险 不填:默认情况
            width : 400,
            mtop: 200,
            showCancelBtn: false,
            buttons: [
                {
                    name : "关闭",
                    status :1 ,
                    callback : function(){

                    }
                }
            ]
        };
        BootstrapDialogFactory.dialog(options);
    },
    /**
     * 时间格式化
     * @param time
     * @returns {string}
     */
    formatterTime : function (time) {
        if ($.isValidVariable(time) && time.length == 12) {
            var year = time.substring(0, 4);
            var mon = time.substring(4, 6);
            var date = time.substring(6, 8);
            var hour = time.substring(8, 10);
            var min = time.substring(10, 12);
            var str = year + '-' + mon + '-' + date + ' ' + hour + ":" + min;
            return str;
        }else {
            return time;
        }
    },

    /**
     * 在指定的毫秒数后调用一次函数
     * fn 待执行函数
     * time 毫秒 指定的毫秒数后调用
     * */
    timeoutCallback  : function (fn,time) {
        setTimeout(function () {
            fn(time)
        },time);
    }

};