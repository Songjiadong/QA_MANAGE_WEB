QuestionInfo.Approve = function () { }
QuestionInfo.Approve.registerClass("QuestionInfo.Approve");
//是否能页面加载
QuestionInfo.Approve.CanPageLoad = false;
//记录总数
QuestionInfo.Approve.TotalCount = 0;
//当前索引
QuestionInfo.Approve.CurrentIndex = 0;
QuestionInfo.Approve.OldDocumentHeight = 0;

QuestionInfo.Approve.PageSize = 10;
QuestionInfo.Approve.TagStr = "";
QuestionInfo.Approve.TempYear="";
QuestionInfo.Approve.TempMonth="";

//问题审批初始化
QuestionInfo.Approve.Init = function init() {
    QuestionInfo.Approve.TempYear=Home.Year;
    QuestionInfo.Approve.TempMonth=Home.Month; 
    $("#sctMain").load(objPub.BaseUrl + "biz/question/approve-list.html", function (respones, status) {
        if (status == "success") {
            QuestionInfo.Approve.YearInit();
            QuestionInfo.Approve.GC();
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
            $(document).off("scroll").on("scroll",  QuestionInfo.Approve.ScrollEvent);
            QuestionInfo.Approve.GetAllTagList()
            QuestionInfo.Approve.GetAllSubjectList();
            //时间轴
           
            $(".content-tabs .content-tabs-item").off("click").on("click",QuestionInfo.Approve.ApproveTypeSearchEvent);
            $("#txtSearch").off("keypress").on("keypress",QuestionInfo.Approve.KeyPressEvent)
            $("#imgSearch").off("click").on("click",QuestionInfo.Approve.SearchClickEvent) 
            QuestionInfo.Approve.GetApproveStatusCount(Home.Year+"-"+Home.Month);
        }
    });
}
QuestionInfo.Approve.GC = function gc(){
    QuestionInfo.Approve.CanPageLoad = false;
    QuestionInfo.Approve.TotalCount = 0;
    QuestionInfo.Approve.CurrentIndex = 0;  
    QuestionInfo.Approve.OldDocumentHeight = 0;
     
}
QuestionInfo.Approve.SearchClickEvent = function SearchClickEvent(event){
    QuestionInfo.Approve.CurrentIndex = 0; 
    var page = {
        pageStart: 1,
        pageEnd: QuestionInfo.Approve.PageSize * 1
    };
    var keyword = {
        Keyword: $("#txtSearch").val(),
        YearMonth:QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth,
        ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
    }
    QuestionInfo.Approve.Search(keyword, page,0);
    QuestionInfo.Approve.GetApproveStatusCount(QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth);
}
QuestionInfo.Approve.KeyPressEvent = function KeyPressEvent(event){
    if (event.keyCode == 13) { 
        //QuestionInfo.Approve.GC();
        QuestionInfo.Approve.CurrentIndex = 0;  
        var page = {
            pageStart: 1,
            pageEnd: QuestionInfo.Approve.PageSize * 1
        };
        var keyword = {
            Keyword: $("#txtSearch").val(),
            YearMonth:QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth,
            ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")

        }
        QuestionInfo.Approve.Search(keyword, page);
        QuestionInfo.Approve.GetApproveStatusCount(QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth);
    }
}
QuestionInfo.Approve.YearInit = function year_init(){
    var temp_current_year = parseInt(Home.Year);
    var temp_current_month = parseInt(new Date().getMonth() + 1)
    var str = "<li class='swift-edit'><i class='fa fa-edit'></i></li>";
    str +="<li><a href='javascript:void(0);' class='year'>全部</a></li>"
    str+="<li class='selected'>";
    str+="<a href='javascript:void(0);' class='year' id='aYear"+temp_current_year+"'>"+(temp_current_year)+"</a>";
    $("#ulYearMenu").off("click","#aYear"+temp_current_year).on("click","#aYear"+temp_current_year, QuestionInfo.Approve.YearClickEvent);
    str+="<ul class='month' style='display:block;' value='"+(temp_current_year)+"'>";
    for(var j=1;j<(temp_current_month+1);j++){
        if (j == temp_current_month){
            str+="<li value='"+j+"' id='liMonth"+temp_current_year+"-"+j+"' class='selected'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }else{
            str+="<li value='"+j+"' id='liMonth"+temp_current_year+"-"+j+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }
        $("#ulYearMenu").off("click","#liMonth"+temp_current_year+"-"+j).on("click","#liMonth"+temp_current_year+"-"+j,QuestionInfo.Approve.SearchEvent);
    }
    str+="</ul>";
    for(var i=1;i<3;i++){
    str+="<li >";
    str+="<a href='javascript:void(0);' id='aYear"+(temp_current_year-i)+"' class='year'>"+(temp_current_year-i)+"</a>";
    $("#ulYearMenu").off("click","#aYear"+(temp_current_year-i)).on("click","#aYear"+(temp_current_year-i), QuestionInfo.Approve.YearClickEvent);
    str+="<ul class='month' value='"+(temp_current_year-i)+"'>";
        for(var k=1;k<13;k++){
            str+="<li value='"+k+"' id='liMonth"+(temp_current_year-i)+"-"+k+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+k+"月</a></li>";
            $("#ulYearMenu").off("click","#liMonth"+(temp_current_year-i)+"-"+k).on("click","#liMonth"+(temp_current_year-i)+"-"+k,QuestionInfo.Approve.SearchEvent);
        }
    str+="</ul>";
    str+="</li>";
    }
    $("#ulYearMenu").empty().append(str);
}
QuestionInfo.Approve.ApproveTypeSearchEvent = function ApproveTypeSearchEvent(event){
    $(".content-tabs-item").removeClass("selected");
    $(this).addClass("selected");
    var page = {
        pageStart: 1,
        pageEnd: QuestionInfo.Approve.PageSize * 1
    };
    var keyword = {
        Keyword: $("#txtSearch").val(),
        YearMonth:QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth,
        ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
    }
    QuestionInfo.Approve.Search(keyword, page);
}
QuestionInfo.Approve.SearchEvent = function SearchEvent(event){
    $(this).addClass("selected").siblings().removeClass("selected");
        var year = $(this).parent().attr("value");
        var date = $(this).attr("value");
        if(date>9){
        }else{
            date = "0"+date
        }
        QuestionInfo.Approve.TempYear=year;
        QuestionInfo.Approve.TempMonth=date;
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
        QuestionInfo.Approve.GetApproveStatusCount(year+"-"+date);
}
//时间周年点击
QuestionInfo.Approve.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show();
    
}
QuestionInfo.Approve.SearchBind = function SearchBind(keyword, page) {
    $.SimpleAjaxPost("service/question/ApproveSearch", true, JSON.stringify({Keyword:keyword,Page:page}))
        .done(function (json) {
            var result = $.Deserialize(json.List);
            var temp = "";
            if (result != null) {
                $.each(result, function (index, item) {
                    var Index =parseInt(QuestionInfo.Approve.CurrentIndex *AnswerInfo.Approve.PageSize) + index;
                    temp += "<tr><td>";
                    temp += "<div class='question-title'>"+item.Title+"</div>";
                    temp += "<div class='question-describe'>"+item.Content+"</div></td>";
                    temp += "<td>"+item.CreaterName+"</td>";
                    temp += "<td class='q-time'>"+objPub.DealTime(item.CreateTime)+"</td>";
                    temp +="<td class='to-ratify'>";
                    if(item.ApproveStatus == objPub.ApproveType.Wait.toString()){
                        temp +="<a id='aQuestionPass" + Index + "' href='javascript:void(0);'>通过</a>";
                        temp +="<a id='aQuestionRefuse" + Index + "' href='javascript:void(0);' class='refuse'>拒绝</a>";
                        $("#tbQuestionApproveList").off("click", "#aQuestionPass" + Index+",#aQuestionRefuse"+ Index+",aQuestionAddTag"+ Index);
                        $("#tbQuestionApproveList").on("click", "#aQuestionPass" + Index, { 
                            ID: item.ID,
                            Index:Index,
                            Title:item.Title,
                            CreaterID:item.CreaterID,
                            CreaterName:item.CreaterName
                        }, QuestionInfo.Approve.PassEvent);
                        $(document).on("click", "#aQuestionRefuse" + Index, { 
                            ID: item.ID,
                            Index:Index, 
                            Title:item.Title,
                            CreaterID:item.CreaterID,
                            CreaterName:item.CreaterName
                            }, QuestionInfo.Approve.CancelEvent);
                    }else{
                        temp +="<a id='aQuestionRevoke" + Index + "' href='javascript:void(0);' class='refuse'>撤销</a>";
                        $("#tbQuestionApproveList").off("click","#aQuestionRevoke"+ Index).
                        on("click","#aQuestionRevoke"+ Index,{ID:item.ID},QuestionInfo.Approve.SetApproveRevokeEvent)
                    }
                    
                    temp +="</td>"
                    temp += "</tr>";
                });
                if(page.pageStart == 1){
                    $("#tbQuestionApproveList").empty().append(temp);
                }else{
                    $("#tbQuestionApproveList").append(temp);
                }
                
            }
            else {
                if(page.pageStart == 1){
                    $("#tbQuestionApproveList").empty().append("<tr><td colspan='4' style='text-align:center;'>暂无待处理的数据</td></tr>");
                }                
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
                $("#divWaitApproveNum").html(result);
                QuestionInfo.Approve.TotalCount = result;
                if (result > QuestionInfo.Approve.PageSize) {
                    QuestionInfo.Approve.CanPageLoad = true;
                    
                }
            }
            
        });
}
//滚轮事件
QuestionInfo.Approve.ScrollEvent = function ScrollEvent(event) {
    if (($(document).scrollTop() >= $(document).height() - $(window).height()) && QuestionInfo.Approve.OldDocumentHeight != $(document).height()) {
        
        if (QuestionInfo.Approve.CanPageLoad == true) {
            QuestionInfo.Approve.CurrentIndex = QuestionInfo.Approve.CurrentIndex + 1;
            
            var page = {
                pageStart: QuestionInfo.Approve.CurrentIndex * QuestionInfo.Approve.PageSize + 1,
                pageEnd: (QuestionInfo.Approve.CurrentIndex + 1) * QuestionInfo.Approve.PageSize
            };
            var keyword = {
                Keyword: $("#txtSearch").val(),
                YearMonth:QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth,
                ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
            }
            QuestionInfo.Approve.SearchBind(keyword, page);
            if (page.pageEnd >= QuestionInfo.Approve.TotalCount) {
                QuestionInfo.Approve.CanPageLoad = false;
            }
            QuestionInfo.Approve.OldDocumentHeight = $(document).height();
        } else {
            if (QuestionInfo.Approve.TotalCount == 0) {
                $(document).off("scroll");
            } else if (parseInt(QuestionInfo.Approve.TotalCount / QuestionInfo.Approve.PageSize) > objPub.MinTipPage) {
                $.Alert("这已经是最后一页了哦~");
                $(document).off("scroll");
                setTimeout(function () {
                    $(".dialog-normal").dialog('close');
                }, 2000);
            }
            QuestionInfo.Approve.OldDocumentHeight = 0;
        }
    }
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
           ApproveStatus:objPub.ApproveType.Agree.toString(),
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
                QuestionInfo.Approve.GetApproveStatusCount(QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth);
                   var page = {
                       pageStart: 1,
                       pageEnd: QuestionInfo.Approve.PageSize * 1
                   };
                   var keyword = {
                       Keyword: $("#txtSearch").val(),
                       YearMonth:QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth,
                       ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
                   }
                   QuestionInfo.Approve.Search(keyword, page);
               })
           }
        })
    });
}
QuestionInfo.Approve.GetApproveStatusCount = function get_approve_status_count(year_month) {
    $.SimpleAjaxPost("service/question/GetApproveStatusCount", true,JSON.stringify({YearMonth:year_month})).done(function(json){
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
QuestionInfo.Approve.SetApproveRevokeEvent = function SetApproveRevokeEvent(event){
    $.Confirm({ content: "您确定要撤销对该问题的操作吗?", width: "auto" }, function () {
        $.SimpleAjaxPost("service/question/QuestionRevoke", true, JSON.stringify({ID:event.data.ID})).done(function(json){
            if(json.Result == true){
                $.Alert("操作成功",function(){
                    QuestionInfo.Approve.GetApproveStatusCount(QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth);
                    var page = {
                        pageStart: 1,
                        pageEnd: QuestionInfo.Approve.PageSize * 1
                    };
                    var keyword = {
                        Keyword: $("#txtSearch").val(),
                        YearMonth:QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth,
                        ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
                    }
                    $("#txtApproveReason").val("");
                   QuestionInfo.Approve.Search(keyword, page);
                })
            }
        });
    });
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
        ApproveStatus:objPub.ApproveType.Refused.toString(),
        SubjectID:"",
        SubjectName:"",
        ApproveRemark:$("#txtApproveReason").val(),
        Title:title,
        CreaterID:creater_id,
        CreaterName:creater_name,
     })).done(function(json){
        if(json.Result == true){
            $.Alert("操作成功",function(){
                QuestionInfo.Approve.GetApproveStatusCount(QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth);
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Approve.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val(),
                    YearMonth:QuestionInfo.Approve.TempYear+"-"+QuestionInfo.Approve.TempMonth,
                    ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
                }
                $("#txtApproveReason").val("");
               QuestionInfo.Approve.Search(keyword, page);
            })
        }
     })
}
QuestionInfo.Approve.GetAllSubjectList = function get_all_subject_list() {
     $("#sltSubject").html(Home.SubjectSltStr).selectmenu({ appendTo: "#divSelectSubject", width: 100 });
     var page = {
         pageStart: 1,
         pageEnd: QuestionInfo.Approve.PageSize * 1
     };
     var keyword = {
         Keyword: $("#txtSearch").val(),
         YearMonth:Home.Year+"-"+Home.Month,
         ApproveStatus:$("#divApproveStatusTab").find(".selected").attr("value")
     }
     QuestionInfo.Approve.Search(keyword, page);
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