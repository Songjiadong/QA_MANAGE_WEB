TagInfo = function () { }
TagInfo.registerClass("TagInfo");
TagInfo.PageSize = 10;
TagInfo.LogoUrl="";
//初始化
TagInfo.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl+"biz/tag.html", function (respones, status) {
        if (status == "success") {
            $("#aAddTag").off("click").on("click",TagInfo.AddEvent);
            $("#aAllReomoveTag").off("click").on("click", TagInfo.AllRemoveEvent);
            var page = {
                PageStart: 1,
                PageEnd: TagInfo.PageSize * 1
            };  
            var keyword = {
                Keyword: $("#txtTagKeyword").val() 
            }
            TagInfo.Search(keyword, page);
            $("#imgTagSearch").off("click").on("click", { Page: page }, TagInfo.SearchEvent);
            $("#txtTagKeyword").off("keypress").on("keypress", { Page: page }, TagInfo.SearchKeyPressEvent);
            $("#divTagInfoEditDialog").dialog({
                appendTo: ".main-wapper",
                autoOpen: false,
                resizable: false,
                width: 520,
                modal: true,
                title: "新增标签",
                buttons: {
                    "取　消": function () {
                        $(this).dialog("close");
                    },
                    "确　定": function () {
                        TagInfo.Submit()
                        $(this).dialog("close");
                    }
                }
            });
            $("#fmTagLogoUpload").off("change").on("change", TagInfo.UploadTagLogoEvent);
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
    $.SimpleAjaxPost("service/user/tag/ManageSearch", true, JSON.stringify({ Keyword: keyword, Page: page }))
        .done(function (json) {
            var result = JSON.parse(json.List);
            var temp = "";
            
            if (Array.isArray(result)==true) { 
                $.each(result, function (index, item) {
                    temp+="<li>";
                    temp+="<span>"+item.NAME+"</span>";
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
    $.SimpleAjaxPost("service/user/tag/GetManageSearchCount", true, JSON.stringify({ Keyword: keyword, Page: page }))
        .done(function (json) {
            var result = json.Count;
            $("#spnTagCount").html(result);
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
//上传附件
TagInfo.UploadTagLogoEvent = function UploadTagLogoEvent(event){
    var $fm = $("#fmTagLogoUpload");
    var $file = $(event.target).val();
    if ($file != "") {
        //附件上传
        $fm.ajaxSubmit({
            url: "http://qamanage.megawise.cn/service/user/tag/UploadLogo",
            type: "post",
            dataType: "json",
            timeout: 600000,
            success: function (data, textStatus) {
                TagInfo.LogoUrl = data.Result 
              
            },
            error: function (data, status, e) {
                console.log("上传失败，错误信息：" + e);
            }
        });
    }
}
//新增标签
TagInfo.AddEvent = function AddEvent(event) {
    $("#divTagInfoEditDialog").dialog("open");
    $("#divTagInfoEditDialog").data("ID","");

}
//删除所有标签事件
TagInfo.AllRemoveEvent = function AllRemoveEvent(event) {
    $.Confirm({ content: "您确定要删除所有标签么?", width: "auto" }, function () {
        $.SimpleAjaxPost("service/user/tag/AllRemove", true)
            .done(function (json) {
                if (json.Result == true) {
                    $.Alert("删除成功", function () {
                        var page = {
                            pageStart: 1,
                            pageEnd: TagInfo.PageSize * 1
                        };
                        var keyword = {
                            Keyword: $("#txtTagKeyword").val()
            
                        }
                        TagInfo.Search(keyword, page);
                    });
                }
             
        });
    });
}
//删除标签事件
TagInfo.DeleteEvent = function DeleteEvent(event) {
    var tagInfos = event.data.Item;
    var tagName = tagInfos.NAME;
    $.Confirm({ content: "您确定要删除"+tagName+"标签么?", width: "auto" }, function () {
        var id = tagInfos.ID;
        $.SimpleAjaxPost("service/user/tag/Delete", true, JSON.stringify({ ID: id}))
            .done(function (json) {
                if (json.Result == true) {
                    $.Alert("删除成功", function () {
                        var page = {
                            pageStart: 1,
                            pageEnd: TagInfo.PageSize * 1
                        };
                        var keyword = {
                            Keyword: $("#txtTagKeyword").val()
            
                        }
                        TagInfo.Search(keyword, page);
                    });
                }
             
        });
    });
} 

//提交标签信息
TagInfo.Submit = function submit() {
    var id = ($("#divTagInfoEditDialog").data("ID") == "" ? $.NewGuid() : $("#divTagInfoEditDialog").data("ID"))
    $.SimpleAjaxPost("service/user/tag/Submit", true, JSON.stringify({
        ID: id,
        Code:$("#txtTagCode").val(),
        Name:$("#txtTagName").val(),
        Logo: TagInfo.LogoUrl,
        CreaterID:objPub.UserID,
        CreaterName:objPub.UserName
    })).done(function (json) {
        if(json.Result == true){
            $.Alert("保存成功", function () {
                $("#txtTagCode").val("");
                $("#txtTagName").val(""); 
                TagInfo.LogoUrl = "";
                var page = {
                    pageStart: 1,
                    pageEnd: TagInfo.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtTagKeyword").val()
    
                }
                TagInfo.Search(keyword, page);
            })
        }
        });
}