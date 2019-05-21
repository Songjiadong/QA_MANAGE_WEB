QuestionInfo.Recommend = function () { }
QuestionInfo.Recommend.registerClass("QuestionInfo.Recommend");
QuestionInfo.Recommend.PageSize = 6;
QuestionInfo.Recommend.CoverUrl = "";
//是否能页面加载
QuestionInfo.Recommend.CanPageLoad = false;
//记录总数
QuestionInfo.Recommend.TotalCount = 0;
//当前索引
QuestionInfo.Recommend.CurrentIndex = 0;
QuestionInfo.Recommend.OldDocumentHeight = 0;
//问题推荐初始化
QuestionInfo.Recommend.Init = function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/question/recommend-question.html", function (respones, status) {
        if (status == "success") {
                //时间轴
                QuestionInfo.Recommend.YearInit()
            $(".year").off("click").on("click", QuestionInfo.Recommend.YearClickEvent);
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected");
                var page = {
                    pageStart: 1,
                    pageEnd: QuestionInfo.Recommend.PageSize * 1
                };
                var keyword = {
                    Keyword: $("#txtSearch").val(),
                    SubjectID:$("#sltSubjectID").val(),
                    Year:Home.Year,
                    Month:Home.Month,
                    IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
                }
                QuestionInfo.Recommend.Search(keyword, page);
            });

			//点击推荐
			$(".recommend-btn>a").off("click").on("click", function (event) {
				var cStr = $(this).hasClass("selected");
				if (cStr) {
					$(this).switchClass("selected", "", 500);
					$(this).text("未推荐");
				} else {
					$(this).switchClass("", "selected", 500);
					$(this).text("已推荐");
				}
            });
            
            var page = {
                pageStart: 1,
                pageEnd: QuestionInfo.Recommend.PageSize * 1
            };
            var keyword = {
                Keyword: $("#txtSearch").val(),
                SubjectID:$("#sltSubjectID").val(),
                Year:Home.Year,
                Month:Home.Month,
                IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
            }
            QuestionInfo.Recommend.Search(keyword, page);
        }
    });
}
//时间周年点击
QuestionInfo.Recommend.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show();
    //月份切换
    $(".month>li").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}
QuestionInfo.Recommend.SearchBind = function SearchBind(keyword, page,current_index) {
    $.SimpleAjaxPost("service/question/recommend/QuestionSearch", true, JSON.stringify({Keyword:keyword,Page:page}))
        .done(function (json) {
            var result = $.Deserialize(json.List);
            var temp = "";
            if (result != null) {
                $.each(result, function (index, item) {
                    var Index =parseInt(current_index * QuestionInfo.Recommend.PageSize) + index;
                    temp+="<div class='recommend-qlist clear-fix'>"
                    temp+="<div class='recommend-upload'>"
                    temp+="<div class='editor-cover pic-long' id='divCoverImage"+Index+"-"+index+"'>" 
                    if(item.Cover!=undefined){
                        temp+="<img src='"+objPub.BaseUrl+item.Cover+"' id='imgCover"+Index+"-"+index+"'/>" 
                    }else{
                        temp+="<img src='images/160.png' id='imgCover"+Index+"-"+index+"'/>" 
                    }
                          
                    temp+="</div>"   
                    temp+="<div class='cover-options pic-long-options'>"    
                    temp+="<form method='post' action='' enctype='multipart/form-data' id='fmCover"+Index+"-"+index+"'>"        
                    temp+="<a class='files' href='javascript:void(0);'>"           
                    temp+="<input accept='.png,.jpg' name='fileCover' id='fileCover"+Index+"-"+index+"' type='file'/>"               
                    temp+="</a></form>"     
                    temp+="<input id='btnUploadCover' class='btn-upload' value='上传主题图片160*200' type='button'/>"       
                    temp+="</div></div>"     
                    temp+="<div class='recommend-btn'>" 
                    if(item.IsRecommend == objPub.YesNoType.Yes.toString()){
                        temp+="<a href='javascript:;' class='selected' id='aSetRecommend"+Index+"-"+index+"'>已推荐</a>"
                        $("#divQuestionRecommendList").off("click","#aSetRecommend"+Index+"-"+index)
                        $("#divQuestionRecommendList").on("click","#aSetRecommend"+Index+"-"+index, {
                            ID:item.ID,
                            Index:Index+"-"+index,
                            IsRecommend:objPub.YesNoType.No.toString(),
                        },QuestionInfo.Recommend.SetRecommendEvent);
                    }else{
                        temp+="<a href='javascript:;' id='aSetRecommend"+Index+"-"+index+"'>未推荐</a>"
                        $("#divQuestionRecommendList").off("click","#aSetRecommend"+Index+"-"+index)
                        $("#divQuestionRecommendList").on("click","#aSetRecommend"+Index+"-"+index, {
                            ID:item.ID,
                            Index:Index+"-"+index,
                            IsRecommend:objPub.YesNoType.Yes.toString(),
                        },QuestionInfo.Recommend.SetRecommendEvent);
                    }
                    temp+="</div>"
                    temp+="<div class='recommend-qcontent'>"
                    temp+="<div class='question-title'>"+item.Title+"</div>"
                    temp+="<div class='answer-num'>"
                    temp+="<div class='answer-tag'>回答："+item.AnswerCount+"</div>"        
                    temp+="<div class='answer-tag'>分类："+item.SubjectName+"</div>"        
                    temp+="<div class='answer-tag'>被收藏："+item.CollectCount+"</div>"        
                    temp+="</div>"    
                    temp+="<div class='question-describe'>"+item.Content    
                    temp+="</div>"    
                    temp+="</div></div>"
                    $("#divQuestionRecommendList").on("change","#fileCover"+Index+"-"+index, {ID:item.ID,Index:Index+"-"+index},QuestionInfo.Recommend.UploadEvent);
                });
                if(page.pageStart==1){
                    $("#divQuestionRecommendList").empty().append(temp);
                }else{
                    $("#divQuestionRecommendList").append(temp);
                }
            }
            else {
                $("#divQuestionRecommendList").empty().append("<tr><td colspan='4' style='text-align:center;'>暂无待处理的数据</td></tr>");
            }
        });
}

