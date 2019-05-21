QuestionInfo.Approve = function () { }
QuestionInfo.Approve.registerClass("QuestionInfo.Approve");
QuestionInfo.Approve.PageSize = 10;
QuestionInfo.Approve.SubjectSltStr="";
QuestionInfo.Approve.TagStr = "";
//问题审批初始化
QuestionInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/approve-list.html", function (respones, status) {
        if (status == "success") {
            QuestionInfo.Approve.YearInit()
            $("#divRefuseDialog").dialog({
                resizable: false,
                width: 450,
                modal: true,
                autoOpen: false,
                title: "拒绝操作",
                buttons: {
                    "取　消": function () {
                        $("#txtApproveReason").val("");
                        $(this).dialog("close");
                    },
                    "确　定": function () {
                        QuestionInfo.Approve.Cancel()
                        $(this).dialog("close");
                    }
                }
            });
            $("#divQuestionPassDialog").dialog({
                resizable: false,
                width: 450,
                modal: true,
                autoOpen: false,
                title: "通过操作",
                buttons: {
                    "取　消": function () {
                        QuestionInfo.Approve.GC()
                        $(this).dialog("close");
                    },
                    "确　定": function () {
                        QuestionInfo.Approve.Pass()
                        $(this).dialog("close");
                    }
                }
            });
            QuestionInfo.Approve.GetAllTagList()
            QuestionInfo.Approve.GetAllSubjectList();
            //时间轴
           
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected");
                var year = $("#ulYearMenu").find(".selected").children("a").html();
                var month = $("#ulYearMenu").find(".selected").children("ul").find(".selected").attr("value");
                if(month>9){
                }else{
                    month = "0"+month
                }
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Approve.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val(),
                    YearMonth:year+"-"+month,
                    ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
                }
               QuestionInfo.Approve.Search(keyword, page);
               QuestionInfo.Approve.GetApproveStatusCount(year);
            });
            $("#txtSearch").off("keypress").on("keypress",function(){
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Approve.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val(),
                    YearMonth:"2019-04",
                    ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
        
                }
                QuestionInfo.Approve.Search(keyword, page);
                QuestionInfo.Approve.GetApproveStatusCount(year);
            })
            $("#imgSearch").off("click").on("click",function(){
                var year = $("#ulYearMenu").find(".selected").children("a").html();
                alert(year)
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Approve.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val(),
                    YearMonth:"2019-04",
                    ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
                }
                QuestionInfo.Approve.Search(keyword, page);
                QuestionInfo.Approve.GetApproveStatusCount(year);
            }) 
            QuestionInfo.Approve.GetApproveStatusCount(Home.Year);
        }
    });
}
QuestionInfo.Approve.YearInit = function year_init(){
    var temp_current_year = parseInt(Home.Year);
    var temp_current_month = parseInt(new Date().getMonth() + 1)
    var str = "<li class='swift-edit'><i class='fa fa-edit'></i></li>";
    str +="<li><a href='javascript:void(0);' class='year'>全部</a></li>"
    str+="<li class='selected'>";
    str+="<a href='javascript:void(0);' class='year'>"+(temp_current_year)+"</a>";
    str+="<ul class='month' value='"+(temp_current_year)+"'>";
    for(var j=1;j<(temp_current_month+1);j++){
        str+="<li value='"+j+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
    }
    str+="</ul>";
    for(var i=1;i<3;i++){
    str+="<li >";
    str+="<a href='javascript:void(0);' class='year'>"+(temp_current_year-i)+"</a>";
    str+="<ul class='month' value='"+(temp_current_year-i)+"'>";
        for(var k=1;k<13;k++){
            str+="<li value='"+k+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+k+"月</a></li>";
        }
    str+="</ul>";
    str+="</li>";
    }
    $("#ulYearMenu").empty().append(str);
    $(".year").off("click").on("click", QuestionInfo.Approve.YearClickEvent);
    $(".month>li").off("click").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var year = $(this).parent().attr("value");
        var date = $(this).attr("value");
        if(date>9){
        }else{
            date = "0"+date
        }
        var page = {
            pageStart: 1,
            pageEnd: QuestionInfo.Approve.PageSize * 1
        };
        var keyword = {
            Keyword: $("#txtSearch").val(),
            YearMonth:year+"-"+date,
            ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
        }
        QuestionInfo.Approve.Search(keyword, page);
        QuestionInfo.Approve.GetApproveStatusCount(year);
    });
}
//时间周年点击
QuestionInfo.Approve.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show().find("li:eq(0)").addClass("selected").siblings().removeClass("selected");
    
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
                    temp += "<td class='q-time'>"+new Date(item.CreateTime).format("yyyy-MM-dd")+"</td>";
                    temp +="<td class='to-ratify'>";
                    temp +="<a id='aQuestionPass" + index + "' href='javascript:void(0);'>通过</a>";
                    temp +="<a id='aQuestionRefuse" + index + "' href='javascript:void(0);' class='refuse'>拒绝</a>";
                    temp +="</td>"
                    temp += "</tr>";
                    $(document).off("click", "#aQuestionPass" + index+",#aQuestionRefuse"+ index+",aQuestionAddTag"+ index);
                    
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
                $("#tbQuestionApproveList").empty().append("<tr><td colspan='4' style='text-align:center;'>暂无待处理的数据</td></tr>");
            }
        });
}
QuestionInfo.Approve.Search = function search(keyword, page) {
    QuestionInfo.Approve.SearchBind(keyword, page);
    $.SimpleAjaxPost("service/question/GetApproveSearchCount", true, JSON.stringify({Keyword:keyword}))
        .done(function (json) {
            var result = json.Count;
            //$(".tabs-num").html(result)
            if (result != 0 && result != null) {
                $("#divQuestionApproveListPage").wPaginate("destroy").wPaginate({
                    theme: "grey",
                    page: '5,10,20',
                    total: result,
                    index: parseInt(page.pageStart) - 1,
                    limit: QuestionInfo.Approve.PageSize,
                    ajax: true,
                    pid: "divQuestionApproveListPage",
                    url: function (i) {
                        var page = {
                            pageStart: i * this.settings.limit + 1,
                            pageEnd: (i + 1) * this.settings.limit
                        };
                        QuestionInfo.Approve.SearchBind(keyword, page);
                    }
                });
            }
            else {
                $("#divQuestionApproveListPage").wPaginate("destroy");
            }
        });
}
QuestionInfo.Approve.GC = function gc(){
    QuestionInfo.Approve.GetAllTagList()
}
QuestionInfo.Approve.PassEvent = function PassEvent(event) {
    $("#divQuestionPassDialog").data({
        "Index":event.data.Index,
        "ID":event.data.ID,
        "Title":event.data.Title,
        "CreaterID":event.data.CreaterID,
        "CreaterName":event.data.CreaterName
    })
    $("#divPassQuestionTitle").html(event.data.Title)
    $("#divQuestionPassDialog").dialog("open")
}
QuestionInfo.Approve.Pass = function pass(){
    $.Confirm({ content: "您确定要通过该问题吗?", width: "auto" }, function () {
        var id = $("#divQuestionPassDialog").data("ID");
        var index = $("#divQuestionPassDialog").data("Index");
        var title = $("#divQuestionPassDialog").data("Title");
    var creater_id = $("#divQuestionPassDialog").data("CreaterID");
    var creater_name = $("#divQuestionPassDialog").data("CreaterName");
    var tag_items = $("#ulAddNewTagList li");
    var relation = [];
    $.each(tag_items, function (index, item) {
        var relation_item = {
            ID :$.NewGuid(),      
            QuestionID :id,
            QuestionName :title,
            TagID  : $(item).attr("value"),
            TagName : $(item).children("span").html(),
            ApproveStatus : objPub.ApproveType.Agree.toString(),   
            ApproveRemark : "同意",  
            CreaterID  :creater_id,      
            CreaterName :creater_name
        }
        relation.push(relation_item)
    })
        $.SimpleAjaxPost("service/question/SetApprove", true, 
        JSON.stringify({
           ID:id,
           ApproveStatus:"0",
           SubjectID:$("#sltSubject").val(),
           SubjectName:$("#sltSubject option:selected").text(),
           ApproveRemark:"同意",
           QuestionTagRelation:relation,
           Title:title,
           CreaterID:creater_id,
           CreaterName:creater_name,
        })).done(function(json){
           if(json.Result == true){
               $.Alert("保存成功",function(){
                QuestionInfo.Approve.GetApproveStatusCount();
                   var page = {
                       pageStart: 1,
                       pageEnd: QuestionInfo.Approve.PageSize * 1
                   };
                   var keyword = {
                       Keyword: $("#txtSearch").val(),
                       YearMonth:"2019-04",
                       ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
                   }
                   QuestionInfo.Approve.Search(keyword, page);
               })
           }
        })
    });
}
QuestionInfo.Approve.GetApproveStatusCount = function get_approve_status_count(year) {
    $.SimpleAjaxPost("service/question/GetApproveStatusCount", true,JSON.stringify({Year:year})).done(function(json){
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
                QuestionInfo.Approve.GetApproveStatusCount();
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Approve.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val(),
                    YearMonth:"2019-04",
                    ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
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
        $("#sltSubject").html(temp);
        QuestionInfo.Approve.SubjectSltStr = temp;
        var page = {
            pageStart: 1,
            pageEnd: QuestionInfo.Approve.PageSize * 1
        };
        var keyword = {
            Keyword: $("#txtSearch").val(),
            YearMonth:"2019-04",
            ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
        }
        QuestionInfo.Approve.Search(keyword, page);
     })
    
}
QuestionInfo.Approve.GetAllTagList = function get_all_tag_list() {
    $("#ulAddNewTagList").empty();
    var temp = "";
    $.SimpleAjaxPost("service/user/tag/GetAllTagList" , true).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp +="<li id='liAllTagItem"+index+"' ><span>"+item.Name+"</span>";
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
    var temp = "<li id='liAddNewTagItem"+index+"' value='"+id+"'><span>"+name+"</span>";
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
    var temp ="<li id='liAllTagItem"+index+"' ><span>"+name+"</span>";
    temp +="<div class='tags-del' id='divTagItemAdd"+index+"' title='添加'>";	
    temp +="<img src='images/add.png'/></div>";
    temp +="</li>";
    $("#liAddNewTagItem"+index).remove();
    $("#ulAllTagList").append(temp);
    $("#ulAllTagList").off("click", "#divTagItemAdd" + id);
    $("#ulAllTagList").on("click", "#divTagItemAdd" + id,{ ID: id,Name:name,Index:index}, QuestionInfo.Approve.AddTagEvent);
}