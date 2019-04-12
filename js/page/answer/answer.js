AnswerInfo = function () { }
AnswerInfo.registerClass("AnswerInfo");
//初始化
AnswerInfo.Init = function init() {

}

//热赞回答列表


//审批状态
AnswerInfo.ApproveStatus = function () {
    throw Error.notImplemented();
}

AnswerInfo.ApproveStatus.prototype = {
    SimpleApproveAgree: 0,//同意
    SimpleApproveRefuse: 1,//拒绝
    SimpleApproveWaiting: 2,//等待
    SimpleApproveInit: 3,//初始化
    SimpleApproveAll: 9,//全部
};
AnswerInfo.ApproveStatus.registerEnum("AnswerInfo.ApproveStatus");
AnswerInfo.ApproveStatus.GetDescription = function get_description(type) {
    var result = "";
    if (isNaN(type) == true) {
        throw Error.argumentType("type", null, AnswerInfo.Application, "参数类型不符");
    }
    else {
        switch (type) {
            case AnswerInfo.ApproveStatus.SimpleApproveAgree:
                result = "同意";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveRefuse:
                result = "拒绝";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveWaiting:
                result = "等待";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveInit:
                result = "初始化";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveAll:
                result = "全部"; 
                break;
            default:
                break;
        }
    }
    return result;
};
AnswerInfo.ApproveStatus.GetColor = function get_color(type) {
    var result = "";
    if (isNaN(type) == true) {
        throw Error.argumentType("type", null, AnswerInfo.ApproveStatus, "参数类型不符");
    }
    else {
        switch (type) {
            case AnswerInfo.ApproveStatus.SimpleApproveAgree:
                result = "#BA57ED";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveRefuse:
                result = "#62B264";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveWaiting:
                result = "#623434";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveInit:
                result = "#634784";
                break;
            case AnswerInfo.ApproveStatus.SimpleApproveAll:
                result = "#627914";
                break;
            default:
                break;
        }
    }
    return result;
}
///消息类别枚举@start///
AnswerInfo.PublishInfoType = function () {
    throw Error.notImplemented();
}

AnswerInfo.PublishInfoType.prototype = {
    //长篇
    Long: 1,
    //短篇
    Short:0
}

AnswerInfo.PublishInfoType.registerEnum("AnswerInfo.PublishInfoType");