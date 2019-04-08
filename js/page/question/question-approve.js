QuestionInfo.Approve = function () { }
QuestionInfo.Approve.registerClass("QuestionInfo.Approve");
QuestionInfo.Approve.PageSize = 10;
QuestionInfo.Approve.SubjectSltStr="<option value='11'>智能制造</option><option value='12'>工业4.0</option>"
//问题审批初始化
QuestionInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/approve-list.html", function (respones, status) {
        if (status == "success") {
            //时间轴
            $(".year").off("click").on("click", QuestionInfo.Approve.YearClickEvent);
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected")
            });
            //所属标签
            $(".btn-view").on("click", function () {
                $(".dialog-tags").dialog({
                    resizable: false,
                    width: 450,
                    modal: true,
                    title: "审核",
                    buttons: {
                        "取　消": function () {
                            $(this).dialog("close");
                        },
                        "确　定": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });
            //拒绝
            
            var page = {
                pageStart: 1,
                pageEnd: QuestionInfo.Approve.PageSize * 1
            };
            var keyword = {
                Keyword: $("#txtSearch").val()

            }
            QuestionInfo.Approve.Search(keyword, page);
            QuestionInfo.Approve.GetValidTypeCount();
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
                    temp += "<td class='q-time'><a href='javascript:;' class='btn-view'>5个</a></td>";
                    temp +="<td class='to-ratify'>";
                    temp +="<a id='aQuestionPass" + index + "' href='javascript:void(0);'>通过</a>";
                    temp +="<a id='aQuestionRefuse" + index + "' href='javascript:void(0);' class='refuse'>拒绝</a>";
                    temp +="</td>"
                    temp += "</tr>";
                    $(document).off("click", "#aQuestionPass" + index+",#aQuestionRefuse"+ index);
                    $(document).on("click", "#aQuestionPass" + index, { ID: item.ID,Index:index }, QuestionInfo.Approve.PassEvent);
                    $(document).on("click", "#aQuestionRefuse" + index, { ID: item.ID,Index:index }, QuestionInfo.Approve.CancelEvent);
                });
                $("#tbQuestionApproveList").empty().append(temp);
            }
            else {
                $("#tbQuestionApproveList").empty().append("<tr><td colspan='6'>暂无数据</td></tr>");
            }
        });
}

QuestionInfo.Approve.Search = function Search(keyword, page) {
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
        })).done(function(json){
           if(json.Result == true){
               $.Alert("保存成功",function(){
                   var page = {
                       pageStart: 1,
                       pageEnd: QuestionInfo.Approve.PageSize * 1
                   };
                   var keyword = {
                       Keyword: $("#txtSearch").val()
       
                   }
                   QuestionInfo.Approve.Search(keyword, page);
               })
           }
        })
    });
}

QuestionInfo.Approve.GetValidTypeCount = function get_valid_type_count() {
    $.SimpleAjaxPost("service/question/GetValidTypeCount", true).done(function(json){
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
    $("#divRefuseDialog").data({"Index":event.data.Index,"ID":event.data.ID})
    $("#divRefuseDialog").dialog({
        resizable: false,
        width: 450,
        modal: true,
        title: "审核",
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
}
QuestionInfo.Approve.Cancel = function cancel(){
    var id = $("#divRefuseDialog").data("ID");
    var index = $("#divRefuseDialog").data("Index");
    $.SimpleAjaxPost("service/question/SetApprove", true, 
     JSON.stringify({
        ID:id,
        ApproveStatus:"1",
        SubjectID:"",
        SubjectName:"",
        ApproveRemark:$("#txtApproveReason").val(),
     })).done(function(json){
        if(json.Result == true){
            $.Alert("保存成功",function(){
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Approve.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val()
    
                }
                $("#txtApproveReason").val("");
               QuestionInfo.Approve.Search(keyword, page);
            })
        }
     })
}