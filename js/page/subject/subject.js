SubjectInfo = function () { }
SubjectInfo.registerClass("SubjectInfo");
SubjectInfo.PageSize = 10;
//初始化
SubjectInfo.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/subject.html", function (respones, status) {
        if (status == "success") {
            $("#aAddSubject").off("click").on("click", SubjectInfo.AddEvent);
            $("#aAllRemoveSubject").off("click").on("click", SubjectInfo.AllRemoveEvent);
            var page = {
                pageStart: 1,
                pageEnd: SubjectInfo.PageSize * 1
            };
            var keyword = {
                Keyword: $("#txtSubjectKeyword").val()

            }
            SubjectInfo.Search(keyword, page);
            $("#imgSubjectSearch").off("click").on("click", { Page: page }, SubjectInfo.SearchEvent);
            $("#txtSubjectKeyword").off("keypress").on("keypress", { Page: page }, SubjectInfo.SearchKeyPressEvent);
        }
    });
}
//删除所有主题事件
SubjectInfo.AllRemoveEvent = function AllRemoveEvent(event) {
}
//新增主题事件
SubjectInfo.AddEvent = function AddEvent(event) {
    var itemStr = "";
    itemStr += '<div class="category-item clear-fix">';
    itemStr += '<div class="category-name">';
    itemStr += '<input type="text" class="">';
    itemStr += '</div>';
    itemStr += '<div class="category-item-opts">';
    itemStr += '<a href="javascript:;">取消</a>';
    itemStr += '<a href="javascript:;">保存</a>';
    itemStr += '</div>';
    itemStr += '</div>';
    $(".category-list").prepend(itemStr);
}
//搜索回车事件
SubjectInfo.SearchKeyPressEvent = function SearchKeyPressEvent(event) {
    if (event.keyCode == 13) {
        var page = event.data.Page;
        var keyword = {
            Keyword: $("#txtSubjectKeyword").val()
        }
        SubjectInfo.Search(keyword, page);
    }
}
//搜索点击事件
SubjectInfo.SearchEvent = function SearchEvent(event) {
    var page = event.data.Page;
    var keyword = {
        Keyword: $("#txtSubjectKeyword").val()
    }
    SubjectInfo.Search(keyword, page);
}
SubjectInfo.SearchBind = function SearchBind(keyword, page) {
    $.SimpleAjaxPost("", true, "{keyword:" + $.Serialize(keyword) + ",page:" + $.Serialize(page) + "}")
        .done(function (json) {
            var result = $.Deserialize(json.d);
            var temp = "";
            if (result != null) {
                $.each(result, function (index, item) {
                    temp += "<div class='category-item clear-fix'>";
                    temp += "<div class='category-name'>工业4.0</div>";
                    temp += "<div id='divSubjectItem" + index + "' class='category-item-opts'><a href='javascript:void(0);'>删除</a></div>";
                    temp += "</div>";
                    $(document).off("click", "#divSubjectItem" + index);
                    $(document).on("click", "#divSubjectItem" + index, { Item: item }, SubjectInfo.DeleteEvent);
                });
                $("#ulSubjectList").empty().append(temp);
            }
            else {
                $("#ulSubjectList").empty().append("<tr><td colspan='6'>暂无数据</td></tr>");
                $("#divSubjectListPage").empty();
            }
        });
}

SubjectInfo.Search = function Search(keyword, page) {
    SubjectInfo.SearchBind(keyword, page);
    $.SimpleAjaxPost("", true, "{keyword:" + $.Serialize(keyword) + "}")
        .done(function (json) {
            var result = json.d;
            if (result != 0 && result != null) {
                $("#divSubjectListPage").wPaginate("destroy").wPaginate({
                    theme: "grey",
                    page: '5,10,20',
                    total: result,
                    index: parseInt(page.pageStart) - 1,
                    limit: SubjectInfo.PageSize,
                    ajax: true,
                    pid: "divSubjectListPage",
                    url: function (i) {
                        var page = {
                            pageStart: i * this.settings.limit + 1,
                            pageEnd: (i + 1) * this.settings.limit
                        };
                        SubjectInfo.SearchBind(keyword, page);
                    }
                });
            }
            else {
                $("#divSubjectListPage").wPaginate("destroy");
            }
        });
}
//删除所有主题事件
SubjectInfo.AllRemoveEvent = function AllRemoveEvent(event) {
    $.Confirm({ content: "您确定要删除所有主题么?", width: "auto" }, function () {

    });
}
//删除主题事件
SubjectInfo.DeleteEvent = function DeleteEvent(event) {
    var subject = event.data.Item;
    $.Confirm({ content: "您确定要删除**主题么?", width: "auto" }, function () {

    });
}