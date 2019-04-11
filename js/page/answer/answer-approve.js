﻿AnswerInfo.Approve = function () { }
AnswerInfo.Approve.registerClass("AnswerInfo.Approve");
AnswerInfo.Approve.PageSize = 10;
//当前年
AnswerInfo.Approve.Year = new Date().getFullYear().toString();
AnswerInfo.Approve.Month = (new Date().getMonth() + 1).toString(); 
AnswerInfo.Approve.SelectedYear = new Date().getFullYear().toString();
AnswerInfo.Approve.SelectedMonth = (new Date().getMonth() + 1).toString(); 
//是否能页面加载
AnswerInfo.Approve.CanPageLoad = false;
//记录总数
AnswerInfo.Approve.TotalCount = 0;
//当前索引
AnswerInfo.Approve.CurrentIndex = 0;
AnswerInfo.Approve.OldDocumentHeight = 0;
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
            //风琴效果
            listAccrodion();
            $(".content-tabs .content-tabs-item").off("click").on("click", function (event) {
                $(".content-tabs-item").removeClass("selected");
                $(this).addClass("selected")
            });
            //回答审核筛选框初始化
            AnswerInfo.Approve.InitApproveData(); 
            // //设置时间轴显示
            AnswerInfo.Approve.SetDataList();
            //回答审核默认搜索
            var page = {
                PageStart: 1,
                PageEnd: AnswerInfo.Approve.PageSize * 1
            }; 
            // keyword = {
            //     Keyword: $("#txtSearch").val(),
            //     ApproveStatus:AnswerInfo.ApproveStatus.SimpleApproveWaiting+"",
            //     Year:AnswerInfo.Approve.SelectedYear,
            //     Month: AnswerInfo.Approve.SelectedMonth  
            // }
            // AnswerInfo.Approve.Search(keyword, page);
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
    $(".answer-question").on("click", function () {
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
AnswerInfo.Approve.InitApproveData = function init_approve_data() { 
    var top = {
        Top:1
    }
    $.SimpleAjaxPost("service/answer/GetAnswerApproveStatistics", true , JSON.stringify(top),function (json) {
        var result = json; 
        if (result!=null) {
            var approveStatistics = JSON.parse(result.List); 
            var alreadyApproveCount = 0;
            if (Array.isArray(approveStatistics) == true) { 

                for (var i = 0; i < approveStatistics.length; i++){ 
                    var item = approveStatistics[i];
                    if (item.status == "等待") {
                        $("#divWaitApproveNum").html(item.searchCount);
                    } else if (item.status == "同意") { 
                        $("#divAgreeApproveNum").html(item.searchCount);
                        alreadyApproveCount += parseInt (item.searchCount);
                    } else if (item.status == "拒绝") {
                        $("#divRejectApprovrNum").html(item.searchCount);
                        alreadyApproveCount += parseInt (item.searchCount);
                    }
                }
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
        Year:AnswerInfo.Approve.SelectedYear,
        Month: AnswerInfo.Approve.SelectedMonth 
    }
    AnswerInfo.Approve.Search(keyword, page);
}
//搜索框回车事件
AnswerInfo.Approve.SearchKeyPressEvent = function SearchKeyPressEvent(event) {
    if (event.keyCode === 13) {
        var page = event.data.Page;
        var approveStatusVal = $("div.content-tabs-item.selected").attr("data");
        var keyword = {
            Keyword: $("#txtSearch").val(),
            ApproveStatus: approveStatusVal,
            Year: AnswerInfo.Approve.SelectedYear,
            Month: AnswerInfo.Approve.SelectedMonth
        }
        AnswerInfo.Approve.Search(keyword, page);
    }
}  
//设置时间轴显示
AnswerInfo.Approve.SetDataList = function set_data_list() {
    var data_view = {
        ApproveStatus: $("div.content-tabs-item.selected").attr("data"),
        //当前年
        Year: AnswerInfo.Approve.Year,
        Month:AnswerInfo.Approve.Month
    }
    console.log(data_view);
    $.SimpleAjaxPost("service/answer/GetAnswerYearList",true,JSON.stringify(data_view),function (json) {
            var result = JSON.parse(json.List);
            var temp = "";
            if (Array.isArray(result) == true) { 
                //查看全部按钮
                temp += " <li id='liAll'><a href='javascript:void(0);' id='aAllButton' class='year'>全部</a></li>";
                $(document).off("click", "#aAllButton").on("click", "#aAllButton", AnswerInfo.Approve.GetAllInfos);
                //循环加载年份
               $.each(result, function (index, item) {
                    temp += "<li id='liYear" + index + "'" + (index == 0 ? " class='selected' " : " ") + " >";
                    temp += "<a href='javascript:void(0);' class='year'>" + item.YEAR + "</a>";
                    temp += "<ul class='month' id='ulAnswerInfoListOf" + item.YEAR + "'></ul>";
                    temp += "</li>";
                    $(document).off("click", "#liYear" + index).on("click", "#liYear" + index, { Year: item.YEAR }, AnswerInfo.Approve.GetMonthListEvent);
               });
               $("#ulDateList").empty().append(temp);
                //时间轴切换年份
               $(".year").on("click", function (event) {
                    var $presentDot = $(event.target);
                    $presentDot.parent().siblings().find("ul").hide();
                    $presentDot.parent().addClass("selected").siblings().removeClass("selected");
               });
                //搜索参数
               var page = {
                    pageStart: 1,
                    pageEnd: AnswerInfo.Approve.PageSize * 1
                };
            if ($("li[id^='liYear']").length > 0) {
                data_view.Year = $("li[id^='liYear'].selected .year").text();
                data_view.Month = "";
            }
            else {
                //当前月
                data_view.Month = AnswerInfo.Approve.Month;
            }
            data_view.Keyword = $("#txtSearch").val();
            data_view.ApproveStatus = $("div.content-tabs-item.selected").attr("data");
            AnswerInfo.Approve.Search(data_view, page); 
            }else {
                $("#ulDateList").empty().append(temp);
            }
        })

}
//获取月份列表
AnswerInfo.Approve.GetMonthListEvent = function GetMonthListEvent(event) {
    var year = event.data.Year;
    var data_view = {
        ApproveStatus: $("div.content-tabs-item.selected").attr("data"),
        Year: year ,
        Month:AnswerInfo.Approve.Month
    };
    console.log(data_view);
    $.SimpleAjaxPost("service/answer/GetAnswerMonthList", true,JSON.stringify(data_view),function (json) {
           var result = JSON.parse(json.List);
           var temp = "";
           if (Array.isArray(result)==true) {
            $.each(result, function (index, item) {
                temp += "<li id='liMonth" + year + "-" + item.MONTH + "'><a href='javascript:void(0);'><em class='s-dot'></em>" + item.MONTH + "月</a></li>";
                $(document).off("click", "#liMonth" + year + "-" + item.MONTH).on("click", "#liMonth" + year + "-" + item.MONTH, { Year: year, Month: item.MONTH }, AnswerInfo.Approve.GetMonthInfoListEvent);
            }) 
           }
           $("#ulAnswerInfoListOf" + year).empty().append(temp).show();
       });
    var page = {
        pageStart: 1,
        pageEnd: AnswerInfo.Approve.PageSize * 1
    };
    
    data_view.Keyword = $("#txtSearch").val();
    data_view.ApproveStatus = $("div.content-tabs-item.selected").attr("data");
    data_view.Month = "";
    AnswerInfo.Approve.Search(data_view,page);
}
//月份点击获取信息
AnswerInfo.Approve.GetMonthInfoListEvent = function GetMonthInfoListEvent(event) {
    var year = event.data.Year;
    var month = event.data.Month;
    AnswerInfo.Approve.SelectedYear = year;
    AnswerInfo.Approve.SelectedMonth = month;
    var date_view = {
        Keyword: $("#txtSearch").val(),
        ApproveStatus:$("div.content-tabs-item.selected").attr("data"),
        Year:year,
        Month: month
    };
    var $this = $("#liMonth"+year+"-"+month);
    $this.addClass("selected").siblings().removeClass("selected");
    //加载信息列表
    var page = {
        pageStart: 1,
        pageEnd: AnswerInfo.Approve.PageSize * 1
    };
    AnswerInfo.Approve.Search(date_view,page);
    event.stopPropagation();
}
//审批框点击事件
AnswerInfo.Approve.SearchClickEvent = function SearchClickEvent(event) { 
    AnswerInfo.Approve.SetDataList();
}
//初始搜索 和 分页
AnswerInfo.Approve.Search = function search(keyword, page) {
    $("html,body").animate({
        scrollTop: 0
    });
    AnswerInfo.Approve.SearchBind(keyword, page,0);
    $.SimpleAjaxPost("service/answer/GetApproveSearchCount", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) {
        var result = json.Count;
        AnswerInfo.Approve.TotalCount = result;
        if (result > AnswerInfo.Approve.PageSize) {
            AnswerInfo.Approve.CanPageLoad = true;
            $(document).off("scroll").on("scroll", { DateView: date_view }, AnswerInfo.Approve.ScrollEvent);
        }
        });
} 
//搜索结果绑定
AnswerInfo.Approve.SearchBind = function search_bind(keyword, page,current_index) {
    $.SimpleAjaxPost("service/answer/ApproveSearch", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) { 
        var result =JSON.parse( json.List);
            console.log(result);
            var temp = "";
        if (result != null) {
            $.each(result, function (index, item) {
                console.log(item);
                var Index =parseInt(current_index *AnswerInfo.Approve.PageSize) + index;
                temp += "<div class='answer-qa'>";
                temp += "<div class='answer-question'>";
                temp += "<div class='question-title' id='divQuestionTitle'>" + item.QuestionTitle + "</div>";
                temp += "<div class='answer-num'>";
                temp += "<div class='answer-tag' id='divAnswerTag'>回答："+item.AnswerList.length+"</div>";
                temp += "</div>";
                temp += "</div>";
                //回答列表
                temp += "<div class='answer-list>";
                $.each(item.AnswerList, function (answerIndex, answerItem) {
                    console.log(answerItem);
                    temp += "<div class='answer-item'>";
                    temp += "<div class='answer-item-user clear-fix'></div>";
                    temp += "<div class='answer-item-user-info'>";
                    temp += "<div class='answer-item-user-pic'>";
                    temp += "<img src='" + answerItem.UserUrl + "'>";
                    temp += "</div>";
                    temp += "<div class='answer-item-user-name'>";
                    temp += "<div>"+answerItem.NickName+"</div>";
                    temp += "<div> 单位名称</div>";
                    temp += "</div>";
                    temp += "</div>";
                    temp += "<div class='answer-item-user-date'>" + answerItem.PublishTime + "</div>";
                    //判断答案是否有图片
                    if (answerItem.FileList.length!=0) {
                        //有图片
                        temp += "<div class='aq-item-content clear-fix'>";
                        temp += "<div class='aq-item-content-img'>";
                        temp += "<img title='" + answerItem.FileList[0].FileName + "' src='" + answerItem.FileList[0].FilePath + "'>";
                        temp += "</div>";
                        temp += "<div class='aq-item-content-text'>" + answerItem.AnswerContent + "</div>";
                    } else {
                        //没有图片
                        temp += "<div class='aq-item-content'>"+answerItem.AnswerContent+"</div>";
                    }
                    temp += "<div class='aq-item-options clear-fix'>";
                    temp += "<div class='ad-item-all'>";
                    temp += "<a href='javascript:;'>阅读全文</a>";
                    temp += "</div>";
                    temp += "<div class='to-ratify'>";
                    temp += "<a href='javascript:;' id='a'>通过</a>";
                    temp += "<a href='javascript:;' class='refuse'>拒绝</a>";
                    temp += "</div>";
                    temp += "</div>";
                    temp += "</div>"; 
                })
            })
            $("#divAnswerList").empty().append(temp);
        }
    })
}
//阅读全文 
AnswerInfo.Approve.GoDetailEvent = function GoDetailEvent(event) { 

}
//设置审批事件
AnswerInfo.Approve.SetApproveEvent = function SetApproveEvent(event) { 
    var id = event.data.ID;
    var status = event.data.Status;
    var approveInfo = {
        //ID answerID
	    ID : id,
	    //ApproveStatus 审批状态
	    ApproveStatus:status,
        //Reason 审批备注
        Reason:"",
        //UserID 用户ID
        ApproverID:objPub.UserID,
        //UserName 用户名
        ApproverName:objPub.UserName
    }
    AnswerInfo.Approve.SetApprove(approveInfo);
}
//设置审批
AnswerInfo.Approve.SetApprove = function set_approve(approveInfo) { 
    $.SimpleAjaxPost("service/answer/SetApprove", true, JSON.stringify(approveInfo)).done(function (json) { 
        var result = JSON.parse(json);
        console.log(result); 
        if (result != null) {
            if (result==true) {
                $.Alert("审批成功！");
                var page = {
                    PageStart: 1,
                    PageEnd: AnswerInfo.Approve.PageSize * 1
                }; 
                keyword = {
                    Keyword: $("#txtSearch").val(),
                    ApproveStatus:AnswerInfo.ApproveStatus.SimpleApproveWaiting+"",
                    Year:AnswerInfo.Approve.SelectedYear,
                    Month: AnswerInfo.Approve.SelectedMonth  
                }
                AnswerInfo.Approve.Search(keyword,page);
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