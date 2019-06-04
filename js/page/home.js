Home = function () { }
Home.registerClass("Home");
Home.Year = "";
Home.Month = ""; 
Home.SubjectSltStr ="";
Home.SubjectArray =[];
Home.Top = 5;
Home.Init= function init() {
    $("#sctMain").load(objPub.BaseUrl + "biz/home.html", function (respones, status) {
        if (status == "success") {
            Home.GetAllSubject()
            Home.Year = new Date().getFullYear().toString();
            var temp =  (new Date().getMonth() + 1).toString(); 
            if(temp>9){
                Home.Month = temp
            }else{
                Home.Month = "0"+temp
            }
            Home.YearInit();
            Home.WaitApproveCountBind()
            $("#divCurrentDate").html(Home.Year+"-"+Home.Month)
            Home.QuestionAnswerCountInit(Home.Year);
            Home.HotQuestionBind();
            Home.HotPraiseQuestionBind();
            //调好的
            Home.MostQuestionUserBind();
            Home.MostPraiseUserBind();
            Home.MostAnswerUserBind();
            Home.QaStatisticsBind(Home.Year);
            
            //待审核问题页
            $("#todoQuestion").off("click").on('click', function () {
                $("#liQuestionApproveList").trigger("click")
            });

            //待审核回答页
            $("#todoAnswer").off("click").on('click', function () {
                $("#liAnswerApproveList").trigger("click")
            });
        }
    });
}
Home.YearInit = function year_init(){
    var temp_current_year = parseInt(Home.Year);
    var str = "<li class='swift-edit'><i class='fa fa-edit'></i></li>";
    str +="<li><a href='javascript:void(0);' class='year'>全部</a></li>"
    str+="<li class='selected'>";
    str+="<a href='javascript:void(0);' class='year' value='"+temp_current_year+"'>"+(temp_current_year)+"</a>";
    for(var i=1;i<3;i++){
    str+="<li >";
    str+="<a href='javascript:void(0);' class='year' value='"+(temp_current_year-i)+"'>"+(temp_current_year-i)+"</a>";
    str+="</li>";
    }
    $("#ulYearMenu").empty().append(str);
    $(".year").off("click").on("click",Home.YearClickEvent);
}
//时间周年点击
Home.YearClickEvent = function YearClickEvent(event) {
    var $presentDot = $(this);
    $presentDot.parent().siblings().find("ul").hide();
    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
    $presentDot.siblings().show().find("li:eq(0)").addClass("selected").siblings().removeClass("selected");
    var year = $(this).attr("value");
    Home.UserVisitStatisticsBind(year);
}
Home.WaitApproveCountBind = function wait_approve_count_bind(){
    
    $.SimpleAjaxPost("service/question/GetWaitApproveCountList" , true, 
     JSON.stringify({YearMonth:Home.Year+"-"+Home.Month })).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            if(item.Key =="QuestionCount"){
                $("#spQuestionApproveCount").html(item.Count);
            }else{
                $("#spAnswerApproveCount").html(item.Count);
            }
        })
       
        
     })
}
//热赞回答绑定
Home.HotPraiseQuestionBind = function hot_praise_question_bind() {
    var temp = "";
    $.SimpleAjaxPost("service/answer/GetTopPraiseAnswerList" , true, 
     JSON.stringify({Top:Home.Top})).done(function(json){
        var result = $.Deserialize(json.List)
        $.each(result, function (index, item) {
            temp += "<li>"
            temp += "<div class='qa-hot-answer-title hander' id='divTitleBrowseItem"+index+"'>"+item.QuestionTitle+"</div>";
            temp += "<div class='qa-hot-answer-text'>"+item.AnswerContent+"</div>";
            temp += "<div class='aq-item-options clear-fix'>";
            temp += "<div class='ad-item-like'>";
            temp += "<span class='aq-item-like-icon'><img src='images/like-o.png'></span>";
            temp += "<span class='aq-item-like-text'>赞</span><span class='aq-item-like-num'>"+item.PraiseCount+"</span>";
            temp += "</div>";
            temp += "<div class='ad-item-view-all'>";
            temp += "<a id='aBrowseItem" + index + "' href='javascript:void(0);' class='hander'>查看全文</a>";
            temp += "</div>";
            temp += "</div>";
            temp += "</li>";
            $(document).off("click", "#aBrowseItem" + index+",#divTitleBrowseItem"+index);
            $(document).on("click", "#aBrowseItem" + index+",#divTitleBrowseItem"+index, { ID: item.ID }, objPub.BrowseEvent);
        });
       
        $("#ulHotPraiseQuestionList").empty().append(temp);
     })
    
}
Home.HotQuestionBind = function hot_question_bind() {
    var temp = "";
    var result = [];
     $.SimpleAjaxPost("service/question/GetHotList", true, 
     JSON.stringify({Top:Home.Top})).done(function(json){
        var result = $.Deserialize(json.List);
        $.each(result, function (index, item) {
            temp += "<li>";
            temp += "<div class='qa-hot-num'><img src='images/num/"+(index+1)+".png'></div>";
            temp += "<div class='qa-hot-content'>";
            temp += "<div id='divBrowseItem" + index + "' class='qa-hot-question-title hander' >"+item.Title+"</div>";
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
            $(document).on("click", "#divBrowseItem" + index, { ID: item.ID }, objPub.BrowseEvent);
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
Home.UserVisitStatisticsBind = function user_visit_statistics_bind(year) {
    $.SimpleAjaxPost("service/question/UserVisitStatistics" , true, 
     JSON.stringify({
         Year:{Year:year},
         Top:{Top:10}
        })).done(function(json){
            var temp_array=[];
            var result = $.Deserialize(json.List);
            $.each(result, function (index, item) {

                temp_array.push({
                    name: item.SubjectName,
                    type: 'line',
                    stack: '总量',
                    data: [(item.January ==null?0:item.January), 
                        (item.February ==null?0:item.February),
                        (item.March ==null?0:item.March), 
                        (item.April ==null?0:item.April), 
                        (item.May ==null?0:item.April), 
                        (item.June ==null?0:item.June), 
                        (item.July ==null?0:item.July), 
                        (item.August ==null?0:item.July), 
                        (item.September ==null?0:item.September), 
                        (item.Orctober ==null?0:item.Orctober), 
                        (item.November ==null?0:item.November), 
                        (item.December ==null?0:item.December)]
                })
            })
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
            data: Home.SubjectArray,
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
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {
            type: 'value'
        },
        series: temp_array
    };
    qaVisit.setOption(optionVist);
     });
    
    
}
Home.QuestionAnswerCountInit = function question_answer_count_init(year){
    $.SimpleAjaxPost("service/question/GetAnswerAndQuestionCountList" , true, 
     JSON.stringify({Year:year})).done(function(json){
        var temp_question_count=""
        var temp_answer_count=""
        var temp_question_pass_count=""
        var temp_answer_pass_count=""
        var result = $.Deserialize(json.List);
        $.each(result, function (index, item) {
            if(item.Key =="QuestionCount"){
                temp_question_count = item.Count;
                $("#divQuestionCount").html(temp_question_count);
            }else if(item.Key =="QuestionPassCount"){
                temp_question_pass_count = item.Count
                
            }else if(item.Key =="AnswerCount"){
                temp_answer_count = item.Count
                $("#divAnswerCount").html(temp_answer_count);
            }else{
                temp_answer_pass_count = item.Count
                
            }
        });

        $("#divQuestionPassRate").html(objPub.GetPercent(temp_question_pass_count,temp_question_count));
        $("#divAnswerPassRate").html(objPub.GetPercent(temp_answer_pass_count,temp_answer_count));
     });
}
Home.QaStatisticsBind = function qa_statistics_bind(year_month) {
    var question_data=[]
    var answer_data=[]
    $.SimpleAjaxPost("service/question/GetQuestionStatisticsInfoList" , true, 
     JSON.stringify({Year:year_month})).done(function(json){
        var question_result = $.Deserialize(json.ListQuestion)
        var answer_result = $.Deserialize(json.ListAnswer)
        $.each(question_result, function (index, item) {
            question_data.push(item.Value)
        });
        $.each(answer_result, function (index, item) {
            answer_data.push(item.Value)
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
                data: [Home.Year+"-1", Home.Year+"-2", Home.Year+"-3", Home.Year+"-4", Home.Year+"-5", Home.Year+"-6", Home.Year+"-7", Home.Year+"-8", Home.Year+"-9", Home.Year+"-10", Home.Year+"-11", Home.Year+"-12"]
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
                data: [Home.Year+"-1", Home.Year+"-2", Home.Year+"-3", Home.Year+"-4", Home.Year+"-5", Home.Year+"-6", Home.Year+"-7", Home.Year+"-8", Home.Year+"-9", Home.Year+"-10", Home.Year+"-11", Home.Year+"-12"]
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
                data: answer_data
            }
        ]
    };
    qaChart.setOption(optionQa);
    })
}
Home.GetAllSubject = function get_all_subject(){
    var temp="";
    $.SimpleAjaxPost("service/question/subject/GetAllSubjectList",true).done(function(json){
        var result = $.Deserialize(json.List);
        temp += "<option value=''>请选择</option>"
        $.each(result, function (index, item) {
            temp += "<option value='"+item.ID+"'>"+item.Name+"</option>";
            Home.SubjectArray.push(item.Name);
        });
        Home.SubjectSltStr = temp;
        Home.UserVisitStatisticsBind(Home.Year);
    })
}