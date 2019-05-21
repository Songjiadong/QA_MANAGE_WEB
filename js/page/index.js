$(document).ready(function () {
	//返回顶部
	$.SetCookie("MegawiseID","admin")
	$.SetCookie("MegawiseUserName","admin")
	$(window).on("scroll",  function (event) {
		if ($(this).scrollTop() >= 10) {
			$("#goTop").fadeIn(30);
		} else {
			$("#goTop").fadeOut(30);
		}
	});
	//点击返回顶部
	$("#goTop").off("click").on("click", function (event) {
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

	$("#liQuestionRecommendList").off("click").on("click", function(event){
		$(this).addClass("selected").siblings().removeClass("selected");
		QuestionInfo.Recommend.Init();
	
	});
	//问答推荐
	$("#liAnswerRecommendList").off("click").on("click", function(event){
		$(this).addClass("selected").siblings().removeClass("selected");
		AnswerInfo.Recommend.Init();
	
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
	$("#aLoginOut").off("click").on("click",User.Login.LoginOutEvent)
});

function UploadContractFileEvent(event){
	var $fm = $("#fmContractUpload");
    var $file = $(event.target).val();
    if ($file != "") {
		//附件上传
		
        $fm.ajaxSubmit({
            url: "http://qamanage.megawise.cn/service/upload",
            type: "post",
            dataType: "json",
            timeout: 600000,
            success: function (data, textStatus) {
				alert(data.result)
                if (data.result == true) {
                   alert(data.result)
                } else {
                   
                }
            },
            error: function (data, status, e) {
                console.log("上传失败，错误信息：" + e);
            }
        });
    }
}


