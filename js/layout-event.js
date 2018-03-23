var layoutEvent = function () {
    /**
     * 验证用户信息有效性
     * */
    var verifyUservalidity= function () {
        // 用户名
        var userName = sessionStorage.getItem('userName');
        // 登录时间
        var loginTime = sessionStorage.getItem('loginTime');
        // 若用户名或登录时间无效，警告
        if(!$.isValidVariable(userName) || !$.isValidVariable(loginTime)){
            var options = {
                title : "警告",
                content : '<p class="modal-text">用户未登录,请登录!</p>',
                status: 2,// 1:正常 2:警告 3:危险 不填:默认情况
                width : 400,
                mtop: 200,
                showCancelBtn: false,
                buttons: [
                    {
                        name: '确定',
                        isHidden: false,
                        status: 1,
                        callback: function () {
                            window.location = "index.html";
                        }
                    }
                ]
            };
            BootstrapDialogFactory.dialog(options);
            // 隐藏模态框右上角关闭按钮
            $('#bootstrap-modal-dialog .close').hide();
        }else {
            // 显示用户信息
            $('.login-time').text('登录时间:' + Common.formatterTime(loginTime));
            $('.user-name').text(userName);
            // 执行程序主入口
            app.init();
        }
    };
    /**
     * 登出
     *
     * */
    var initLogout = function () {
        $(".user_logout").click(function () {
            $.ajax({
                type: "POST",
                url: ipHost + "logon/userLogout/",
                data: {},
                success: function (data) {
                    if ($.isValidObject(data) && data.status == 200) {
                        sessionStorage.removeItem("userId", "");
                        sessionStorage.removeItem("userName", "");
                        sessionStorage.removeItem("loginTime", "");
                        window.location = "index.html";
                    }else if (data.status == 500) {
                        var txt = data.error.message + ',请稍候再试!'
                        Common.alertDialog(text);
                    }
                },
                error: function () {
                    console.error('retrieve statistic data failed, state:');
                    console.error(status);
                }
            })
        })
    };


    return {
        init : function () {
            // 验证用户信息有效性
            // verifyUservalidity();
            // 登出
            initLogout();
        }
    }
}();

$(document).ready(function () {
    layoutEvent.init();
});
