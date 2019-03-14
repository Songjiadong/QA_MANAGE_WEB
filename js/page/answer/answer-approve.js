AnswerInfo.Approve = function () { }
AnswerInfo.Approve.registerClass("AnswerInfo.Approve");
//初始化
AnswerInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/answer/approve-list.html", function (respones, status) {
        if (status == "success") {
            //时间轴
            timeLineClick();
            //风琴效果
            listAccrodion();
        }
    });
}