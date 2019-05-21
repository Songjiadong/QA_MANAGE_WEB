$(function () {
    $.ajax({
        url: "https://qamanage.megawise.cn/service/user/GetPublicKey",
        async: false,
        type: "POST",
        data:{},
        //  data: params,
        //data: "{\"login_id\": \"" + $("#username").val() + "\",\"login_pass\": \"" + $("#password").val() + "\"}",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            alert(result);
        },
        error: function (e) {
            alert("s");
        }
    });
});