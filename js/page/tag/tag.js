TagInfo = function () { }
TagInfo.registerClass("TagInfo");
//初始化
TagInfo.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl+"biz/tag.html", function (respones, status) {
        if (status == "success") {
            $("#aAddTag").off("click").on("click", TagInfo.AddEvent);
            $("#aAllReomoveTag").off("click").on("click", TagInfo.AllRemoveEvent);
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
}
//删除标签事件
TagInfo.DeleteEvent = function DeleteEvent(event) {
}