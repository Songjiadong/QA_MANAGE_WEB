function simple_ajax_jsonp(url_str, data_str) {
    var url_web;
    if ($.isArray(url_str) == true) {
        url_web = url_str[0] + url_str[1];
    } else if (typeof (url_str) === "string") {
        url_web = this._baseUrl + url_str;
    }
    var ajax;
    if (arguments.length == 2) {
        ajax= $.ajax({
            url: url_web,
            crossDomain: true,
            type: "GET",
            jsonp: "jsoncallback",
            dataType: "jsonp",
            data: arguments[2],
            error: function (x, e) {
                if (x.responseText === undefined) {
                    $.Alert(x.responseText);
                }
                else {
                     handle_exception(x);
                }
            }
        });
    }
    else if (arguments.length == 1) {
        ajax= $.ajax({
            url: url_web,
            crossDomain: true,
            type: "GET",
            dataType: "jsonp",
            jsonp: "jsoncallback",
            data: "",
            error: function (x, e) {
                if (x.responseText === undefined) {
                    $.Alert(x.responseText);
                }
                else {
                     handle_exception(x);
                }
            }
        });
    }
    return ajax;
}
function simple_ajax_jsonp_err(url_str, data_str,error) {
    var url_web;
    if ($.isArray(url_str) == true) {
        url_web = url_str[0] + url_str[1];
    } else if (typeof (url_str) === "string") {
        url_web = this._baseUrl + url_str;
    }
    if (typeof (error) !== "function") {
        console.log("error为必填回调函数！");
    }
    var ajax;
    if (arguments.length == 2) {
        ajax= $.ajax({
            url: url_web,
            crossDomain: true,
            type: "GET",
            jsonp: "jsoncallback",
            dataType: "jsonp",
            data: arguments[2],
            error: error
        });
    }
    else if (arguments.length == 1) {
        ajax= $.ajax({
            url: url_web,
            crossDomain: true,
            type: "GET",
            dataType: "jsonp",
            jsonp: "jsoncallback",
            data: "",
            error: error
        });
    }
    return ajax;
}
function ajax_jsonp(url_str, data_str, callback) {
    var url_web;
    if ($.isArray(url_str) == true) {
        url_web = url_str[0] + url_str[1];
    } else if (typeof (url_str) === "string") {
        url_web = this._baseUrl + url_str;
    }
    var ajax;
    if (arguments.length == 3) {
        ajax= $.ajax({
            url: url_web,
            crossDomain: true,
            type: "GET",
            jsonp: "jsoncallback",
            dataType: "jsonp",
            data: arguments[2],
            success: callback,
            error: function (x, e) {
                if (x.responseText === undefined) {
                    $.Alert(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    else if (arguments.length == 2) {
        ajax= $.ajax({
            url: url_web,
            crossDomain: true,
            type: "GET",
            dataType: "jsonp",
            jsonp: "jsoncallback",
            data: "",
            success: arguments[1],
            error: function (x, e) {
                if (x.responseText === undefined) {
                    $.Alert(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    return ajax;
}
function simple_ajax_json_cors(url_str, transType, data_str) {
    $.support.cors = true;
    var url_web;
    if ($.isArray(url_str) == true) {
        url_web = url_str[0] + url_str[1];
    }
    else if (typeof (url_str) === "string") {
        url_web = this._baseUrl + url_str;
    }
    var ajax;
    if (arguments.length == 3) {
        ajax= $.ajax({
            url: url_web,
            type: arguments[1],
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            async: true,
            dataType: "json",
            contentType: "text/plain; charset=utf-8",
            data: arguments[2],
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    else if (arguments.length == 2) {
       ajax= $.ajax({
            url: url_web,
            contentType: "text/plain; charset=utf-8",
            type: arguments[1],
            dataType: "json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            async: true,
            data: "",
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    return ajax;
}
function simple_ajax_json_cors_err(url_str, transType, data_str,error) {
    $.support.cors = true;
    var url_web;
    if ($.isArray(url_str) == true) {
        url_web = url_str[0] + url_str[1];
    }
    else if (typeof (url_str) === "string") {
        url_web = this._baseUrl + url_str;
    }
    if (typeof (error) !== "function") {
        console.log("error为必填回调函数！");
    }
    var ajax;
    if (arguments.length == 4) {
        ajax= $.ajax({
            url: url_web,
            type: arguments[1],
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            async: true,
            dataType: "json",
            contentType: "text/plain; charset=utf-8",
            data: arguments[2],
            error: error
        });
    }
    else if (arguments.length == 3) {
        ajax= $.ajax({
            url: url_web,
            contentType: "text/plain; charset=utf-8",
            type: arguments[1],
            dataType: "json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            async: true,
            data: "",
            error: error
        });
    }
    return ajax;
    
}
function ajax_json_cors(url_str, transType, data_str, callback) {
    $.support.cors = true;
    var url_web;
    if ($.isArray(url_str) == true) {
        url_web = url_str[0] + url_str[1];
    }
    else if (typeof (url_str) === "string") {
        url_web = this._baseUrl + url_str;
    }
    var ajax;
    if (arguments.length == 4) {
        ajax= $.ajax({
            url: url_web,
            type: arguments[1],
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            async: true,
            dataType: "json",
            contentType: "text/plain; charset=utf-8",
            data: arguments[2],
            success: arguments[3],
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    else if (arguments.length == 3) {
        ajax= $.ajax({
            url: url_web,
            contentType: "text/plain; charset=utf-8",
            type: arguments[1],
            dataType: "json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            async: true,
            data: "",
            success: arguments[2],
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    return ajax;
}
function simple_post_json_with_form(url_str, async, data_json, callback) {
    var url_web = this._baseUrl + url_str;
    var ajax;
    if (arguments.length == 4) {
        ajax = $.ajax({
            url: url_web,
            type: "POST",
            async: async,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: data_json,
            success: callback,
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    else if (arguments.length == 3) {
        //无参；回调
        if (typeof (arguments[2]) == "function") {
            ajax = $.ajax({
                url: url_web,
                type: "POST",
                async: async,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {},
                success: arguments[2],
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
        else {
            //有参数；无回调
            ajax = $.ajax({
                url: url_web,
                type: "POST",
                async: async,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: data_json,
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
    }
    else if (arguments.length == 2) {
        //无参无回调
        ajax = $.ajax({
            url: url_web,
            type: "POST",
            async: async,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {},
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    return ajax;
}
function simple_post_json(url_str, async, data_str, callback) {
    var url_web = this._baseUrl + url_str;
    var ajax;
    if (arguments.length == 4) {
        ajax= $.ajax({
            url: url_web,
            type: "POST",
            async: async,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: data_str,
            success: callback,
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    else if (arguments.length == 3) {
        //无参；回调
        if (typeof (arguments[2]) == "function") {
           ajax= $.ajax({
                url: url_web,
                type: "POST",
                async: async,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: "",
                success: arguments[2],
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
        else {
            //有参数；无回调
            ajax= $.ajax({
                url: url_web,
                type: "POST",
                async: async,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: data_str,
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
    }
    else if (arguments.length == 2) {
        //无参无回调
        ajax= $.ajax({
            url: url_web,
            type: "POST",
            async: async,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: "",
            error: function (x, e) {
                if (x.responseText === undefined) {
                    console.log(x.responseText);
                }
                else {
                    console.log(x);
                }
            }
        });
    }
    return ajax;
}
function simple_post_json_err(url_str, async, data_str, callback, error) {
    var url_web = this._baseUrl + url_str;
    if (error && typeof(error) !== "function") {
        console.log("error为必填回调函数！");
    }
    var ajax;
    if (arguments.length == 5) {
        ajax= $.ajax({
            url: url_web,
            type: "POST",
            async: async,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: data_str,
            success: callback,
            error: error
        });
    }
    else if (arguments.length == 4) {
        //无参；回调
        if (typeof (arguments[2]) == "function") {
            ajax= $.ajax({
                url: url_web,
                type: "POST",
                async: async,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: "",
                success: arguments[2],
                error: error
            });
        }
        else {
            //有参数；无回调
            ajax= $.ajax({
                url: url_web,
                type: "POST",
                async: async,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: data_str,
                error: error
            });
        }
    }
    else if (arguments.length == 3) {
        //无参无回调
        ajax= $.ajax({
            url: url_web,
            type: "POST",
            async: async,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: "",
            error: error
        });
    }
    return ajax;
}
function post_json_d(url_str, async, data_str, Cors, transType, callback) {
    var url_web;
    var data_type;
    if ($.isArray(url_str) == true) {
        url_web = url_str[0] + url_str[1];
    } else if (typeof (url_str) === "string") {
        url_web = this._baseUrl + url_str;
    }
    var ajax;
    //是否跨域
    if (Cors == true) {
        data_type = "jsonp";
        if (arguments.length == 6) {
            ajax= $.ajax({
                url: url_web,
                crossDomain: true,
                type: "GET",
                jsonp: "jsoncallback",
                async: arguments[1],
                dataType: data_type,
                data: arguments[2],
                success: callback,
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
        else if (arguments.length == 5) {
            ajax= $.ajax({
                url: url_web,
                crossDomain: true,
                type: "GET",
                async: arguments[1],
                dataType: data_type,
                jsonp: "jsoncallback",
                data: "",
                success: arguments[4],
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
    }
    else {
        data_type = "json";
        if (arguments.length == 6) {
            ajax= $.ajax({
                url: url_web,
                type: transType,
                async: arguments[1],
                dataType: data_type,
                contentType: "application/json; charset=utf-8",
                data: arguments[2],
                success: callback,
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
        else if (arguments.length == 5) {
            ajax= $.ajax({
                url: url_web,
                type: transType,
                async: arguments[1],
                dataType: data_type,
                contentType: "application/json; charset=utf-8",
                data: "",
                success: arguments[4],
                error: function (x, e) {
                    if (x.responseText === undefined) {
                        console.log(x.responseText);
                    }
                    else {
                        console.log(x);
                    }
                }
            });
        }
    }
    return ajax;
}

function post(url, obj) {
    var result;
    $.post(url, obj, function (data) {
        result = data;
    });
    return result;
}
function get(url, obj) {
    var result;
    $.get(url, obj, function (data) {
        result = data;
    });
    return result;
}
function serialize(obj, isStrict) {
    if (arguments.length == 1
          || (arguments.length == 2 && isStrict == false)) {
        if (obj == null
            || obj === undefined
            || $.isEmptyObject(obj)) {
            return "";
        }
        else {

            return Sys.Serialization.JavaScriptSerializer.serialize(obj);
        }
    }
    else {//最终版，没有此标志都有问题
        if (obj == null
            || obj === undefined
            || $.isEmptyObject(obj)) {
            if ($.isArray(obj) && obj.length == 0) {
                return "[]";
            }
            else {
                return obj.toString();
            }
        }
        else {
            return Sys.Serialization.JavaScriptSerializer.serialize(obj);
        }
    }
}
function deserialize(jsonString, isStrict) {
    if (arguments.length == 1
      || (arguments.length == 2 && isStrict == false)) {
        if (jsonString == "[]"
            || jsonString === "{}"
            || jsonString === undefined
            || $.trim(jsonString) === "") {
            return null;
        }
        else {
            result = Sys.Serialization.JavaScriptSerializer.deserialize(jsonString);
            for (var property in result) {
                if (result[property]==null
                    ||result[property].toString() === "[]"
                    || result[property].toString() === "undefined"
                    || result[property].toString() === "{}"
                    || result[property].toString() === "") {
                    result[property] = null;
                }
            }
            return result;
        }
    }
    else {
        if (jsonString === "[]") {
            return [];
        }
        else if (jsonString === undefined) {
            return undefined;
        }
        else if (jsonString === "{}") {
            return {};
        }
        else if ($.trim(jsonString) === "") {
            return "";
        }
        else {
            var result = Sys.Serialization.JavaScriptSerializer.deserialize(jsonString);
            for (var property in result) {
                if (result[property] === "[]") {
                    result[property] = [];
                }
                else if (result[property] === "undefined") {
                    result[property] = undefined;
                }
                else if (result[property] === "{}") {
                    result[property] = {};
                }
            }
            return result;
        }
    }
}
function setCookie(name, value, domain) {

    if (name != "" && (value != null && value != undefined)) {
        if (arguments.length == 3) {
            $.cookie(name, value, { path: "/", expires: 1, domain: arguments[2] });
        }
        else {
            $.cookie(name, value, { path: "/", expires: 1, domain: "miic.com.cn" });
        }

    }
    else if (name == "" && (value != null && value != undefined)) {
        $.Alert("name不能为空！");
    }
    else if (name != "" && (value == null || value == undefined)) {
        $.Alert("value不能为null！");
    }
    else {
        $.Alert("name不能为空,value不能为null或undefined！");
    }
}
function getCookie(name) {
    if ($.cookie(name) && $.cookie(name) != "null") {
        return $.cookie(name);
    }
    else {
        return null;
    }
}
function clearCookie(name, domain) {
    if (arguments.length == 2) {
        $.cookie(name, null, { path: "/", domain: arguments[1], expires: -1 });
    }
    else {
        $.cookie(name, null, { path: "/", domain: "miic.com.cn", expires: -1 });
    }
}
function get_url_param(name) {
    if (name != null && name != undefined && name != "") {
        return $.url().param(name);
    }

}
function get_url() {
    var baseUrl = $.url().attr("protocol").toString() + "://" + $.url().attr("host").toString() + $.url().attr("path").toString();
    return baseUrl;
}
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function NewGuid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function getBaseUrl() {
    return this._baseUrl;
}
function setBaseUrl(value) {
    this._baseUrl = value;
}

function getUri(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function formatTime(value) {
    var t = new Date(parseInt(value.replace("/Date(", "").replace(")/", "")));
    var timeObj = {
        time: t,
        timeStr: t.getFullYear() + "-" + ((t.getMonth() + 1) < 10 ? "0" + (t.getMonth() + 1) : (t.getMonth() + 1)) + "-" + (t.getDate() < 10 ? "0" + t.getDate() : t.getDate())
    }
    return timeObj;
}

function isNullOrEmpty(value) {
    if (value === null || value === "" || value === undefined) {
        return true;
    } else {
        return false;
    }
}
//创建跨域localstorage基础条件
function create_cors_localstorage(cors) {
    if ($.isArray(cors) == true) {
        if (cors.length >= 1) {
            var temp = "";
            $.each(cors, function (index, item) {
                temp += " <iframe id='ifrmCors" + index + "' src='" + item.Url + "cors.html' style='display:none;'></iframe>";
            });
            $("#divMiicCors").empty().append(temp);
        }
        else {
            throw Error.argumentOutOfRange("cors", cors);
        }
    }
    else {
        throw Error.argumentType("cors", null, Array, "参数类型不符");
    }

}
//发送消息
function post_cors_message(cors, data) {
    if ($.isArray(cors) == true) {
        if (arguments.length != 2) {
            throw Error.parameterCount("参数个数不正确！");
        }
        if (cors.length >= 1) {
            $.each(cors, function (index, item) {
                if (data === undefined && data === null) {
                    throw Error.argumentUndefined("data", "data不能为undefined或null！");
                }
                else {
                    $("#ifrmCors" + index)[0].contentWindow.postMessage({ MessageData: data }, item.Url);
                }
            });
        }
        else {
            throw Error.argumentOutOfRange("cors", cors);
        }
    }
}
function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}
function isArrayValueEqual(a, b) {
    var array_compare = false;
    if (a.length > 0
        && a.length == a.length) {
        a.sort(function (a, b) {
            return a.ID - b.ID;
        });
        b.sort(function (a, b) {
            return a.ID - b.ID;
        });
        array_compare = true;
        $.each(a, function (index, item) {
            if (item.label !== b[index].Name) {
                array_compare = false;
                return false;
            }
        });
    }
    else {
        array_compare = true;
    }
    return array_compare;
}



//金额￥
function get_rm(val,no_free) {
    var result = "";
    if (parseFloat(val) === 0) {
        if (!no_free) {
            result = "免费";
        } else {
            result = "￥0.00";
        }
    } else {
        var price_str = (parseInt(parseFloat(val) * 100)).toString();
        var price_length = price_str.length;
        var end;
        if (price_length == 1) {
            end = "0" + price_str;
            result = "￥0." + end;
        } else if (price_length == 2) {
            end = price_str;
            result = "￥0." + end;
        } else {
            end = price_str.substr(price_str.length - 2);
            result = "￥" + price_str.substr(0, price_str.length - 2) + "." + end;
        }
    }
    return result;
}

function encode_uri(uri) {
    return window.btoa(unescape(encodeURIComponent(uri)));
}

function decode_uri(encode_uri) {
    return decodeURIComponent(escape(window.atob(encode_uri)));
}

function get_decode_uri(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decode_uri(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

/** 数字金额大写转换(可以处理整数,小数,负数) */
function small_to_big(n) {
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);

    var s = '';

    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

function formatFloat(f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
}

$.extend({
    "NewGuid": NewGuid,
    "GetUrl": get_url,
    "GetBaseUrl": getBaseUrl,
    "SetBaseUrl": setBaseUrl,
    "Deserialize": deserialize,
    "Serialize": serialize,
    "SetCookie": setCookie,
    "GetCookie": getCookie,
    "ClearCookie": clearCookie,
    "GetUrlParam": get_url_param,
    "AjaxPost": post_json_d,
    "SimpleAjaxPost": simple_post_json,
    "SimpleAjaxPostWithForm": simple_post_json_with_form,
    "SimpleAjaxPostWithError":simple_post_json_err,
    "JsonpAjax": ajax_jsonp,
    "SimpleJsonpAjax": simple_ajax_jsonp,
    "SimpleJsonpAjaxWithError":simple_ajax_jsonp_err,
    "AjaxCors": ajax_json_cors,
    "SimpleAjaxCors": simple_ajax_json_cors,
    "SimpleAjaxCorsWithError": simple_ajax_json_cors_err,
    "CreateCorsLocalStorage": create_cors_localstorage,
    "PostCorsMessage": post_cors_message,
    "Post": post,
    "Get": get,
    "GetUri": getUri,
    "FormatDBTime": formatTime,
    "IsNullOrEmpty": isNullOrEmpty,
    "IsObjectValueEqual": isObjectValueEqual,
    "IsArrayValueEqual":isArrayValueEqual,
    "GetRmStr": get_rm,
    "EncodeUri": encode_uri,
    "DecodeUri": decode_uri,
    "GetDecodeUri": get_decode_uri,
    "SmallToBig": small_to_big,
    "FormatFloat":formatFloat
});

