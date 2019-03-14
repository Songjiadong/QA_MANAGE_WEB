$.SetBaseUrl("http://qamanage.megawise.cn/");
//避免缓存文件
$.ajaxSetup({
    cache: false
});
window.objPub = {
    IsLogin: false,
    BaseUrl: "http://qamanage.megawise.cn/",
    WeixinUrl: "http://weixin.miic.com.cn/",
    UserID: $.GetCookie("MegawiseID") == undefined ? "" : $.GetCookie("MegawiseID"),
    UserName: $.GetCookie("MegawiseUserName") == undefined ? "" : decodeURI($.GetCookie("MegawiseUserName")),
    LoginUserInfo: null,
};