TagInfo = function () { }
TagInfo.registerClass("TagInfo");
TagInfo.PageSize = 10;
//初始化
TagInfo.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl+"biz/tag.html", function (respones, status) {
        if (status == "success") {
            $("#aAddTag").off("click").on("click", TagInfo.AddEvent);
            $("#aAllReomoveTag").off("click").on("click", TagInfo.AllRemoveEvent);
            var page = {
                pageStart: 1,
                pageEnd: TagInfo.PageSize * 1
            };
            var keyword = {
                Keyword: $("#txtTagKeyword").val()

            }
            TagInfo.Search(keyword, page);
            $("#imgTagSearch").off("click").on("click", { Page: page }, TagInfo.SearchEvent);
            $("#txtTagKeyword").off("keypress").on("keypress", { Page: page }, TagInfo.SearchKeyPressEvent);
        }
    });
}
//搜索回车事件
TagInfo.SearchKeyPressEvent = function SearchKeyPressEvent(event) {
    if (event.keyCode == 13) {
        var page = event.data.Page;
        var keyword = {
            Keyword: $("#txtTagKeyword").val()
        }
        TagInfo.Search(keyword, page);
    }
}
//搜索点击事件
TagInfo.SearchEvent = function SearchEvent(event) {
    var page = event.data.Page;
    var keyword = {
        Keyword: $("#txtTagKeyword").val()
    }
    TagInfo.Search(keyword, page);
}
TagInfo.SearchBind = function SearchBind(keyword, page) {
    $.SimpleAjaxPost("", true, "{keyword:" + $.Serialize(keyword) + ",page:" + $.Serialize(page) + "}")
        .done(function (json) {
            var result = $.Deserialize(json.d);
            var temp = "";
            if (result != null) {
                $.each(result, function (index, item) {
                    temp+="<li>";
                    temp+="<span>标签1</span>";
                    temp+="<div id='divDeleteTag"+index+"' class='tags-del' title='删除标签'><img src='images/trash.png'></div>";
                    temp += "</li>";
                    $(document).off("click", "#divDeleteTag" + index);
                    $(document).on("click", "#divDeleteTag" + index, {Item:item},TagInfo.DeleteEvent);
                })
                $("#ulTagList").empty().append(temp);
            }
            else {
                $("#ulTagList").empty().append("<tr><td colspan='6'>暂无数据</td></tr>");
                $("#ulTagListPage").empty();
            }
        });
}

TagInfo.Search = function Search(keyword, page) {
    TagInfo.SearchBind(keyword, page);
    $.SimpleAjaxPost("", true, "{keyword:" + $.Serialize(keyword) + "}")
        .done(function (json) {
            var result = json.d;
            if (result != 0 && result != null) {
                $("#ulTagListPage").wPaginate("destroy").wPaginate({
                    theme: "grey",
                    page: '5,10,20',
                    total: result,
                    index: parseInt(page.pageStart) - 1,
                    limit: TagInfo.PageSize,
                    ajax: true,
                    pid: "ulTagListPage",
                    url: function (i) {
                        var page = {
                            pageStart: i * this.settings.limit + 1,
                            pageEnd: (i + 1) * this.settings.limit
                        };
                        TagInfo.SearchBind(keyword, page);
                    }
                });
            }
            else {
                $("#ulTagListPage").wPaginate("destroy");
            }
        });
}

//新增标签
TagInfo.AddEvent = function AddEvent(event) {
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
//删除所有标签事件
TagInfo.AllRemoveEvent = function AllRemoveEvent(event) {
    $.Confirm({ content: "您确定要删除所有标签么?", width: "auto" }, function () {

    });
}
//删除标签事件
TagInfo.DeleteEvent = function DeleteEvent(event) {
    var tag = event.data.Item;
    $.Confirm({ content: "您确定要删除**标签么?", width: "auto" }, function () {

    });
}