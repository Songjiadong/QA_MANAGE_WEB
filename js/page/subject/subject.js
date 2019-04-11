SubjectInfo = function () { }
SubjectInfo.registerClass("SubjectInfo");
SubjectInfo.PageSize = 10;
SubjectInfo.LogoUrl="";
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

            $("#divSubjectInfoEditDialog").dialog({
                appendTo: ".main-wapper",
                autoOpen: false,
                resizable: false,
                width: 520,
                modal: true,
                title: "主题编辑",
                buttons: {
                    "取　消": function () {
                        $(this).dialog("close");
                    },
                    "确　定": function () {
                        SubjectInfo.Submit()
                        $(this).dialog("close");
                    }
                }
            });
            $("#fSubjectLogo").off("change").on("change", SubjectInfo.UploadSubjectLogoEvent);
        }
    });
}
//上传附件
SubjectInfo.UploadSubjectLogoEvent = function UploadSubjectLogoEvent(event){
    var $fm = $("#fmSubjectLogoUpload");
    var $file = $(event.target).val();
    if ($file != "") {
        //附件上传
        $fm.ajaxSubmit({
            url: "http://qamanage.megawise.cn/service/question/subject/UploadLogo",
            type: "post",
            dataType: "json",
            timeout: 600000,
            success: function (data, textStatus) {
                SubjectInfo.LogoUrl = data.Result
                $("#divLogoView").html("<img src='"+objPub.BaseUrl+SubjectInfo.LogoUrl+"' width='50' height='50'/>");
            },
            error: function (data, status, e) {
                console.log("上传失败，错误信息：" + e);
            }
        });
    }
}
//删除所有主题事件
SubjectInfo.AllRemoveEvent = function AllRemoveEvent(event) {

}
SubjectInfo.GC = function gc(){
    $("#txtSubjectCode,#txtSubjectName").val("");
    $("#divLogoView").empty();
}
//新增主题事件
SubjectInfo.AddEvent = function AddEvent(event) {
    SubjectInfo.GC()
    $("#divSubjectInfoEditDialog").dialog("open");
    $("#divSubjectInfoEditDialog").data("ID","");
    //$("#aSubmitSubjectInfo").off("click").on("click",{ID:""},SubjectInfo.SubmitEvent)
}
SubjectInfo.Submit = function submit(){
    var id = ($("#divSubjectInfoEditDialog").data("ID") == "" ? $.NewGuid() : $("#divSubjectInfoEditDialog").data("ID"))
    $.SimpleAjaxPost("service/question/subject/Submit", true, 
     JSON.stringify({
        ID:id,
        Code:$("#txtSubjectCode").val(),
        Name:$("#txtSubjectName").val(),
        Logo:SubjectInfo.LogoUrl
     })).done(function(json){
        if(json.Result == true){
            $.Alert("保存成功",function(){
                var page = {
                    pageStart: 1,
                    pageEnd: SubjectInfo.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSubjectKeyword").val()
    
                }
                SubjectInfo.Search(keyword, page);
            })
        }
     })
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
SubjectInfo.GetDetail = function get_detail(id){
    $.SimpleAjaxPost("service/question/subject/GetInformation", true, JSON.stringify({ID:id}))
        .done(function (json) {
            var result = json.SubjectInfo
            $("#txtSubjectCode").val(result.Code);
            $("#txtSubjectName").val(result.Name);
            $("#divLogoView").html("<img src='"+objPub.BaseUrl+result.Logo+"' width='50' height='50'/>");
        })
}
SubjectInfo.UpdateEvent = function UpdateEvent(event){
    var id = event.data.ID
    $("#divSubjectInfoEditDialog").dialog("open");
    $("#divSubjectInfoEditDialog").data("ID",id);
    SubjectInfo.GetDetail(id);
}
SubjectInfo.SearchBind = function SearchBind(keyword, page) {
    $.SimpleAjaxPost("service/question/subject/Search", true, JSON.stringify({Keyword:keyword,Page:page}))
        .done(function (json) {
            var result = $.Deserialize(json.List);
            var temp = "";
            if (result != null) {
                $.each(result, function (index, item) {
                    temp += "<div class='category-item clear-fix'>";
                    temp += "<div class='category-name'>"+item.NAME+"</div>";
                    temp += "<div class='category-item-opts'>";
                    temp +="<a id='divSubjectItemUpd" + index + "' href='javascript:void(0);'>修改</a>";
                    temp +="<a id='divSubjectItemDel" + index + "' href='javascript:void(0);'>删除</a>";
                    temp +="</div>"
                    temp += "</div>";
                    $(document).off("click", "#divSubjectItemDel" + index+",#divSubjectItemUpd"+ index);
                    $(document).on("click", "#divSubjectItemUpd" + index, { ID: item.ID }, SubjectInfo.UpdateEvent);
                    $(document).on("click", "#divSubjectItemDel" + index, { ID: item.ID }, SubjectInfo.DeleteEvent);
                });
                $("#divSubjectList").empty().append(temp);
            }
            else {
                $("#divSubjectList").empty().append("<tr><td colspan='6'>暂无数据</td></tr>");
                $("#divSubjectListPage").empty();
            }
        });
}

SubjectInfo.Search = function Search(keyword, page) {
    SubjectInfo.SearchBind(keyword, page);
    $.SimpleAjaxPost("service/question/subject/GetSearchCount", true, JSON.stringify({Keyword:keyword}))
        .done(function (json) {
            var result = json.Count;
            $(".tabs-num").html(result)
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
    var id = event.data.ID;
    $.Confirm({ content: "您确定要删除该主题么?", width: "auto" }, function () {
        $.SimpleAjaxPost("service/question/subject/Delete", true, JSON.stringify({ID:id}))
        .done(function (json) {
            if(json.Result == true){
                $.Alert("删除成功",function(){
                    var page = {
                        pageStart: 1,
                        pageEnd: SubjectInfo.PageSize * 1
                    };
                    var keyword = {
                        Keyword: $("#txtSubjectKeyword").val()
        
                    }
                    SubjectInfo.Search(keyword, page);
                })
            }
        })
    });
}