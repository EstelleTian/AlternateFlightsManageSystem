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
        if(isValidLogonInfo()){
            $.ajax({
                type: "POST",
                url: ipHost + "crs_system/userLogon/",
                data:{
                    username:userName,
                    password:passWord
                },
                dataType: "json",
                success:function (data) {
                   if($.isValidObject(data)){
                       if(data.status == 200){
                           localStorage.removeItem("userName","");
                           localStorage.setItem("userName",userName);
                           localStorage.removeItem("userId","");
                           localStorage.setItem("userId",data.user.id);
                           localStorage.removeItem("onlyValue","");
                           localStorage.setItem("onlyValue",data.user.onlyValue);
                           window.location = "../home.html";
                       }else{
                           if(data.error.message == "密码错误"){
                               $(".form-group").removeClass("has-success");
                               $(".user").addClass("has-success")
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
