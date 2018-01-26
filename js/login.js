/**
 * Created by caowei on 2017/11/30.
 */
var LOGIN = function () {
    //判断是否是谷歌浏览器
    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
    if (!isChrome) {
        alert('推荐使用谷歌浏览器');
    }
    /**
     * 用户登录
     */
    function isValidLogonInfo() {
        // 验证登陆信息
            $("#data_form").bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields:{
                    username:{
                        message: 'The username is not valid',
                        validators: {
                            notEmpty: {
                                message: '用户名不能为空'
                            }
                        }
                    },
                    password:{
                        validators: {
                            notEmpty: {
                                message: '密码不能为空'
                            }
                        }
                    }
                }
            })
            $('#data_form').data('bootstrapValidator').validate();
            if(!$('#data_form').data('bootstrapValidator').isValid()){
            return false;
        }
        return true;
    }
    function login(userName,passWord) {
        var loading = Ladda.create($('.addAdminForm')[0])
        loading.start();
        if(isValidLogonInfo()){
            $.ajax({
                type: "POST",
                url: ipHost + "altf/logon/userLogon/",
                data:{
                    username:userName,
                    password:passWord
                },
                dataType: "json",
                success:function (data) {
                   if($.isValidObject(data)){
                       if(data.status == 200){
                           loading.stop();
                           sessionStorage.removeItem("userName","");
                           sessionStorage.setItem("userName", data.user.description);
                           sessionStorage.removeItem("loginTime","");
                           sessionStorage.setItem("loginTime",data.generateTime);
                           window.location = "home.html";
                       }else{
                           if(data.status == 202){
                               loading.stop();
                               $(".form-group").removeClass("has-success");
                               $(".user").addClass("error")
                               $(".user").find(".form-control-feedback").removeClass("glyphicon-ok");
                               $(".user").find(".form-control-feedback").addClass("glyphicon-remove");
                               $(".pwd").find(".form-control-feedback").removeClass("glyphicon-ok");
                               $(".pwd").find(".form-control-feedback").addClass("glyphicon-remove");
                               $(".pwd").addClass("error");
                               $(".error_tip").text(data.error.message).addClass("error");
                               return
                           }
                           $(".form-group").removeClass("has-success");
                           $(".form-control-feedback").removeClass("glyphicon-ok");
                           $(".form-control-feedback").addClass("glyphicon-remove");
                           $(".form-group").addClass("has-error");
                           $(".error_tip").text(data.error.message).addClass("error");
                       }
                   }
                },
                error:function (error) {
                    console.error(error);
                }
            })
        }else{

        }
    }
    $(".sub_button").click(function () {
        // 获取登陆信息
        var loginUserName = $('#inputName').val();
        var loginPassWord = $('#inputPassword').val();
        login(loginUserName,loginPassWord);
    })
    //键盘回车事件
    $(window).keydown(function (event) {
        switch (event.keyCode) {
            case 13:
                var loginUserName = $('#inputName').val();
                var loginPassWord = $('#inputPassword').val();
                login(loginUserName,loginPassWord);
        };
    });
}
$(document).ready(function () {
    LOGIN();
})
