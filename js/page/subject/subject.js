SubjectInfo = function () { }
SubjectInfo.registerClass("SubjectInfo");
//初始化
SubjectInfo.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/subject.html", function (respones, status) {
        if (status == "success") {
            $("#aAddSubject").off("click").on("click", SubjectInfo.AddEvent);
            $("#aAllRemoveSubject").off("click").on("click", SubjectInfo.AllRemoveEvent);
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