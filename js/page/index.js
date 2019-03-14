$(document).ready(function () {

	//避免缓存文件
	$.ajaxSetup({
		cache: false
	});


	//返回顶部
	$(document).on("scroll", $(window), function () {
		if ($(this).scrollTop() >= 10) {
			$('#goTop').fadeIn(30);
		} else {
			$('#goTop').fadeOut(30);
		}
	});
	//点击返回顶部
	$(document).on("click", "#goTop", function () {
		$("html,body").animate({
			scrollTop: 0
		}, 500);
	});
    //首页
	Home.Init();

	
	

	//问题审核
	$("#liQuestionApproveList").off("click").on("click", function (event) {
		$(this).addClass("selected").siblings().removeClass("selected");
		QuestionInfo.Approve.Init();
	});

	//回答审核
	$("#liAnswerApproveList").off("click").on("click", function (event) {
	    $(this).addClass("selected").siblings().removeClass("selected");
	    AnswerInfo.Approve.Init();
	});

	//问答推荐
	$("#liQuestionRecommendList").off("click").on("click", function(event){
		$(this).addClass("selected").siblings().removeClass("selected");
		QuestionInfo.Recommend.Init();
	
	});

	//分类管理
	$("#liSubjectManage").off("click").on("click", function(event){
		$(this).addClass("selected").siblings().removeClass("selected");
		SubjectInfo.Init();
	});

	//标签管理
	$("#liTagManage").off("click").on("click", function(event){
		$(this).addClass("selected").siblings().removeClass("selected");
		TagInfo.Init();
	});

});


//时间轴点击
function timeLineClick(){
	//年份切换
    $(".year").on("click", function() {
    	var $presentDot =  $(this);
        $presentDot.parent().siblings().find("ul").hide();
        $presentDot.parent().addClass("selected").siblings().removeClass("selected");
        $presentDot.siblings().show().find("li:eq(0)").addClass("selected").siblings().removeClass("selected");
    });
    //月份切换
    $(".month>li").on("click", function() {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}

//切换选项卡
function tabsClick(){
	$(".content-tabs .content-tabs-item").on("click", function(){
		$(".content-tabs-item").removeClass("selected");
		$(this).addClass("selected")
	});
}

//风琴效果
function listAccrodion(){
	var presentQA = 0;
	$(".answer-question").on("click", function(){
		if ( $(this).parent().index() === presentQA ) {
			$(this).siblings(".answer-list").toggle("blind",300);
		} else {
			$(".answer-list").slideUp();
			$(this).siblings(".answer-list").slideDown();
		}
		presentQA = $(this).parent().index();
	});
}