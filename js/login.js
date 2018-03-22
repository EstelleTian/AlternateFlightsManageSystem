/**
 * Created by caowei on 2017/11/30.
 */
var LOGIN = function () {
    // 按钮loading
    var loading = null;

    //判断是否是谷歌浏览器
    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
    if (!isChrome) {
        alert('推荐使用谷歌浏览器');
    }
    /**
     * 校验登录表单
     */
    var isValidLogonInfo = function() {
        // 初始化校验
        $("#data_form").bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                username: {
                    message: 'The username is not valid',
                    validators: {
                        notEmpty: {
                            message: '用户名不能为空'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空'
                        }
                    }
                }
            }
        });
        // 校验
        $('#data_form').data('bootstrapValidator').validate();

        return $('#data_form').data('bootstrapValidator').isValid();
    };

    /**
     * 登录失败
     * */
    var loginFail = function (txt) {
        // 停止loading
        loading.stop();
        if(!$.isValidVariable(txt)){
            txt = '登录失败';
        }
        // 清除表单校验样式
        $(".form-group").removeClass("has-success");
        // 高亮显示用户名和密码输入框(红色)
        $(".user").addClass("error")
        $(".pwd").addClass("error");
        $(".user").find(".form-control-feedback").removeClass("glyphicon-ok").addClass("glyphicon-remove");
        $(".pwd").find(".form-control-feedback").removeClass("glyphicon-ok").addClass("glyphicon-remove");
        // 显示错误信息
        $(".error_tip").text(txt).addClass("error");

    };


    /**
     * 登录成功
     * */
    var loginSuccess = function (data) {
        // 停止loading
        loading.stop();
        // 更新sessionStorage
        sessionStorage.removeItem("userName","");
        sessionStorage.removeItem("userId","");
        sessionStorage.removeItem("loginTime","");
        sessionStorage.setItem("userName", data.user.description);
        sessionStorage.setItem("userId", data.user.id);
        sessionStorage.setItem("loginTime",data.generateTime);
        // 跳转页面
        window.location = "home.html";
    };


    /**
     * 提交表单
     *
     * */
    var submitForm = function () {

        // 初始化按钮loading
        loading = Ladda.create($('.addAdminForm')[0]);
        // 开启loading
        loading.start();
        // 获取表单数值
        var userName = $('#inputName').val();
        var passWord = $('#inputPassword').val();
        // ajax请求
        $.ajax({
            type: "POST",
            url: ipHost + "logon/userLogon/",
            data:{
                username:userName,
                password:passWord
            },
            dataType: "json",
            success:function (data) {
                if($.isValidObject(data)){
                    if(data.status == 200){ // 登录成功
                        loginSuccess(data);
                    }else if (data.status == 202) {
                        loginFail(data.error.message);
                    } else if($.isValidObject(data.error) && $.isValidVariable(data.error.message)){
                        loginFail(data.error.message);
                    } else {
                        loginFail();
                    }
                }
            },
            error:function (error) {
                loginFail();
                console.error(error);
            }
        })
    }

    /**
     *
     * 初始化登录
     * */
    var initLogin = function () {
        // 校验登录表单
        var valid = isValidLogonInfo();
        if(valid){
            // 提交表单
            submitForm();
        }
    }


    /**
     * 初始化事件绑定
     * */
    var initEvent = function () {
        //键盘回车事件
        $(window).keydown(function (event) {
            switch (event.keyCode) {
                case 13:
                    // 初始化登录
                    initLogin();
            };
        });
        // 点击登录按钮
        $(".sub_button").click(function () {
            // 初始化登录
            initLogin();
        })

    }

    return {
        init : function () {
            // 初始化事件绑定
            initEvent();
        }
    }

}();
$(document).ready(function () {
    LOGIN.init();
})
