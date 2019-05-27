AnswerInfo.Approve = function () { }
AnswerInfo.Approve.registerClass("AnswerInfo.Approve");
AnswerInfo.Approve.PageSize = 2;

//是否能页面加载
AnswerInfo.Approve.CanPageLoad = false;
//记录总数
AnswerInfo.Approve.TotalCount = 0;
//当前索引
AnswerInfo.Approve.CurrentIndex = 0;
AnswerInfo.Approve.OldDocumentHeight = 0;
AnswerInfo.Approve.TempYear=Home.Year;
AnswerInfo.Approve.TempMonth=Home.Month;
//分页垃圾处理
AnswerInfo.Approve.GC = function GC() {
    AnswerInfo.Approve.TotalCount = 0;
    AnswerInfo.Approve.CurrentIndex = 0;
    AnswerInfo.Approve.CanPageLoad = false;
    AnswerInfo.Approve.OldDocumentHeight = 0;
}
//初始化
AnswerInfo.Approve.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/answer/approve-list.html", function (respones, status) {
        if (status == "success") { 
            $(".content-tabs .content-tabs-item").off("click").on("click", AnswerInfo.Approve.ApproveTypeSearchEvent);
            //风琴效果
            listAccrodion();
            //回答审核筛选框初始化
            AnswerInfo.Approve.InitApproveData(Home.Year+"-"+Home.Month); 
            // //设置时间轴显示
            AnswerInfo.Approve.YearInit();
            //回答审核默认搜索
            var page = {
                PageStart: 1,
                PageEnd: AnswerInfo.Approve.PageSize * 1
            }; 
            keyword = {
                Keyword: $("#txtSearch").val(),
                ApproveStatus:AnswerInfo.ApproveStatus.SimpleApproveWaiting+"",
                Year:AnswerInfo.Approve.TempYear,
                Month: AnswerInfo.Approve.TempMonth  
            }
            AnswerInfo.Approve.Search(keyword, page);
            //滚轮事件
            $(window).off("scroll").on("scroll", { WithTimeAxis: true ,FromPerson:false},objPub.ScorllEvent);
            //测试设置审批
            $(".refuse").off("click").on("click", {ID:"1",Status:AnswerInfo.ApproveStatus.SimpleApproveRefuse+""},AnswerInfo.Approve.SetApproveEvent)
            //审核筛选框框点击事件
            $(".content-tabs-item").off("click").on("click",{Page:page}, AnswerInfo.Approve.SearchClickEvent);
            //搜索点击事件
            $("#imgSearch").off("click").on("click", {Page:page},AnswerInfo.Approve.SearchEvent);
            //搜索回车事件
            $("#txtSearch").off("keypress").on("keypress", { Page: page }, AnswerInfo.Approve.SearchKeyPressEvent);
            
        }
    });
} 
//风琴效果
function listAccrodion() {
    var presentQA = 0;
    $(document).off("click", ".answer-question");
    $(document).on("click", ".answer-question", function () {
        if ($(this).parent().index() === presentQA) {
            $(this).siblings(".answer-list").toggle("blind", 300);
        } else {
            $(".answer-list").slideUp();
            $(this).siblings(".answer-list").slideDown();
        }
        presentQA = $(this).parent().index();
    });
} 
//初始化回答审核数据
AnswerInfo.Approve.InitApproveData = function init_approve_data(year_month) { 
    $.SimpleAjaxPost("service/answer/GetAnswerApproveStatistics", true , JSON.stringify({YearMonth:year_month}),function (json) {
        var result = json; 
        if (result!=null) {
            var approveStatistics = JSON.parse(result.List); 
            var alreadyApproveCount = 0;
            if (Array.isArray(approveStatistics) == true) { 
                $.each(approveStatistics,function(index,item){
                    if (item.status == "等待") {
                        $("#divWaitApproveNum").html(item.searchCount);
                    } else if (item.status == "同意") { 
                        $("#divAgreeApproveNum").html(item.searchCount);
                        alreadyApproveCount += parseInt (item.searchCount);
                    } else if (item.status == "拒绝") {
                        $("#divRejectApprovrNum").html(item.searchCount);
                        alreadyApproveCount += parseInt (item.searchCount);
                    } 
                })
                $("#divAlreadyApproveNum").html(alreadyApproveCount);
            }
        }
        
    })
}
//搜索放大镜点击事件
AnswerInfo.Approve.SearchEvent = function SearchEvent(event) {
    var page = event.data.Page;
    var approveStatusVal =$("div.content-tabs-item.selected").attr("data"); 
    var keyword = {
        Keyword: $("#txtSearch").val(),
        ApproveStatus:approveStatusVal,
        Year:AnswerInfo.Approve.TempYear,
        Month: AnswerInfo.Approve.TempMonth 
    }
    AnswerInfo.Approve.Search(keyword, page);
    AnswerInfo.Approve.InitApproveData(AnswerInfo.Approve.TempYear+"-"+AnswerInfo.Approve.TempMonth); 
}
//搜索框回车事件
AnswerInfo.Approve.SearchKeyPressEvent = function SearchKeyPressEvent(event) {
    if (event.keyCode === 13) {
        var page = event.data.Page;
        var approveStatusVal = $("div.content-tabs-item.selected").attr("data");
        var keyword = {
            Keyword: $("#txtSearch").val(),
            ApproveStatus: approveStatusVal,
            Year: AnswerInfo.Approve.TempYear,
            Month: AnswerInfo.Approve.TempMonth
        }
        AnswerInfo.Approve.Search(keyword, page);
    }
}  
AnswerInfo.Approve.YearInit = function year_init(){
    var temp_current_year = parseInt(Home.Year);
    var temp_current_month = parseInt(new Date().getMonth() + 1)
    var str = "<li class='swift-edit'><i class='fa fa-edit'></i></li>";
    str +="<li><a href='javascript:void(0);' class='year'>全部</a></li>"
    str+="<li class='selected'>";
    str+="<a href='javascript:void(0);' class='year' id='aYear"+temp_current_year+"'>"+(temp_current_year)+"</a>";
    $("#ulYearMenu").off("click","#aYear"+temp_current_year).on("click","#aYear"+temp_current_year, AnswerInfo.Approve.YearClickEvent);
    str+="<ul class='month' value='"+(temp_current_year)+"'>";
    for(var j=1;j<(temp_current_month+1);j++){
        if (j == temp_current_month){
            str+="<li value='"+j+"' id='liMonth"+temp_current_year+"-"+j+"' class='selected'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }else{
            str+="<li value='"+j+"' id='liMonth"+temp_current_year+"-"+j+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }
        $("#ulYearMenu").off("click","#liMonth"+temp_current_year+"-"+j).on("click","#liMonth"+temp_current_year+"-"+j,AnswerInfo.Approve.SearchEvent);
    }
    str+="</ul>";
    for(var i=1;i<3;i++){
    str+="<li >";
    str+="<a href='javascript:void(0);' id='aYear"+(temp_current_year-i)+"' class='year'>"+(temp_current_year-i)+"</a>";
    $("#ulYearMenu").off("click","#aYear"+(temp_current_year-i)).on("click","#aYear"+(temp_current_year-i), AnswerInfo.Approve.YearClickEvent);
    str+="<ul class='month' value='"+(temp_current_year-i)+"'>";
        for(var k=1;k<13;k++){
            str+="<li value='"+k+"' id='liMonth"+(temp_current_year-i)+"-"+k+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+k+"月</a></li>";
            $("#ulYearMenu").off("click","#liMonth"+(temp_current_year-i)+"-"+k).on("click","#liMonth"+(temp_current_year-i)+"-"+k,AnswerInfo.Approve.SearchEvent);
        }
    str+="</ul>";
    str+="</li>";
    }
    $("#ulYearMenu").empty().append(str);
}
AnswerInfo.Approve.SearchEvent = function SearchEvent(event){
    $(this).addClass("selected").siblings().removeClass("selected");
        var year = $(this).parent().attr("value");
        var date = $(this).attr("value");
        AnswerInfo.Approve.TempYear=year;
        AnswerInfo.Approve.TempMonth=date;
        var page = {
            PageStart: 1,
            PageEnd: AnswerInfo.Approve.PageSize * 1
        }; 
        keyword = {
            Keyword: $("#txtSearch").val(),
            ApproveStatus:AnswerInfo.ApproveStatus.SimpleApproveWaiting+"",
            Year:year,
            Month: date  
        }
        AnswerInfo.Approve.Search(keyword, page);
        AnswerInfo.Approve.InitApproveData(year+"-"+date);
}
//时间周年点击
AnswerInfo.Approve.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show();
}
//审批框点击事件
AnswerInfo.Approve.SearchClickEvent = function SearchClickEvent(event) { 
    $(".content-tabs-item").removeClass("selected");
    $(this).addClass("selected");
    var page = event.data.Page;
    var approveStatusVal =$("div.content-tabs-item.selected").attr("data"); 
    var keyword = {
        Keyword: $("#txtSearch").val(),
        ApproveStatus:approveStatusVal,
        Year:AnswerInfo.Approve.TempYear,
        Month: AnswerInfo.Approve.TempMonth 
    }
    AnswerInfo.Approve.Search(keyword, page);
    AnswerInfo.Approve.InitApproveData(AnswerInfo.Approve.TempYear+"-"+AnswerInfo.Approve.TempMonth); 
}
AnswerInfo.Approve.ApproveTypeSearchEvent = function RecommendTypeSearchEvent(event){
    $(".content-tabs-item").removeClass("selected");
    $(this).addClass("selected");
    var page = {
        pageStart: 1,
        pageEnd: AnswerInfo.Approve.PageSize * 1
    };
    var keyword = {
        Keyword: $("#txtSearch").val(),
        SubjectID:$("#sltSubjectID").val(),
        Year:AnswerInfo.Approve.TempYear,
        Month:AnswerInfo.Approve.TempMonth,
        IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
    }
    AnswerInfo.Approve.Search(keyword, page);
}
//初始搜索 和 分页
AnswerInfo.Approve.Search = function search(keyword, page) {
    $("html,body").animate({
        scrollTop: 0
    });
    AnswerInfo.Approve.SearchBind(keyword, page,0);
    $.SimpleAjaxPost("service/answer/GetApproveSearchCount", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) {
        var result = json.Count;
        $("#divWaitApproveNum").html(result);
        AnswerInfo.Approve.TotalCount = result;
        if (result > AnswerInfo.Approve.PageSize) {
            AnswerInfo.Approve.CanPageLoad = true;
            $(document).off("scroll").on("scroll", { DateView: keyword }, AnswerInfo.Approve.ScrollEvent);
        }
        });
} 
//搜索结果绑定
AnswerInfo.Approve.SearchBind = function search_bind(keyword, page,current_index) {
    $.SimpleAjaxPost("service/answer/ApproveSearch", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) { 
        var result =JSON.parse( json.List); 
            var temp = "";
        if (result != null) {
            $.each(result, function (index, item) { 
                var Index =parseInt(current_index *AnswerInfo.Approve.PageSize) + index;
                temp += "<div class='answer-qa'>";
                temp += "<div class='answer-question'>";
                temp += "<div class='question-title' id='divQuestionTitle'>" + item.QuestionTitle + "</div>";
                temp += "<div class='answer-num'>";
                temp += "<div class='answer-tag' id='divAnswerTag'>回答："+item.AnswerList.length+"</div>";
                temp += "</div>";
                temp += "</div>";
                //回答列表
                temp += "<div class='answer-list'>";
                $.each(item.AnswerList, function (answerIndex, answerItem) {  
                    temp += "<div class='answer-item'>";
                    temp += "<div class='answer-item-user clear-fix'>";
                    temp += "<div class='answer-item-user-info'>";
                    temp += "<div class='answer-item-user-pic'>";
                    temp += "<img src='" + answerItem.UserUrl + "'>";
                    temp += "</div>";
                    temp += "<div class='answer-item-user-name'>";
                    temp += "<div>"+answerItem.NickName+"</div>";
                    temp += "<div> "+answerItem.Remark+"</div>";
                    temp += "</div>";
                    temp += "</div>";
                    temp += "<div class='answer-item-user-date'>" + answerItem.PublishTime + "</div>";
                    temp += "</div>";
                    //判断是短篇还是长篇：短篇直接显示，长篇需要处理
                    if (answerItem.PublishType == AnswerInfo.PublishInfoType.Long.toString()) {
                        //长篇
                        var regexstr = /<img[^>]*>/;   //图片的正则
                        var arr = regexstr.exec(answerItem.AnswerContent);
                        var content = AnswerInfo.Approve.DealContent(AnswerInfo.PublishInfoType.Long.toString(),answerItem.AnswerContent ,false);
                        if (arr != null) {
                            //有图片
                            var imgSrc = $($(arr[0])).attr("src"); 
                            temp += "<div class='aq-item-content clear-fix'>";
                            temp += "<div class='aq-item-content-img'>";
                            temp += "<img src='" + imgSrc + "'>";
                            temp += "</div>"; 
                            // temp += "<div class='aq-item-content-text'>" + answerItem.AnswerContent + "</div>"; 
                            temp += "<div class='aq-item-content-text' id='divAnswerContent"+Index+answerIndex+"'>" + content + "</div>";
                            temp += "</div>";
                        } else {
                            temp += "<div class='aq-item-content'>"+content+"</div>";
                        }
                        temp += "<div class='aq-item-options clear-fix'>";
                        temp += "<div class='ad-item-all'>";
                        temp += "<a href='javascript:;'id='aReadDetail" + Index + answerIndex + "'>阅读全文</a>";
                        temp += "<a style='display: none' href='javascript:;'id='ahideDetail" + Index + answerIndex + "'>收起全文</a>";
                        temp += "</div>";  
                        
                        $(document).off("click", "#aReadDetail" + Index + answerIndex).on("click", "#aReadDetail" + Index + answerIndex, { Content: answerItem.AnswerContent }, function (event) {
                            $("#divAnswerContent" + Index + answerIndex).html(event.data.Content); 
                            $("#aReadDetail" + Index + answerIndex).hide();
                            $("#ahideDetail" + Index + answerIndex).show();
                        });
                        $(document).off("click", "#ahideDetail" + Index + answerIndex).on("click", "#ahideDetail" + Index + answerIndex, { Content: content }, function (event) {
                            $("#divAnswerContent" + Index + answerIndex).html(event.data.Content); 
                            $("#ahideDetail" + Index + answerIndex).hide();
                            $("#aReadDetail" + Index + answerIndex).show();
                        });
                    } else {
                        //短篇
                        temp += "<div class='aq-item-content'>" + answerItem.AnswerContent + "</div>";
                        temp += "<div class='aq-item-options clear-fix'>"; 
                    } 
                    temp += "<div class='to-ratify'>";
                    temp += "<a href='javascript:;' id='aAgreeApprove"+Index+answerIndex+"'>通过</a>";
                    temp += "<a href='javascript:;' class='refuse' id='aRefuseApprove"+Index+answerIndex+"'>拒绝</a>";
                    temp += "</div>";
                    temp += "</div>";
                    temp += "</div>"; 
                    
                    $(document).off("click", "#aAgreeApprove" + Index+answerIndex).on("click", "#aAgreeApprove" + Index+answerIndex, { 
                        ID: answerItem.AnswerID,
                        QuestionID:item.QuestionID,
                        Title:item.QuestionTitle,
                        Status: AnswerInfo.ApproveStatus.SimpleApproveAgree,
                        CreaterID:answerItem.CreaterID,
                        CreaterName:answerItem.CreaterName
                    }, AnswerInfo.Approve.SetApproveEvent);
                    $(document).off("click", "#aRefuseApprove" + Index+answerIndex).on("click", "#aRefuseApprove" + Index+answerIndex, {
                         ID: answerItem.AnswerID,
                         QuestionID:item.QuestionID,
                         Title:item.QuestionTitle,
                         Status:AnswerInfo.ApproveStatus.SimpleApproveRefuse,
                         CreaterID:answerItem.CreaterID,
                         CreaterName:answerItem.CreaterName
                        }, AnswerInfo.Approve.SetApproveEvent);
                })
            })
            if (current_index == 0) {
                $("#divAnswerList").empty().append(temp);
            } else {
                $("#divAnswerList").append(temp);
            } 
        } else {
            $("#divAnswerList").empty().append("<div style='text-align:center;'>暂无待处理的数据</div>");
        }
    })
}
//阅读全文 
AnswerInfo.Approve.GoDetailEvent = function GoDetailEvent(event) { 
    var id = event.data.ID;
}
//设置审批事件
AnswerInfo.Approve.SetApproveEvent = function SetApproveEvent(event) { 
    var id = event.data.ID;
    var approve_status = event.data.Status.toString();
    var reason = "";
    if (event.data.Status == AnswerInfo.ApproveStatus.SimpleApproveAgree){
        reason = "通过"
    }else{
        reason = "拒绝"
    }
    $.SimpleAjaxPost("service/answer/SetApprove", true,
     JSON.stringify({
	    ID:id,
	    ApproveStatus:approve_status,
        Reason:reason,
        Title:event.data.Title,
        CreaterID:event.data.CreaterID,
        CreaterName:event.data.CreaterName,
    })).done(function (json) { 
        var result = json;  
        if (result != null) {
            if (result.Result==true) {
                $.Alert("审批成功！", function () {
                    var page = {
                        PageStart: 1,
                        PageEnd: AnswerInfo.Approve.PageSize * 1
                    }; 
                    keyword = {
                        Keyword: $("#txtSearch").val(),
                        ApproveStatus:AnswerInfo.ApproveStatus.SimpleApproveWaiting+"",
                        Year:AnswerInfo.Approve.TempYear,
                        Month: AnswerInfo.Approve.TempMonth  
                    }
                    AnswerInfo.Approve.Search(keyword,page);
                    AnswerInfo.Approve.InitApproveData(AnswerInfo.Approve.TempYear+"-"+AnswerInfo.Approve.TempMonth)
                });
            } else {
                $.Alert("审批失败~失败原因:"+message);
            }
        }
    })
}

