AnswerInfo.Recommend = function () { }
AnswerInfo.Recommend.registerClass("AnswerInfo.Recommend");
AnswerInfo.Recommend.PageSize = 10;

//是否能页面加载
AnswerInfo.Recommend.CanPageLoad = false;
//记录总数
AnswerInfo.Recommend.TotalCount = 0;
//当前索引
AnswerInfo.Recommend.CurrentIndex = 0;
AnswerInfo.Recommend.OldDocumentHeight = 0;
AnswerInfo.Recommend.TempYear=Home.Year;
AnswerInfo.Recommend.TempMonth=Home.Month;

AnswerInfo.Recommend.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/recommend-answer.html", function (respones, status) {
        if (status == "success") {
                //时间轴
            AnswerInfo.Recommend.YearInit()
            $(".year").off("click").on("click", AnswerInfo.Recommend.YearClickEvent);
            $(".content-tabs .content-tabs-item").off("click").on("click", AnswerInfo.Recommend.RecommendTypeSearchEvent);
                //风琴效果
                
                //点击推荐
                $(".to-recommend>a").on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    $(".dialog-recommend-cover").dialog({
                        resizable: false,
                        width: 450,
                        modal: true,
                        title: "添加推荐封面",
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
                var page = {
                    pageStart: 1,
                    pageEnd: AnswerInfo.Recommend.PageSize * 1
                }; 
                keyword = {
                    Keyword: "",
                    IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value"),
                    Year:Home.Year,
                    Month:Home.Month,  
                }
                AnswerInfo.Recommend.Search(keyword, page);
                AnswerInfo.Recommend.GetOfficialAnswerCount(keyword);
        }
    });
}
//根据是否推荐筛选
AnswerInfo.Recommend.RecommendTypeSearchEvent = function RecommendTypeSearchEvent(event){
    $(".content-tabs-item").removeClass("selected");
    $(this).addClass("selected");
    var page = {
        pageStart: 1,
        pageEnd: AnswerInfo.Recommend.PageSize * 1
    };
    var keyword = {
        Keyword: $("#txtSearch").val(),
        SubjectID:$("#sltSubjectID").val(),
        Year:AnswerInfo.Recommend.TempYear,
        Month:AnswerInfo.Recommend.TempMonth,
        IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
    }
    AnswerInfo.Recommend.Search(keyword, page);
}
AnswerInfo.Recommend.YearInit = function year_init(){
    var temp_current_year = parseInt(Home.Year);
    var temp_current_month = parseInt(new Date().getMonth() + 1)
    var str = "<li class='swift-edit'><i class='fa fa-edit'></i></li>";
    str +="<li><a href='javascript:void(0);' class='year'>全部</a></li>"
    str+="<li class='selected'>";
    str+="<a href='javascript:void(0);' id='aYear"+temp_current_year+"' class='year'>"+(temp_current_year)+"</a>";
    $("#ulYearMenu").off("click","#aYear"+temp_current_year).on("click","#aYear"+temp_current_year, AnswerInfo.Recommend.YearClickEvent);
    str+="<ul class='month' style='display:block;' value='"+(temp_current_year)+"'>";
    for(var j=1;j<(temp_current_month+1);j++){
        if (j == temp_current_month){
            str+="<li value='"+j+"' id='liMonth"+temp_current_year+"-"+j+"' class='selected'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }else{
            str+="<li value='"+j+"' id='liMonth"+temp_current_year+"-"+j+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }
        $("#ulYearMenu").off("click","#liMonth"+temp_current_year+"-"+j).on("click","#liMonth"+temp_current_year+"-"+j,AnswerInfo.Recommend.SearchEvent);
    }
    str+="</ul>";
    for(var i=1;i<3;i++){
    str+="<li >";
    str+="<a href='javascript:void(0);' id='aYear"+(temp_current_year-i)+"' class='year'>"+(temp_current_year-i)+"</a>";
    $("#ulYearMenu").off("click","#aYear"+(temp_current_year-i)).on("click","#aYear"+(temp_current_year-i), AnswerInfo.Recommend.YearClickEvent);
    str+="<ul class='month' value='"+(temp_current_year-i)+"'>";
        for(var k=1;k<13;k++){
            str+="<li value='"+k+"' id='liMonth"+(temp_current_year-i)+"-"+k+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+k+"月</a></li>";
            $("#ulYearMenu").off("click","#liMonth"+(temp_current_year-i)+"-"+k).on("click","#liMonth"+(temp_current_year-i)+"-"+k,AnswerInfo.Recommend.SearchEvent);
        }
    str+="</ul>";
    str+="</li>";
    }
    $("#ulYearMenu").empty().append(str);
}
AnswerInfo.Recommend.SearchEvent = function SearchEvent(event){
    $(this).addClass("selected").siblings().removeClass("selected");
        
    var page = {
        pageStart: 1,
        pageEnd: AnswerInfo.Recommend.PageSize * 1
    };
    var year = $(this).parent().attr("value");
    var date = $(this).attr("value");
    if(date>9){
    }else{
        date = "0"+date
    }
    AnswerInfo.Recommend.TempYear=year;
    AnswerInfo.Recommend.TempMonth=date;
    var keyword = {
        Keyword: $("#txtSearch").val(),
        SubjectID:$("#sltSubjectID").val(),
        Year:year,
        Month:date,
        IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
    }
    AnswerInfo.Recommend.Search(keyword, page);
    AnswerInfo.Recommend.GetOfficialAnswerCount(keyword);
}
//时间周年点击
AnswerInfo.Recommend.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show();
    //月份切换
    $(".month>li").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}

