﻿SubjectInfo = function () { }
SubjectInfo.registerClass("SubjectInfo");
//初始化
SubjectInfo.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/subject.html", function (respones, status) {
        if (status == "success") {
            $("#aAddCategroy").on("click", function () {
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
            });
        }
    });
}