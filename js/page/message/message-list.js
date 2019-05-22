Message.List=function(){}
Message.List.registerClass("Message.List");
Message.List.PageSize = 10;
Message.List.TotalCount = 0;
Message.List.CurrentIndex = 0;
Message.List.CanPageLoad = false;
Message.List.OldDocumentHeight = 0;
Message.List.Init = function init(){
    $(".main-right").load(objPub.BaseUrl+"biz/main/message/message-list.html", function(response,status){
        if(status=="success"){
            var page = {
                pageStart: 1,
                pageEnd: Message.List.PageSize
            };
            var keyword = {
                Keyword: ""
            }
            Message.List.Search(keyword, page);
            $(window).off("scroll").on("scroll", { WithTimeAxis: true ,FromPerson:false},Message.List.ScrollEvent);
        }
    })
}
//滚轮事件
Message.List.ScrollEvent = function ScrollEvent(event) {
    var keyword = {
        Keyword: ""
    }
  
    if (($(document).scrollTop() >= $(document).height() - $(window).height()) && Message.List.OldDocumentHeight != $(document).height()) {
        if (Message.List.CanPageLoad == true) {
            Message.List.CurrentIndex = Message.List.CurrentIndex + 1;
            var page = {
                pageStart: Message.List.CurrentIndex * Message.List.PageSize + 1,
                pageEnd: (Message.List.CurrentIndex + 1) * Message.List.PageSize
            };
            Message.List.SearchBind(keyword, page, Message.List.CurrentIndex);
            if (page.pageEnd >= Message.List.TotalCount) {
                Message.List.CanPageLoad = false;
            }
            Message.List.OldDocumentHeight = $(document).height();
        } else {
            if (Message.List.TotalCount == 0) {
                $(document).off("scroll");
            } else if (parseInt(Message.List.TotalCount / Message.List.PageSize) > objPub.MinTipPage) {
                $.Alert("这已经是最后一页了哦~");
                $(document).off("scroll");
                setTimeout(function () {
                    $(".dialog-normal").dialog('close');
                }, 2000);
            }
            Message.List.OldDocumentHeight = 0;
        }
    }
}
//查询事件
Message.List.Search = function search(keyword, page) {
    Message.List.SearchBind(keyword, page);
    $.SimpleAjaxPost("service/message/GetMySearchCount", true,JSON.stringify({
        Keyword:keyword.Keyword
    })).done(function(json){
        var result = json.Count;
        Message.List.TotalCount = result;
        if (result <= Message.List.PageSize) {
            if (result == 0) {
            }
            else {
                if (Message.List.CurrentIndex != 0) {
                    $.Alert("这已经是最后一页了哦~");
                }
            }
        }
        else {
            Message.List.CanPageLoad = true;
        }
    });
      
}

Message.List.SearchBind = function search_bind(keyword, page) {
    $.SimpleAjaxPost("service/message/MySearch",true,JSON.stringify({Keyword:keyword,Page:page})).done(function(json){
        var result = $.Deserialize(json.List);
        var temp = "";
        if ($.isArray(result)==true && result.length>0) {
            $.each(result, function (index, item) {
                temp+="<div class='message-item'>"
                temp+="<div class='message-left'>"
                if(item.SenderUrl!=""){
                    temp+="<img src='"+item.SenderUrl+"'/>";
                }else{
                    temp+="<img src='/images/user/boy.png'/>";
                }
                
                temp+="</div>"
                temp+="<div class='message-right'>"
                temp+="<div class='message-top'>"
                temp+="<div>"+item.SenderName+"</div>"
                temp+="<div>"+item.Title+"</div>"
                temp+="<div>"+new Date(item.MessageTime).format("yyyy-MM-dd")+"</div>"
                temp+="<div class='clear'></div>"
                temp+="</div>"
                temp+="<div class='message-bottom'>"
                temp+="<img src='images/my-fav.png'/>"
                temp+=item.MessageTip
                temp+="</div>"
                temp+="</div>"
                temp+="<div class='clear'></div>"
                temp+="</div>"
            });
            $("#divMessageList").append(temp);
        }else{
            var empty_bar = "<div class='no-content'>";
            empty_bar+="<img src='"+objPub.BaseUrl+"images/no-content.png'>";
			empty_bar+="<div class='no-content-text'>暂时没有内容，去发起一个问题吧~</div>";
            empty_bar+="</div>";
            $("#divMessageList").empty().append(empty_bar);
        }

    });
}