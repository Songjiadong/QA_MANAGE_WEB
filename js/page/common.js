﻿$.SetBaseUrl("http://qamanage.megawise.cn/");
//避免缓存文件
$.ajaxSetup({
    cache: false
});
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
///是否类别枚举@start///
window.objPub.YesNoType = function () {
    throw Error.notImplemented();
}

window.objPub.YesNoType.prototype = {
    //长篇
    Yes: 1,
    //短篇
    No:2,
}

window.objPub.YesNoType.registerEnum("window.objPub.YesNoType");
///阅读类别枚举@start///
window.objPub.ReadType = function () {
    throw Error.notImplemented();
}

window.objPub.ReadType.prototype = {
    //已读
    Read: 0,
    //未读
    UnRead:1,
}

window.objPub.ReadType.registerEnum("window.objPub.ReadType");
window.objPub.ReadType.GetColor = function get_color(read_type) {
    var result = "";
    if (isNaN(read_type) == true) {
        throw Error.argumentType("read_type", null, window.objPub.ReadType, "参数类型不符");
    }
    else {
        switch (read_type) {
            case window.objPub.ReadType.Read:
                result = "#7932ea";
                break;
            case window.objPub.ReadType.UnRead:
                result = "#fa9d1a";
                break;

            default:
                break;
        }
    }
    return result;
}
window.objPub.ReadType.GetDescription = function get_description(read_type) {
    var result = "";
    if (isNaN(read_type) == true) {
        throw Error.argumentType("read_type", null, window.objPub.ReadType, "参数类型不符");
    }
    else {
        switch (read_type) {
            case window.objPub.ReadType.Read:
                result = "已读";
                break;
            case window.objPub.ReadType.UnRead:
                result = "未读";
                break;
            default:
                break;
        }
    }
    return result;
};





window.objPub.ValidType = function () {
    throw Error.notImplemented();
}

window.objPub.ValidType.prototype = {
    //有效
    Valid: 2,
    //失效
    UnValid:1,
}

window.objPub.ValidType.registerEnum("window.objPub.ValidType");
window.objPub.ValidType.GetColor = function get_color(valid_type) {
    var result = "";
    if (isNaN(valid_type) == true) {
        throw Error.argumentType("valid_type", null, window.objPub.ValidType, "参数类型不符");
    }
    else {
        switch (valid_type) {
            case window.objPub.ValidType.Valid:
                result = "#7932ea";
                break;
            case window.objPub.ValidType.UnValid:
                result = "#fa9d1a";
                break;

            default:
                break;
        }
    }
    return result;
}
window.objPub.ValidType.GetDescription = function get_description(valid_type) {
    var result = "";
    if (isNaN(valid_type) == true) {
        throw Error.argumentType("valid_type", null, window.objPub.ValidType, "参数类型不符");
    }
    else {
        switch (valid_type) {
            case window.objPub.ValidType.Valid:
                result = "已读";
                break;
            case window.objPub.ValidType.UnValid:
                result = "未读";
                break;
            default:
                break;
        }
    }
    return result;
};
///消息类别枚举@start///
window.objPub.PublishInfoType = function () {
    throw Error.notImplemented();
}

window.objPub.PublishInfoType.prototype = {
    //长篇
    Long: 1,
    //短篇
    Short:0
}

window.objPub.PublishInfoType.registerEnum("window.objPub.PublishInfoType");
window.objPub.PublishInfoType.GetColor = function get_color(publish_type) {
    var result = "";
    if (isNaN(publish_type) == true) {
        throw Error.argumentType("PublishInfoType", null, window.objPub.PublishInfoType, "参数类型不符");
    }
    else {
        switch (publish_type) {
            case window.objPub.PublishInfoType.Long:
                result = "#7932ea";
                break;
            case window.objPub.PublishInfoType.Short:
                result = "#fa9d1a";
                break;

            default:
                break;
        }
    }
    return result;
}
window.objPub.PublishInfoType.GetDescription = function get_description(publish_type) {
    var result = "";
    if (isNaN(publish_type) == true) {
        throw Error.argumentType("publish_type", null, window.objPub.PublishInfoType, "参数类型不符");
    }
    else {
        switch (publish_type) {
            case window.objPub.ValidType.Valid:
                result = "有效";
                break;
            case window.objPub.ValidType.UnValid:
                result = "失效";
                break;
            default:
                break;
        }
    }
    return result;
};