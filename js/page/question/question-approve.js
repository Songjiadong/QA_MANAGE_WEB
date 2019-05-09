QuestionInfo.Approve = function () { }
QuestionInfo.Approve.registerClass("QuestionInfo.Approve");
QuestionInfo.Approve.PageSize = 10;
QuestionInfo.Approve.SubjectSltStr="";
QuestionInfo.Approve.TagStr = "";
//问题审批初始化
QuestionInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/approve-list.html", function (respones, status) {
        if (status == "success") {
            $("#divRefuseDialog").dialog({
                resizable: false,
                width: 450,
                modal: true,
                autoOpen: false,
                title: "拒绝操作",
                buttons: {
                    "取　消": function () {
                        $(this).dialog("close");
                    },
                    "确　定": function () {
                        QuestionInfo.Approve.Cancel()
                        $(this).dialog("close");
                    }
                }
            });
            QuestionInfo.Approve.GetAllTagList()
            QuestionInfo.Approve.GetAllSubjectList();
            //时间轴
            $(".year").off("click").on("click", QuestionInfo.Approve.YearClickEvent);
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected")
            });
            $("#divTagDialog").dialog({
                    resizable: false,
                    width: 450,
                    autoOpen: false,
                    modal: true,
                    title: "选择标签",
                    buttons: {
                        "取　消": function () {
                            $(this).dialog("close");
                        },
                        "确　定": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            //拒绝
            
            
            QuestionInfo.Approve.GetApproveStatusCount();
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

QuestionInfo.Approve.SearchBind = function SearchBind(keyword, page) {
    $.SimpleAjaxPost("service/question/ApproveSearch", true, JSON.stringify({Keyword:keyword,Page:page}))
        .done(function (json) {
            var result = $.Deserialize(json.List);
            var temp = "";
            if (result != null) {
                $.each(result, function (index, item) {
                    temp += "<tr><td>";
                    temp += "<div class='question-title'>"+item.Title+"</div>";
                    temp += "<div class='question-describe'>"+item.Content+"</div></td>";
                    temp += "<td>"+item.CreaterName+"</td>";
                    temp += "<td class='q-time'>"+item.CreateTime+"</td>";
                    temp += "<td><select id='sltSubjectID"+index+"'>"+QuestionInfo.Approve.SubjectSltStr+"</select></td>";
                    temp += "<td class='q-time'><a href='javascript:;' class='btn-view' id='aQuestionAddTag" + index + "'>5个</a></td>";
                    temp +="<td class='to-ratify'>";
                    temp +="<a id='aQuestionPass" + index + "' href='javascript:void(0);'>通过</a>";
                    temp +="<a id='aQuestionRefuse" + index + "' href='javascript:void(0);' class='refuse'>拒绝</a>";
                    temp +="</td>"
                    temp += "</tr>";
                    $(document).off("click", "#aQuestionPass" + index+",#aQuestionRefuse"+ index+",aQuestionAddTag"+ index);
                    $(document).on("click", "#aQuestionAddTag" + index,  QuestionInfo.Approve.TagOPEvent);
                    $(document).on("click", "#aQuestionPass" + index, { 
                        ID: item.ID,
                        Index:index,
                        Title:item.Title,
                        CreaterID:item.CreaterID,
                        CreaterName:item.CreaterName
                    }, QuestionInfo.Approve.PassEvent);
                    $(document).on("click", "#aQuestionRefuse" + index, { 
                        ID: item.ID,
                        Index:index, 
                        Title:item.Title,
                        CreaterID:item.CreaterID,
                        CreaterName:item.CreaterName
                        }, QuestionInfo.Approve.CancelEvent);
                    
                });
                $("#tbQuestionApproveList").empty().append(temp);
            }
            else {
                $("#tbQuestionApproveList").empty().append("<tr><td colspan='6' style='text-align:center;'>暂无待处理的数据</td></tr>");
            }
        });
}
QuestionInfo.Approve.TagOPEvent = function TagOPEvent(event){
    $("#divTagDialog").dialog("open");
}
QuestionInfo.Approve.Search = function search(keyword, page) {
    QuestionInfo.Approve.SearchBind(keyword, page);
    $.SimpleAjaxPost("service/question/GetApproveSearchCount", true, JSON.stringify({Keyword:keyword}))
        .done(function (json) {
            var result = json.Count;
            //$(".tabs-num").html(result)
            if (result != 0 && result != null) {
                $("#tbQuestionApproveListPage").wPaginate("destroy").wPaginate({
                    theme: "grey",
                    page: '5,10,20',
                    total: result,
                    index: parseInt(page.pageStart) - 1,
                    limit: QuestionInfo.Approve.PageSize,
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
                $("#tbQuestionApproveListPage").wPaginate("destroy");
            }
        });
}
QuestionInfo.Approve.PassEvent = function PassEvent(event) {
    var id = event.data.ID;
    var index = event.data.Index;
    $.Confirm({ content: "您确定要通过该问题吗?", width: "auto" }, function () {
        $.SimpleAjaxPost("service/question/SetApprove", true, 
        JSON.stringify({
           ID:id,
           ApproveStatus:"0",
           SubjectID:$("#sltSubjectID"+index).val(),
           SubjectName:$("#sltSubjectID"+index+" option:selected").text(),
           ApproveRemark:"同意",
           Title:event.data.Title,
        CreaterID:event.data.CreaterID,
        CreaterName:event.data.CreaterName,
        })).done(function(json){
           if(json.Result == true){
               $.Alert("保存成功",function(){
                   var page = {
                       pageStart: 1,
                       pageEnd: QuestionInfo.Approve.PageSize * 1
                   };
                   var keyword = {
                       Keyword: $("#txtSearch").val(),
                       YearMonth:"2019-04"
                   }
                   QuestionInfo.Approve.Search(keyword, page);
               })
           }
        })
    });
}

QuestionInfo.Approve.GetApproveStatusCount = function get_approve_status_count() {
    $.SimpleAjaxPost("service/question/GetApproveStatusCount", true,JSON.stringify({Year:'2019'})).done(function(json){
        var result = $.Deserialize(json.List);
        if (result != null) {
            $.each(result, function (index, item) {
                $("#divWaitCount").html(item.WaitCount);
                $("#divDealCount").html(item.DealCount);
                $("#divPassCount").html(item.PassCount);
                $("#divRefuseCount").html(item.RefuseCount);
            });
        }
     })
}

QuestionInfo.Approve.CancelEvent = function CancelEvent(event){
    $("#divRefuseDialog").data({
        "Index":event.data.Index,
        "ID":event.data.ID,
        "Title":event.data.Title,
        "CreaterID":event.data.CreaterID,
        "CreaterName":event.data.CreaterName
    })
    $("#divRefuseDialog").dialog("open")
}
QuestionInfo.Approve.Cancel = function cancel(){
    var id = $("#divRefuseDialog").data("ID");
    var index = $("#divRefuseDialog").data("Index");
    var title = $("#divRefuseDialog").data("Title");
    var creater_id = $("#divRefuseDialog").data("CreaterID");
    var creater_name = $("#divRefuseDialog").data("CreaterName");
    $.SimpleAjaxPost("service/question/SetApprove", true, 
     JSON.stringify({
        ID:id,
        ApproveStatus:"1",
        SubjectID:"",
        SubjectName:"",
        ApproveRemark:$("#txtApproveReason").val(),
        Title:title,
        CreaterID:creater_id,
        CreaterName:creater_name,
     })).done(function(json){
        if(json.Result == true){
            $.Alert("保存成功",function(){
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Approve.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val(),
                    YearMonth:"2019-04",
                }
                $("#txtApproveReason").val("");
               QuestionInfo.Approve.Search(keyword, page);
            })
        }
     })
}
QuestionInfo.Approve.GetAllSubjectList = function get_all_subject_list() {
    var temp = "";
    $.SimpleAjaxPost("service/question/subject/GetAllSubjectList" , true).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp += "<option value='"+item.ID+"'>"+item.Name+"</option>"
        });
        QuestionInfo.Approve.SubjectSltStr = temp;
        var page = {
            pageStart: 1,
            pageEnd: QuestionInfo.Approve.PageSize * 1
        };
        var keyword = {
            Keyword: $("#txtSearch").val(),
            YearMonth:"2019-04"

        }
        QuestionInfo.Approve.Search(keyword, page);
     })
    
}
QuestionInfo.Approve.GetAllTagList = function get_all_tag_list() {
    var temp = "";
    $.SimpleAjaxPost("service/user/tag/GetAllTagList" , true).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp +="<li id='liAllTagItem"+index+"'><span>"+item.Name+"</span>";
			temp +="<div class='tags-del' id='divTagItemAdd"+index+"' title='添加'>";	
			temp +="<img src='images/add.png'/></div>";
            temp +="</li>";
            $("#ulAllTagList").off("click", "#divTagItemAdd" + index);
            $("#ulAllTagList").on("click", "#divTagItemAdd" + index,{ ID: item.ID,Name:item.Name,Index:index}, QuestionInfo.Approve.AddTagEvent);
        });
        QuestionInfo.Approve.TagStr = temp;
        $("#ulAllTagList").empty().append(temp);
     })   
}
QuestionInfo.Approve.AddTagEvent = function AddTagEvent(event){
    var id = event.data.ID;
    var name = event.data.Name;
    var index = event.data.Index;
    var temp = "<li id='liAddNewTagItem"+index+"'><span>"+name+"</span>";
    temp +="<div class='tags-del' id='del"+id+"' title='删除'>";
    temp +="<img src='images/trash.png'>";
    temp +="</div></li>";
    $("#liAllTagItem"+index).remove();
    $("#ulAddNewTagList").append(temp);
    $("#ulAddNewTagList").off("click", "#del" + id);
    $("#ulAddNewTagList").on("click", "#del" + id,{ ID: id,Name:name,Index:index}, QuestionInfo.Approve.DelTagEvent);
}
QuestionInfo.Approve.DelTagEvent = function DelTagEvent(event){
    var id = event.data.ID;
    var name = event.data.Name;
    var index = event.data.Index;
    var temp ="<li id='liAllTagItem"+index+"'><span>"+name+"</span>";
    temp +="<div class='tags-del' id='divTagItemAdd"+index+"' title='添加'>";	
    temp +="<img src='images/add.png'/></div>";
    temp +="</li>";
    $("#liAddNewTagItem"+index).remove();
    $("#ulAllTagList li:eq("+index+")").before(temp);
    $("#ulAllTagList").off("click", "#divTagItemAdd" + id);
    $("#ulAllTagList").on("click", "#divTagItemAdd" + id,{ ID: id,Name:name,Index:index}, QuestionInfo.Approve.AddTagEvent);
}