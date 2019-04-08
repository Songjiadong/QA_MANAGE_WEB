AnswerInfo.Approve = function () { }
AnswerInfo.Approve.registerClass("AnswerInfo.Approve");
AnswerInfo.Approve.PageSize = 10;
//当前年
AnswerInfo.Approve.Year = new Date().getFullYear().toString();
AnswerInfo.Approve.Month = (new Date().getMonth() + 1).toString(); 
AnswerInfo.Approve.SelectedYear = new Date().getFullYear().toString();
AnswerInfo.Approve.SelectedMonth = (new Date().getMonth() + 1).toString(); 
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
            //设置时间轴显示
            AnswerInfo.Approve.SetDataList();
            //回答审核默认搜索
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
            AnswerInfo.Approve.Search(keyword, page);
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
    AnswerInfo.Approve.SearchBind(keyword, page);
    $.SimpleAjaxPost("service/answer/GetApproveSearchCount", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) {
            var result = json.Count;
            if (result !== 0) { 
                $("#divAnswerListPage").wPaginate("destroy").wPaginate({
                    theme: "grey",
                    page: "5,10,20",
                    total: result,
                    index: parseInt(page.pageStart) - 1,
                    limit: AnswerInfo.Approve.PageSize,
                    ajax: true,
                    pid: "divAnswerListPage",
                    url: function (i) {
                        var page = {
                            pageStart: i * this.settings.limit + 1,
                            pageEnd: (i + 1) * this.settings.limit
                        };
                        AnswerInfo.Approve.SearchBind(keyword, page);
                    }
                });
            }
            else { 
                $("#divAnswerListPage").wPaginate("destroy");
            }
        });
} 
//搜索结果绑定
AnswerInfo.Approve.SearchBind = function search_bind(keyword, page) {
    $.SimpleAjaxPost("service/answer/ApproveSearch", true, JSON.stringify({ Keyword: keyword, Page: page })).done(function (json) { 
        var result = json;
            console.log(result);
            var temp = "";
        if (result != null) {
            $.each(result, function (index, item) {
                
            })
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