AnswerInfo.Recommend.Search = function search(keyword, page) {
    $("html,body").animate({
        scrollTop: 0
    });
    AnswerInfo.Recommend.SearchBind(keyword, page);
    $.SimpleAjaxPost("service/answer/GetRecommendSearchCount", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) {
        var result = json.Count;
        if(keyword.IsRecommend == objPub.YesNoType.Yes.toString()){
            $("#divOfficialCount").html(result);
        }else{
            $("#divAnswerCount").html(result);
        }
        
        AnswerInfo.Recommend.TotalCount = result;
        if (result > AnswerInfo.Recommend.PageSize) {
            AnswerInfo.Recommend.CanPageLoad = true;
            $(document).off("scroll").on("scroll", { DateView: date_view }, AnswerInfo.Recommend.ScrollEvent);
        }
        });
} 
//搜索结果绑定
AnswerInfo.Recommend.SearchBind = function search_bind(keyword, page) {
    $.SimpleAjaxPost("service/answer/RecommendSearch", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) { 
        var result =JSON.parse(json.List); 
            var temp = "";
        if (result != null) {
            $.each(result, function (index, item) { 
                var Index =parseInt(AnswerInfo.Recommend.CurrentIndex *AnswerInfo.Recommend.PageSize) + index;
                var official_count = 0;
                $.each(item.AnswerList, function (officialIndex, officialItem) {  
                    if(officialItem.IsOfficial == objPub.YesNoType.Yes.toString()){
                        official_count+=1;
                    }
                })
                temp += "<div class='answer-qa'>";
                temp += "<div class='answer-question'>";
                temp += "<div class='question-title' id='divQuestionTitle'>" + item.QuestionTitle + "</div>";
                temp += "<div class='answer-num'>";
                temp += "<div class='answer-tag' id=''>回答："+item.AnswerList.length+"</div>";
                temp += "<div class='answer-tag' id=''>分类："+item.SubjectName+"</div>";
                temp += "<div class='answer-tag' id=''>被收藏："+item.CollectCount+"</div>";
                temp += "</div>";
                temp +="<div class='recommend-num'>"
                temp +="已推荐回答<span id='spHasRecommendedCount"+Index+"'>"+official_count+"</span>条"
                temp +="</div>"
                temp += "</div>";
                //回答列表
                temp += "<div class='answer-list'>";
                $.each(item.AnswerList, function (answerIndex, answerItem) {  
                    
                    temp += "<div class='answer-item'>";
                    temp += "<div class='answer-item-opt'>";
                    temp += "<div class='answer-item-like'>";
                    temp += "<div class='answer-item-num'>"+answerItem.PraiseCount+"</div>";
                    temp += "<div>";
                    temp += "<span class='aq-item-like-icon'><img src='images/like-o.png'></span>";
                    temp += "<span class='aq-item-like-text'>赞</span>";
                    temp += "</div></div></div>";
                    temp += "<div class='answer-item-content'>";
                    temp += "<div class='answer-item-user clear-fix'>";
                    temp += "<div class='answer-item-user-info'>";
                    temp += "<div class='answer-item-user-pic'>";
                    temp += "<img src='images/user/boy.png'>";
                    temp += "</div>";
                    temp += "<div class='answer-item-user-name'>";
                    temp += "<div>张三</div>";
                    temp += "<div>机械工业信息中心</div>";
                    temp += "</div></div>";
                    temp += "<div class='answer-item-user-date'>2018-08-01 17:00";
                    temp += "</div></div>";
                    temp += "<div class='aq-item-content'>"+answerItem.AnswerContent+"</div>"
                    temp += "<div class='aq-item-options clear-fix'>";
                    temp += "<div class='ad-item-all'>";
                    
                    temp += "<a href='javascript:;'>阅读全文</a>";
                    temp += "</div>";
                    temp += "</div>";
                    temp += "</div>";

                    temp += "<div class='answer-recommend'>";
                    if(answerItem.IsOfficial == objPub.YesNoType.Yes.toString()){
                        temp += "<a href='javascript:;' id='aSetOfficial"+Index+"-"+answerIndex+"'>取消官方推荐</a>";
                        $("#divRecommendList").off("click", "#aSetOfficial" + Index+"-"+answerIndex).on("click", "#aSetOfficial" + Index+"-"+answerIndex, { 
                            ID: answerItem.AnswerID,
                            Index:Index,
                            AnswerIndex:answerIndex,
                            IsOfficial: objPub.YesNoType.No.toString(),
                        }, AnswerInfo.Recommend.SetOfficialEvent);
                    }else{
                        temp += "<a href='javascript:;' id='aSetOfficial"+Index+"-"+answerIndex+"'>设为官方推荐</a>";
                        $("#divRecommendList").off("click", "#aSetOfficial" + Index+"-"+answerIndex).on("click", "#aSetOfficial" + Index+"-"+answerIndex, { 
                            ID: answerItem.AnswerID,
                            Index:Index,
                            AnswerIndex:answerIndex,
                            IsOfficial: objPub.YesNoType.Yes.toString(),
                        }, AnswerInfo.Recommend.SetOfficialEvent);
                    }
                    temp += "</div>";
                    temp += "</div>";
                })
                temp += "</div>"; 
                temp += "</div>"; 
            })
            if(page.pageStart == 1){
                $("#divRecommendList").empty().append(temp);
            }else{
                $("#divRecommendList").append(temp);
            }
            listAccrodion();
        } else {
            $("#divRecommendList").empty().append("<div style='text-align:center;'>暂无待处理的数据</div>");
        }
    })
}
AnswerInfo.Recommend.SetOfficialEvent = function SetOfficialEvent(event){
    var id = event.data.ID;
    var is_official = event.data.IsOfficial;
    var index = event.data.Index;
    var answer_index = event.data.AnswerIndex;
    var tempCount = parseInt($("#spHasRecommendedCount"+index).html());
    if(is_official == objPub.YesNoType.Yes.toString()){
        tempCount = tempCount+1
    }else{
        tempCount = tempCount-1
    }
    $("#spHasRecommendedCount"+index).html(tempCount);
    var text="";
    var btn_text = ""
    if(is_official ==objPub.YesNoType.Yes.toString()){
        text="已将该回答设为推荐";
        btn_text="<a href='javascript:;' id='aSetOfficial"+index+"-"+answer_index+"'>取消官方推荐</a>";
    }else{
        text="已取消对该回答的推荐";
        btn_text="<a href='javascript:;' id='aSetOfficial"+index+"-"+answer_index+"'>设为官方推荐</a>";
    }
    $.SimpleAjaxPost("service/answer/SetOfficial", true, 
    JSON.stringify({
        ID:  id,
		IsOfficial :is_official,
    })).done(function(json){
        if(json.Result == true){
            $.Alert(text,function(){
             $("#aSetOfficial"+index+"-"+answer_index).replaceWith(btn_text);
             $("#divRecommendList").off("click","#aSetOfficial"+index+"-"+answer_index);
             $("#divRecommendList").on("click","#aSetOfficial"+index+"-"+answer_index, {
                 ID:id,
                 Index:index,
                 AnswerIndex:answer_index,
                 IsOfficial:(is_official == objPub.YesNoType.Yes.toString() ? objPub.YesNoType.No.toString():objPub.YesNoType.Yes.toString()),
             },AnswerInfo.Recommend.SetOfficialEvent);
            
            });
        }
    })
}


AnswerInfo.Recommend.GetOfficialAnswerCount = function search(keyword) {
    $.SimpleAjaxPost("service/question/GetOfficialAnswerCount", true, JSON.stringify({ Keyword: keyword })).done(function (json) {
        var result = json.Count;
        $("#divOfficialCount").html(result);

    });
} 