AnswerInfo.Recommend = function () { }
AnswerInfo.Recommend.registerClass("AnswerInfo.Recommend");
AnswerInfo.Recommend.PageSize = 10;
//问题推荐初始化
//回答推荐

AnswerInfo.Recommend.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/recommend-answer.html", function (respones, status) {
        if (status == "success") {
                //时间轴
                AnswerInfo.Recommend.YearInit()
            $(".year").off("click").on("click", AnswerInfo.Recommend.YearClickEvent);
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected")
            });
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
                    PageStart: 1,
                    PageEnd: AnswerInfo.Recommend.PageSize * 1
                }; 
                keyword = {
                    Keyword: "",
                    IsRecommend:AnswerInfo.ApproveStatus.SimpleApproveWaiting+"",
                    Year:"2019",//AnswerInfo.Recommend.SelectedYear,
                    Month:"04"// AnswerInfo.Recommend.SelectedMonth  
                }
                AnswerInfo.Recommend.Search(keyword, page);
                AnswerInfo.Recommend.GetOfficialAnswerCount(keyword, page);
        }
    });
}
AnswerInfo.Recommend.YearInit = function year_init(){
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
    $(".year").off("click").on("click", AnswerInfo.Recommend.YearClickEvent);
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
            pageEnd: AnswerInfo.Recommend.PageSize * 1
        };
        var keyword = {
            Keyword: $("#txtSearch").val(),
            SubjectID:$("#sltSubjectID").val(),
            Year:year,
            Month:date,
            IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
        }
        AnswerInfo.Recommend.Search(keyword, page);
        AnswerInfo.Recommend.GetOfficialAnswerCount(year);
    });
}
//时间周年点击
AnswerInfo.Recommend.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show().find("li:eq(0)").addClass("selected").siblings().removeClass("selected");
    //月份切换
    $(".month>li").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}

AnswerInfo.Recommend.Search = function search(keyword, page) {
    $("html,body").animate({
        scrollTop: 0
    });
    AnswerInfo.Recommend.SearchBind(keyword, page,0);
    $.SimpleAjaxPost("service/question/recommend/GetSearchCount", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) {
        var result = json.Count;
        $("#divAnswerCount").html(result);
        AnswerInfo.Recommend.TotalCount = result;
        if (result > AnswerInfo.Recommend.PageSize) {
            AnswerInfo.Recommend.CanPageLoad = true;
            $(document).off("scroll").on("scroll", { DateView: date_view }, AnswerInfo.Recommend.ScrollEvent);
        }
        });
} 
//搜索结果绑定
AnswerInfo.Recommend.SearchBind = function search_bind(keyword, page,current_index) {
    $.SimpleAjaxPost("service/question/recommend/Search", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) { 
        var result =JSON.parse(json.List); 
            var temp = "";
        if (result != null) {
            $.each(result, function (index, item) { 
                var Index =parseInt(current_index *AnswerInfo.Recommend.PageSize) + index;
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
                temp +="已推荐回答<span>"+official_count+"</span>条"
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
                            Index:Index+"-"+answerIndex,
                            IsOfficial: objPub.YesNoType.No.toString(),
                        }, AnswerInfo.Recommend.SetOfficialEvent);
                    }else{
                        temp += "<a href='javascript:;' id='aSetOfficial"+Index+"-"+answerIndex+"'>设为官方推荐</a>";
                        $("#divRecommendList").off("click", "#aSetOfficial" + Index+"-"+answerIndex).on("click", "#aSetOfficial" + Index+"-"+answerIndex, { 
                            ID: answerItem.AnswerID,
                            Index:Index+"-"+answerIndex,
                            IsOfficial: objPub.YesNoType.Yes.toString(),
                        }, AnswerInfo.Recommend.SetOfficialEvent);
                    }
                    temp += "</div>";
                    temp += "</div>";
                })
                temp += "</div>"; 
                temp += "</div>"; 
            })
            if (current_index == 0) {
                $("#divRecommendList").empty().append(temp);
            } else {
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
    var text="";
    var btn_text = ""
    if(is_official ==objPub.YesNoType.Yes.toString()){
        text="已将该回答设为推荐";
        btn_text="<a href='javascript:;' id='aSetOfficial"+index+"'>取消官方推荐</a>";
    }else{
        text="已取消对该回答的推荐";
        btn_text="<a href='javascript:;' id='aSetOfficial"+index+"'>设为官方推荐</a>";
    }
    $.SimpleAjaxPost("service/answer/SetOfficial", true, 
    JSON.stringify({
        ID:  id,
		IsOfficial :is_official,
    })).done(function(json){
        if(json.Result == true){
            $.Alert(text,function(){
             $("#aSetOfficial"+index).replaceWith(btn_text);
             $("#divRecommendList").off("click","#aSetOfficial"+index);
             $("#divRecommendList").on("click","#aSetOfficial"+index, {
                 ID:id,
                 Index:index,
                 IsOfficial:(is_official == objPub.YesNoType.Yes.toString() ? objPub.YesNoType.No.toString():objPub.YesNoType.Yes.toString()),
             },AnswerInfo.Recommend.SetOfficialEvent);
            
            });
        }
    })
}


AnswerInfo.Recommend.GetOfficialAnswerCount = function search(keyword, page) {
    $.SimpleAjaxPost("service/question/recommend/GetOfficialAnswerCount", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) {
        var result = json.Count;
        $("#divOfficialCount").html(result);

    });
} 