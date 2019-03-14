QuestionInfo.Recommend = function () { }
QuestionInfo.Recommend.registerClass("QuestionInfo.Recommend");
//问题推荐初始化
QuestionInfo.Recommend.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/recommend-list.html", function (respones, status) {
        if (status == "success") {
                //时间轴
                timeLineClick();
                //风琴效果
                listAccrodion();
                //点击推荐
                $(".to-recommend>a").on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    $(".dialog-recommend-cover").dialog({
                        resizable: false,
                        width: 450,
                        modal: true,
                        title: "添加推荐封面",
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