QuestionInfo.Approve = function () { }
QuestionInfo.Approve.registerClass("QuestionInfo.Approve");
//问题审批初始化
QuestionInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/approve-list.html", function (respones, status) {
        if (status == "success") {
            //时间轴
            $(".year").off("click").on("click", QuestionInfo.Approve.YearClickEvent);
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected")
            });
            //所属标签
            $(".btn-view").on("click", function () {
                $(".dialog-tags").dialog({
                    resizable: false,
                    width: 450,
                    modal: true,
                    title: "审核",
                    buttons: {
                        "取　消": function () {
                            $(this).dialog("close");
                        },
                        "确　定": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });
            //拒绝
            $(".refuse").on("click", function () {
                $(".dialog-refuse").dialog({
                    resizable: false,
                    width: 450,
                    modal: true,
                    title: "审核",
                    buttons: {
                        "取　消": function () {
                            $(this).dialog("close");
                        },
                        "确　定": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        }
    });
}
//时间周年点击
QuestionInfo.Approve.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show().find("li:eq(0)").addClass("selected").siblings().removeClass("selected");
    //月份切换
    $(".month>li").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}