QuestionInfo.Recommend.YearInit = function year_init(){
    var temp_current_year = parseInt(Home.Year);
    var temp_current_month = parseInt(new Date().getMonth() + 1)
    var str = "<li class='swift-edit'><i class='fa fa-edit'></i></li>";
    str +="<li><a href='javascript:void(0);' class='year'>全部</a></li>"
    str+="<li class='selected'>";
    str+="<a href='javascript:void(0);' class='year'>"+(temp_current_year)+"</a>";
    str+="<ul class='month' value='"+(temp_current_year)+"'>";
    for(var j=1;j<(temp_current_month+1);j++){
        if (j == temp_current_month){
            str+="<li value='"+j+"' class='selected'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }else{
            str+="<li value='"+j+"'><a href='javascript:void(0);'><em class='s-dot'></em>"+j+"月</a></li>";
        }
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
    $(".year").off("click").on("click", QuestionInfo.Recommend.YearClickEvent);
    $(".month>li").off("click").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        
        var page = {
            pageStart: 1,
            pageEnd: QuestionInfo.Recommend.PageSize * 1
        };
        var year = $(this).parent().attr("value");
        var date = $(this).attr("value");
        if(date>9){
        }else{
            date = "0"+date
        }
        var keyword = {
            Keyword: $("#txtSearch").val(),
            SubjectID:$("#sltSubjectID").val(),
            Year:year,
            Month:date,
            IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
        }
        QuestionInfo.Recommend.Search(keyword, page);
        QuestionInfo.Recommend.GetRecommendQuestionCount(keyword).done(function(json){
            var result = json.Count;
            $("#divRecommendCount").html(result);
        });
    });
}

