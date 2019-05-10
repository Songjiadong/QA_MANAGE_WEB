$.SetBaseUrl("http://qamanage.megawise.cn/");
//避免缓存文件
$.ajaxSetup({
    cache: false
});
$.SetCookie("MegawiseID","admin");
$.SetCookie("MegawiseUserName","admin");
window.objPub = {
    IsLogin: false,
    BaseUrl: "http://qamanage.megawise.cn/",
    QaUrl: "http://qa.megawise.cn/",
    WeixinUrl: "http://weixin.miic.com.cn/",
    UserID: $.GetCookie("MegawiseID") == undefined ? "" : $.GetCookie("MegawiseID"),
    UserName: $.GetCookie("MegawiseUserName") == undefined ? "" : decodeURI($.GetCookie("MegawiseUserName")),
    LoginUserInfo: null,
};
//浏览事件
window.objPub.BrowseEvent = function BrowseEvent(event) {
    var id=event.data.ID;
    if(id!=""){
        var uri = $.EncodeUri("QuestionID=" + id);
        var url = objPub.QaUrl + "biz/show/show.html?" + uri;
        window.open(url, "_blank");
    }
}
//windwow滚轮事件
window.objPub.ScorllEvent = function ScorllEvent(event) {
    var with_time_axis = event.data.WithTimeAxis;
    if (with_time_axis == true) {
        if ($(this).scrollTop() >= 390) {
            $("#divGoTop").fadeIn(30);
            $(".filter").css({
                "top": "30px",
                "position": "fixed"
            });
        } else {
            $("#divGoTop").fadeOut(30);
            var from_person = event.data.FromPerson;
            if (from_person == false) {
                //moments-list
                $(".filter").css({
                    "top": (390 - $(this).scrollTop()) + "px"
                });
            }
            else {
                //moments-list-person
                $(".filter").css({
                    "top": "296px",
                    "position": "absolute"
                });
            }
        }
    }
}
///消息类别枚举@start///
window.objPub.ApproveType = function () {
    throw Error.notImplemented();
}

window.objPub.ApproveType.prototype = {
    //长篇
    Agree: 1,
    //短篇
    Refused:2,
}

window.objPub.ApproveType.registerEnum("window.objPub.ApproveType");