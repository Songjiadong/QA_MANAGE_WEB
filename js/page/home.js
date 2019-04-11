Home = function () { }
Home.registerClass("Home");
Home.Init= function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/home.html", function (respones, status) {
        if (status == "success") {

            //时间轴
            $(".year").off("click").on("click", Home.YearClickEvent);
            Home.HotQuestionBind();
            Home.HotPraiseQuestionBind();
            //调好的

           
            
            //Home.MostQuestionUserBind();
            //Home.MostPraiseUserBind();
            //Home.MostAnswerUserBind();
            Home.HotPraiseQuestionBind();

            Home.QaStatisticsBind();
            //Home.UserVisitStatisticsBind();
            //待审核问题页
            $("#todoQuestion").on('click', function () {
                $("#liQuestionApprove").addClass("selected").siblings().removeClass("selected");
                $(".main-wapper").load("biz/question.html");
            });

            //待审核回答页
            $("#todoAnswer").on('click', function () {
                $("#liAnswerApprove").addClass("selected").siblings().removeClass("selected");
                $(".main-wapper").load("biz/answer.html");
            });


           

          
        }
    });
}
//时间周年点击
Home.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show().find("li:eq(0)").addClass("selected").siblings().removeClass("selected");
    //月份切换
    $(".month>li").on("click", function () {
        $(this).addClass("selected").siblings().removeClass("selected");
    });
}
//热赞回答绑定
Home.HotPraiseQuestionBind = function hot_praise_question_bind() {
    var temp = "";
    $.SimpleAjaxPost("service/question/GetHotPraiseAnswerList" , true, 
     JSON.stringify({Top:10})).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp += "<li>"
            temp += "<div class='qa-hot-answer-title'>"+item.TITLE+"</div>";
            temp += "<div class='qa-hot-answer-text'>"+item.CONTENT+"</div>";
            temp += "<div class='aq-item-options clear-fix'>";
            temp += "<div class='ad-item-like'>";
            temp += "<span class='aq-item-like-icon'><img src='images/like-o.png'></span>";
            temp += "<span class='aq-item-like-text'>赞</span><span class='aq-item-like-num'>"+item.PRAISE_COUNT+"</span>";
            temp += "</div>";
            temp += "<div class='ad-item-view-all'>";
            temp += "<a id='aBrowseItem" + index + "' href='javascript:void(0);'>查看全文</a>";
            temp += "</div>";
            temp += "</div>";
            temp += "</li>";
            $(document).off("click", "#aBrowseItem" + index);
            $(document).on("click", "#aBrowseItem" + index, { ID: "" }, objPub.BrowseEvent);
        });
       
        $("#ulHotPraiseQuestionList").empty().append(temp);
     })
    
}
Home.HotQuestionBind = function hot_question_bind() {
    var temp = "";
    var result = [];
     $.SimpleAjaxPost("service/question/GetHotList", true, 
     JSON.stringify({Top:10})).done(function(json){
        var result = $.Deserialize(json.List);
        $.each(result, function (index, item) {
            temp += "<li>";
            temp += "<div class='qa-hot-num'><img src='images/num/1.png'></div>";
            temp += "<div class='qa-hot-content'>";
            temp += "<div id='divBrowseItem" + index + "' class='qa-hot-question-title'>"+item.Title+"</div>";
            temp += "<div class='qa-hot-question-opts'>";
            temp += "<div class='ad-item-view'>";
            temp += "<span class='aq-item-like-icon'><img src='images/eye.png'></span>";
            temp += "<span class='aq-item-like-text'>浏览</span><span class='aq-item-like-num'>"+item.BrowseCount+"</span>";
            temp += "</div>";
            temp += "<div class='ad-item-fav'>";
            temp += "<span class='aq-item-like-icon'><img src='images/my-fav.png'></span>";
            temp += "<span class='aq-item-like-text'>收藏</span><span class='aq-item-like-num'>"+item.CollectCount+"</span>";
            temp += "</div>";
            temp += "</div>";
            temp += "</div>";
            temp += "</li>";
            $(document).off("click", "#divBrowseItem" + index);
            $(document).on("click", "#divBrowseItem" + index, { ID: "" }, objPub.BrowseEvent);
        });
        $("#ulHotQuestionList").empty().append(temp);
     })
    
    
}
//最多提问用户绑定
Home.MostQuestionUserBind = function most_question_user_bind() {
    var temp = "";
    $.SimpleAjaxPost("service/user/GetActiveUserListByQuestion" , true, 
     JSON.stringify({Top:10})).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp += "<li class='clear-fix'>";
            temp += "<div id='divBrowseQuestionUserItem"+index+"' class='ranking-user'>";
            temp += "<span class='ranking-user-cover'>";
            temp += "<img src='images/user/boy.png'>";
            temp += "</span>";
            temp += "<span>"+item.UserName+"</span>";
            temp += "</div>";
            temp += "<div class='ranking-num'>"+item.num+"</div>";
            temp += "</li>";
            $(document).off("click", "#divBrowseQuestionUserItem" + index);
            $(document).on("click", "#divBrowseQuestionUserItem" + index, { UserID: "" }, objPub.BrowseUserEvent);
        });
        $("#ulMostQuestionUserList").empty().append(temp);
    })
}
//最多回答用户绑定
Home.MostAnswerUserBind = function most_answer_user_bind() {
    var temp = "";
    $.SimpleAjaxPost("service/user/GetActiveUserListByAnswer" , true, 
     JSON.stringify({Top:10})).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp+="<li class='clear-fix'>";
            temp+="<div id='divBrowseAnswerUserItem"+index+"' class='ranking-user'>";
            temp+="<span class='ranking-user-cover'>";
            temp+="<img src='images/user/boy.png'>";
            temp+="</span>";
            temp+="<span>"+item.UserName+"</span>";
            temp+="</div>";
            temp+="<div class='ranking-num'>"+item.num+"</div>";
            temp += "</li>";
            $(document).off("click", "#divBrowseAnswerUserItem" + index);
            $(document).on("click", "#divBrowseAnswerUserItem" + index, { UserID: "" }, objPub.BrowseUserEvent);
            
        });
        $("#ulMostAnswerUserList").empty().append(temp);
    })
}
//最多点赞用户绑定
Home.MostPraiseUserBind = function most_praise_user_bind() {
    var temp = "";
    var result = [];
    $.SimpleAjaxPost("service/user/GetActiveUserListByPraise" , true, 
     JSON.stringify({Top:10})).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp+="<li class='clear-fix'>";
            temp += "<div id='divBrowsePraiseUserItem"+index+"' class='ranking-user'>";
            temp+="<span class='ranking-user-cover'>";
            temp+="<img src='images/user/boy.png'>";
            temp+="</span>";
            temp+="<span>"+item.UserName+"</span>";
            temp+="</div>";
            temp+="<div class='ranking-num'>"+item.num+"</div>";
            temp += "</li>";
            $(document).off("click", "#divBrowsePraiseUserItem" + index);
            $(document).on("click", "#divBrowsePraiseUserItem" + index, { UserID: "" }, objPub.BrowseUserEvent);
        });
        $("#ulMostPraiseUserList").empty().append(temp);
    })
}
//用户访问量统计绑定
Home.UserVisitStatisticsBind = function user_visit_statistics_bind() {
    var colors = ['#5793f3', '#d14a61', '#675bba', '#61a0a8', '#d48265', '#2f4554', '#91c7ae'];
    //访问量
    var qaVisit = echarts.init($("#divUserVisitStatisitics")[0]);
    var optionVist = {
        color: colors,
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
            padding: 10,
            textStyle: {
                height: 50
            }
        },
        legend: {
            orient: 'vertical',
            bottom: 30,
            left: 10,
            data: ['智能制造', '工业4.0', '机械重工', '机器人', '搜索引擎', '智能制造2', '工业4.02', '机械重工2', '机器人2', '搜索引擎2'],
            height: 200,
            itemGap: 30
        },
        grid: {
            left: '22%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '智能制造',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274]
            },
            {
                name: '工业4.0',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315]
            },
            {
                name: '机械重工',
                type: 'line',
                stack: '总量',
                data: [150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566]
            },
            {
                name: '机器人',
                type: 'line',
                stack: '总量',
                data: [320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400]
            },
            {
                name: '搜索引擎',
                type: 'line',
                stack: '总量',
                data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901]
            },
            {
                name: '智能制造2',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274, 120, 132, 101, 134, 90, 230, 210, 260, 102, 274]
            },
            {
                name: '工业4.02',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315, 220, 182, 191, 234, 290, 330, 310, 286, 265, 315]
            },
            {
                name: '机械重工2',
                type: 'line',
                stack: '总量',
                data: [150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566, 150, 232, 201, 154, 190, 330, 410, 205, 355, 566]
            },
            {
                name: '机器人2',
                type: 'line',
                stack: '总量',
                data: [320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400, 320, 332, 301, 334, 390, 330, 320, 258, 236, 400]
            },
            {
                name: '搜索引擎2',
                type: 'line',
                stack: '总量',
                data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901]
            }
        ]
    };
    qaVisit.setOption(optionVist);
}
Home.QaStatisticsBind = function qa_statistics_bind() {
    var question_data=[]
    $.SimpleAjaxPost("service/question/GetQuestionStatisticsInfoList" , true, 
     JSON.stringify({Year:'2014'})).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            question_data.push(item.Value)
        //    switch(item.Key){
        //     case "January" : 
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //     case "January" : question_data.push(item.Value)
        //     break;
        //    }
        });
        var colors = ['#5793f3', '#d14a61', '#675bba', '#61a0a8', '#d48265', '#2f4554', '#91c7ae'];
    var qaChart = echarts.init($("#divQaStatistics")[0]);
    var optionQa = {
        color: colors,
        tooltip: {
            trigger: 'none',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            top: 70,
            left: 0,
            data: ['提问数量', '回答数量']
        },
        grid: {
            left: '22%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[1]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return '回答数量  ' + params.value
                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        }
                    }
                },
                data: ["2018-1", "2018-2", "2018-3", "2018-4", "2018-5", "2018-6", "2018-7", "2018-8", "2018-9", "2018-10", "2018-11", "2018-12"]
            },
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: colors[0]
                    }
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return '提问数量  ' + params.value
                                + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                        }
                    }
                },
                data: ["2018-1", "2018-2", "2018-3", "2018-4", "2018-5", "2018-6", "2018-7", "2018-8", "2018-9", "2018-10", "2018-11", "2018-12"]
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '提问数量',
                type: 'line',
                xAxisIndex: 1,
                smooth: true,
                data: question_data
            },
            {
                name: '回答数量',
                type: 'line',
                smooth: true,
                data: [3, 5, 11, 18, 48, 69, 231, 46, 55, 18, 10, 7]
            }
        ]
    };
    qaChart.setOption(optionQa);
    })
    
    
    
}