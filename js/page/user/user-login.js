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

User.Login.LoginEvent = function LoginEvent(event){
    
    $("#txtUserCodeTip,#txtPasswordTip").hide()
    if ($("#txtLoginUser").val() != ""
       && $("#txtLoginPass").val() != "") {
    $.SimpleAjaxPost("service/user/GetPublicKey",true).done(function(json){
        var encrypt = new JSEncrypt();
			var decrypt = new JSEncrypt();
            encrypt.setPublicKey(json.publicKey);
            decrypt.setPrivateKey(json.privateKey);
            var data = encrypt.encrypt($.md5($.md5($("#txtLoginPass").val())));
            var rsa_password = decrypt.decrypt(data);
			$.SimpleAjaxPost("service/user/Login",true,JSON.stringify({
                RsaPassword: rsa_password,
                UserCode:    $("#txtLoginUser").val(),
                PlateSource: User.Login.WebType.User.toString(),
            })).done(function(json){
                temp = json.Info;
                check_user_code = temp.CheckUserCode
                check_password = temp.CheckPassword
                is_disabled = temp.IsDisabled

                if(check_user_code == undefined){
                    $("#txtUserCodeTip").show();
                    $("#txtUserCodeTip").html("账号错误");
                    return false;
                }if(check_password == undefined){
                    $("#txtPasswordTip").html("密码错误")
                    $("#txtPasswordTip").show()
                    $("#txtUserCodeTip").hide()
                    return false;
                }else if( is_disabled== true){
                    $("#txtUserCodeTip").show()
                    $("#txtUserCodeTip").html("该用户未激活");
                    return false;
                }else{
                    window.location.href=objPub.BaseUrl;
                    
                }
            })
        })
    }
}
User.Login.LoginOutEvent = function LoginOutEvent(event){
    $.Confirm({ content: "尊敬的用户" + objPub.UserName + "：您确定要退出登录吗?", width: "auto" }, function () {
        $.ClearCookie("MegawiseID");
        $.ClearCookie("MegawiseUserName");
        window.location.href=objPub.BaseUrl+"login.html";
    });
}
$(function () {
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