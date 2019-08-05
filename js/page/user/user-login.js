User.Login=function(){}
User.Login.registerClass("User.Login");
///排序列别枚举 
User.Login.WebType = function () {
    throw Error.notImplemented();
}

User.Login.WebType.prototype = {
    //前台
    User: 1,
    //后台
    Manage:2
}
User.Login.WebType.registerEnum("User.Login.WebType");
///消息类别枚举@start///
User.Login.Login = function login(rsa_password){
    $.SimpleAjaxPost("service/user/Login",true,JSON.stringify({
        RsaPassword: rsa_password,
        UserCode:    $("#txtLoginUser").val(),
        PlateSource: User.Login.WebType.User.toString(),
    })).done(function(json){
        var user_login_info = json.Info;
        var bool_list = $.Deserialize(user_login_info.BoolList.Object)
        var check_user_code = bool_list.CheckUserCode
        var check_password = bool_list.CheckPassword
        var is_disabled = bool_list.IsDisabled

        if(check_user_code == "false"){
            $("#txtUserCodeTip").show();
            $("#txtUserCodeTip").html("账号错误");
            return false;
        }if(check_password == "false"){
            $("#txtPasswordTip").html("密码错误")
            $("#txtPasswordTip").show()
            $("#txtUserCodeTip").hide()
            return false;
        }else if(is_disabled== "true"){
            $("#txtUserCodeTip").show()
            $("#txtUserCodeTip").html("该用户未激活");
            return false;
        }else{
            window.location.href=objPub.BaseUrl+"main.html";
            
        }
    })
}

User.Login.LoginEvent = function LoginEvent(event){
    
    $("#txtUserCodeTip,#txtPasswordTip").hide()
    if ($("#txtLoginUser").val() != ""
       && $("#txtLoginPass").val() != "") {
    $.SimpleAjaxPost("service/user/GetPublicKey",true).done(function(json){
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(json.publicKey);
        var rsa_password = encrypt.encrypt($.md5($.md5($("#txtLoginPass").val())));
        User.Login.Login(rsa_password)
        })
    }
}
User.Login.LoginOutEvent = function LoginOutEvent(event){
    $.Confirm({ content: "尊敬的用户" + objPub.UserName + "：您确定要退出与智管理平台?", width: "auto" }, function () {
        $.ClearCookie("MegawiseID");
        $.ClearCookie("MegawiseUserName");
        window.location.href=objPub.BaseUrl+"index.html";
    });
}
//回车登录事件
User.Login.LoginPressEvent = function LoginPressEvent(event) {
    if (event.keyCode == 13) { //绑定回车 
    $("#txtUserCodeTip,#txtPasswordTip").hide()
    if ($("#txtLoginUser").val() != ""
       && $("#txtLoginPass").val() != "") {
        $.SimpleAjaxPost("service/user/GetPublicKey",true).done(function(json){
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(json.publicKey);
        var rsa_password = encrypt.encrypt($.md5($.md5($("#txtLoginPass").val())));
        User.Login.Login(rsa_password)
        })
        }
    }
}
$(function () {
    $("#sctLoginForm").off("keypress").on("keypress", User.Login.LoginPressEvent);
    $("#aLogin").off("click").on("click",User.Login.LoginEvent);
    $("#txtLoginUser").off("focus").on("focus",function(){
        $(".login-logo-pass").css("background","url('/images/key.png') no-repeat")
        $(".login-logo-user").css("background","url('/images/user-o.png') no-repeat")
    })
    $("#txtLoginPass").off("focus").on("focus",function(){
        $(".login-logo-user").css("background","url('/images/user.png') no-repeat")
        
        $(".login-logo-pass").css("background","url('/images/key-o.png') no-repeat")
    })
    //unicode转中文（cookie用）
    // var name_code = $.GetCookie("MegawiseName")
    // str = unescape(name_code.replace(/\u/g, "%u")); 
    
});