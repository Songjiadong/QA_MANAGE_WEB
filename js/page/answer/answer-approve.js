AnswerInfo.Approve = function () { }
AnswerInfo.Approve.registerClass("AnswerInfo.Approve");
//初始化
AnswerInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/answer/approve-list.html", function (respones, status) {
        if (status == "success") {
            //时间轴
            $(".year").off("click").on("click", AnswerInfo.Approve.YearClickEvent);
            //风琴效果
            listAccrodion();
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected")
            });
        }
    });
}
//时间周年点击
AnswerInfo.Approve.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show().find("li:eq(0)").addClass("selected").siblings().removeClass("selected");
    //月份切换
    $(".month>li").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}


//风琴效果
function listAccrodion() {
    var presentQA = 0;
    $(".answer-question").on("click", function () {
        if ($(this).parent().index() === presentQA) {
            $(this).siblings(".answer-list").toggle("blind", 300);
        } else {
            $(".answer-list").slideUp();
            $(this).siblings(".answer-list").slideDown();
        }
        presentQA = $(this).parent().index();
    });
}