QuestionInfo.Recommend.UploadEvent = function UploadEvent(event){
    var id = event.data.ID;
    var index = event.data.Index;
    var $fm = $("#fmCover"+index);
    var $file = $(event.target).val();
    if ($file != "") {
        //附件上传
        $fm.ajaxSubmit({
            url: "http://qamanage.megawise.cn/service/question/recommend/UploadLogo",
            type: "post",
            dataType: "json",
            timeout: 600000,
            success: function (data, textStatus) {
                QuestionInfo.Recommend.CoverUrl = data.Result
                $("#divCoverImage"+index).html("<img src='"+objPub.BaseUrl+QuestionInfo.Recommend.CoverUrl+"' width='50' height='50'/>");
                $.SimpleAjaxPost("service/question/Submit", true, 
                    JSON.stringify({
                        ID:id,
                        Cover:QuestionInfo.Recommend.CoverUrl,
                    })).done(function(json){
                        if(json.Result == true){
                            $.Alert({content:"上传封面成功~",width:"auto"},function(){
                                //Question.SubmitGC();
                            })
                        }
                    })
            },
            error: function (data, status, e) {
                console.log("上传失败，错误信息：" + e);
            }
        });
    }
}
QuestionInfo.Recommend.SetRecommendEvent = function SetRecommendEvent(event){
    var id = event.data.ID
    var is_recommend = event.data.IsRecommend;
    var index = event.data.Index;
    var text=""
    var btn_text = ""
    var url = $("#imgCover"+index).attr("src");
    if(url=="images/160.png"){
        $.Alert("请先上传封面！")
        return;
    }
    if(is_recommend ==objPub.YesNoType.Yes.toString()){
        text="已将该问题设为推荐";
        btn_text="<a href='javascript:;' class='selected' id='aSetRecommend"+index+"'>已推荐</a>";
    }else{
        text="已取消对该问题的推荐";
        btn_text="<a href='javascript:;' id='aSetRecommend"+index+"'>未推荐</a>";
    }
    $.SimpleAjaxPost("service/question/recommend/SetRecommend", true, 
    JSON.stringify({
        ID: id,
		IsRecommend :is_recommend,
    })).done(function(json){
       if(json.Result == true){
           $.Alert(text,function(){
            //QuestionInfo.Approve.GetApproveStatusCount();
            $("#aSetRecommend"+index).replaceWith(btn_text);
            $("#divQuestionRecommendList").off("click","#aSetRecommend"+index);
            $("#divQuestionRecommendList").on("click","#aSetRecommend"+index, {
                ID:id,
                Index:index,
                IsRecommend:(is_recommend == objPub.YesNoType.Yes.toString() ? objPub.YesNoType.No.toString():objPub.YesNoType.Yes.toString()),
            },QuestionInfo.Recommend.SetRecommendEvent);
           
           });
       }
    })
}
QuestionInfo.Recommend.Search = function search(keyword, page) {
    $("html,body").animate({
        scrollTop: 0
    });
    QuestionInfo.Recommend.SearchBind(keyword, page,0);
    $.SimpleAjaxPost("service/question/recommend/GetQuestionSearchCount", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) {
        var result = json.Count;
        $("#divQuestionCount").html(result);
        QuestionInfo.Recommend.TotalCount = result;
        if (result > QuestionInfo.Recommend.PageSize) {
            QuestionInfo.Recommend.CanPageLoad = true;
            $(document).off("scroll").on("scroll", { DateView: keyword }, QuestionInfo.Recommend.ScrollEvent);
        }
        });
}
//滚轮事件
QuestionInfo.Recommend.ScrollEvent = function ScrollEvent(event) {
    var date_view = event.data.DateView;
    if (($(document).scrollTop() >= $(document).height() - $(window).height()) && QuestionInfo.Recommend.OldDocumentHeight != $(document).height()) {
        if (QuestionInfo.Recommend.CanPageLoad == true) {
            QuestionInfo.Recommend.CurrentIndex = QuestionInfo.Recommend.CurrentIndex + 1;
            var page = {
                pageStart: QuestionInfo.Recommend.CurrentIndex * QuestionInfo.Recommend.PageSize + 1,
                pageEnd: (QuestionInfo.Recommend.CurrentIndex + 1) * QuestionInfo.Recommend.PageSize
            };
            var year = $(this).parent().attr("value");
            var date = $(this).attr("value");
            if(date>9){
            }else{
                date = "0"+date
            }
            var keyword = {
                Keyword: $("#txtSearch").val(),
                SubjectID:$("#sltSubjectID").val(),
                Year:year,
                Month:date,
                IsRecommend:$("#divApproveStatusTab").find(".selected").attr("value")
            }
            QuestionInfo.Recommend.SearchBind(date_view, page, QuestionInfo.Recommend.CurrentIndex);
            if (page.pageEnd >= QuestionInfo.Recommend.TotalCount) {
                QuestionInfo.Recommend.CanPageLoad = false;
            }
            QuestionInfo.Recommend.OldDocumentHeight = $(document).height();
        } else {
            if (QuestionInfo.Recommend.TotalCount == 0) {
                $(document).off("scroll");
            } else if (parseInt(QuestionInfo.Recommend.TotalCount / QuestionInfo.Recommend.PageSize) > objPub.MinTipPage) {
                $.Alert("这已经是最后一页了哦~");
                $(document).off("scroll");
                setTimeout(function () {
                    $(".dialog-normal").dialog('close');
                }, 2000);
            }
            QuestionInfo.Recommend.OldDocumentHeight = 0;
        }
    }
}
QuestionInfo.Recommend.GetRecommendQuestionCount = function get_recommend_question_count(keyword) {
   return $.SimpleAjaxPost("service/question/recommend/GetRecommendQuestionCount", true, JSON.stringify({ Keyword: keyword }));
} 