//滚轮事件
AnswerInfo.Approve.ScrollEvent = function ScrollEvent(event) {
    var date_view = event.data.DateView;
    if (($(document).scrollTop() >= $(document).height() - $(window).height()) && AnswerInfo.Approve.OldDocumentHeight != $(document).height()) {
        if (AnswerInfo.Approve.CanPageLoad == true) {
            AnswerInfo.Approve.CurrentIndex = AnswerInfo.Approve.CurrentIndex + 1;
            var page = {
                pageStart: AnswerInfo.Approve.CurrentIndex * AnswerInfo.Approve.PageSize + 1,
                pageEnd: (AnswerInfo.Approve.CurrentIndex + 1) * AnswerInfo.Approve.PageSize
            };
            AnswerInfo.Approve.SearchBind(date_view, page, AnswerInfo.Approve.CurrentIndex);
            if (page.pageEnd >= AnswerInfo.Approve.TotalCount) {
                AnswerInfo.Approve.CanPageLoad = false;
            }
            AnswerInfo.Approve.OldDocumentHeight = $(document).height();
        } else {
            if (AnswerInfo.Approve.TotalCount == 0) {
                $(document).off("scroll");
            } else if (parseInt(AnswerInfo.Approve.TotalCount / AnswerInfo.Approve.PageSize) > objPub.MinTipPage) {
                $.Alert("这已经是最后一页了哦~");
                $(document).off("scroll");
                setTimeout(function () {
                    $(".dialog-normal").dialog('close');
                }, 2000);
            }
            AnswerInfo.Approve.OldDocumentHeight = 0;
        }
    }
}
//处理answer的富文本
AnswerInfo.Approve.DealContent = function deal_content(publishInfoType,detailContent,isDraft) {
    var result = detailContent;
            if (publishInfoType == AnswerInfo.PublishInfoType.Short.toString())
            {
                return result;
            }
            else
            {
                //var regexstr = /<[^>]*>/;    //去除所有的标签

                //@"<script[^>]*?>.*?</script >" //去除所有脚本，中间部分也删除

                // string regexstr = @"<img[^>]*>";   //去除图片的正则

                // string regexstr = @"<(?!br).*?>";   //去除所有标签，只剩br

                // string regexstr = @"<table[^>]*?>.*?</table>";   //去除table里面的所有内容

                //string regexstr = @"<(?!img|br|p|/p).*?>";   //去除所有标签，只剩img,br,p 
                result = result.replace(/<[^>]*>/g,""); 
                result = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + result.substring(0, result.length > 350 ? 350 : result.length) + (result.length > 350 ? (isDraft ? "..." : "...") : "");
            }

            return result;
}