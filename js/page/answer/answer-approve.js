AnswerInfo.Approve = function () { }
AnswerInfo.Approve.registerClass("AnswerInfo.Approve");
//初始化
AnswerInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/answer.html", function (respones, status) {
        if (status == "success") {
            //时间轴
            timeLineClick();
            //切换选项卡
            tabsClick();
            //风琴效果
            listAccrodion();
        }
    });
}