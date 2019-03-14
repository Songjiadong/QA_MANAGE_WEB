QuestionInfo.Approve = function () { }
QuestionInfo.Approve.registerClass("QuestionInfo.Approve");
//问题审批初始化
QuestionInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/approve-list.html", function (respones, status) {
        if (status == "success") {
            //时间轴
            timeLineClick();
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