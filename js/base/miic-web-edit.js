// miicWebEdit插件 (含表情、提交按钮、字数提醒)
(function ($) {
    $.fn.miicWebEdit = function (options) {
        var defaults = {
            id: 'miicWebEdit',
            css: 'weibo-editor-short',
            placeholder: "请输入内容",
            faceid: "emotion",//-1时没有表情
            facePath: 'face/',
            submit: "submitbtn",
            charAllowed: 140,//-1时没有字数提示
            charWarning: 25,
            charCss: 'counter',
            charCounterElement: 'span',
            charCounterID: ''
        };

        var option = $.extend(defaults, options);
        var id = option.id;
        var css = option.css;
        var placeholder = option.placeholder;
        var submit = option.submit;
        var faceid = option.faceid;
        var facepath = option.facePath;
        var char_allowed = option.charAllowed;
        var char_warning = option.charWarning;
        var char_css = option.charCss;
        var char_counter_element = option.charCounterElement;
        var char_counter_id = option.charCounterID;
        var $this_d = document.getElementById(id);


        //如果存在字数监测 则保存原始绑定事件
        if (char_allowed != -1) {
            var submitObj = document.getElementById(submit);
            var src_event = $.data(submitObj, 'events') || $._data(submitObj, 'events');
            var src_click = src_event.click[0];
            $this_d.SrcClick = src_click;
        }

        $this_d.GetCharObj = function () {
            return {
                charAllowed: char_allowed,
                charWarning: char_warning,
                charCss: char_css,
                charCounterElement: char_counter_element,
                charCounterID: char_counter_id
            };
        }

        $this_d.GetFaceObj = function () {
            return {
                faceid: faceid,
                facePath: facepath,
                submit: submit
            };
        }

        $this_d.GetEditObj = function () {
            return {
                id: id,
                css: css,
                placeholder: placeholder
            };
        }

        //div可编辑
        if ($(this).attr("contenteditable") != "true") {
            $(this).attr("contenteditable", true);
        }

        //加载class
        if ($(this).hasClass(css) == false) {
            $(this).addClass(css);
        }

        //设置placeholder
        var $this = $(this);
        var $placeholder = $(this).clone();
        $(this).after($placeholder.removeAttr("id")).hide();//清除复制对象ID
        $placeholder.text(placeholder).focus(function (event) {//添加提示信息
            $this.show().focus();
            $placeholder.hide();
        });


        if (faceid != -1) {
            if ($("#" + faceid).length > 0) {
                //设置表情
                $("#" + faceid).miicFace({
                    id: 'facebox',
                    submit: submit,
                    assign: id,
                    path: facepath,
                    allowed: char_allowed
                });
            }

            $(this).blur(function () {
                setTimeout(function () {//判断表情框，延迟判断
                    if ($("#facebox").length == 0) {
                        if ($this.html() == "<br>" || $this.html() == "") {
                            $this.hide();
                            $placeholder.show();
                        }
                    }
                }, 100);
            });
        }

        if (char_allowed != -1) {
            //计算字数
            $(this).miicCharCount({
                id: char_counter_id,
                allowed: char_allowed,
                warning: char_warning,
                css: char_css,
                counterElement: char_counter_element,
                counterText: "还能输入&nbsp;",
                overText: "已经超出了&nbsp;"
            });
        }

        $(this).keyup(function (event) {
            $(this).setSubmitButton(id, submit, char_allowed);
        });



        //注册粘贴事件
        $this_d.addEventListener('paste', PasteHandleEvent);

        //图片粘贴处理事件
        function PasteHandleEvent(event) {
            //复制数据
            var clipboard_data = event.clipboardData || window.clipboardData;
            //复制目标dom
            var files = clipboard_data.items || clipboard_data.files;

            if (files) {
                var items = files,
                  len = items.length,
                  blob = null;
                //items.length比较有意思，初步判断是根据mime类型来的，即有几种mime类型，长度就是几（待验证）
                //如果粘贴纯文本，那么len=1，如果粘贴网页图片，len=2, items[0].type = 'text/plain', items[1].type = 'image/*'
                //如果使用截图工具粘贴图片，len=1, items[0].type = 'image/png'
                //如果粘贴纯文本+HTML，len=2, items[0].type = 'text/plain', items[1].type = 'text/html'
                 //console.log('len:' + len);
                 //console.log(items[0]);
                 //console.log(items[1]);
                 //console.log( 'items[0] kind:', items[0].kind );
                 //console.log( 'items[0] MIME type:', items[0].type );
                 //console.log( 'items[1] kind:', items[1].kind );
                 //console.log( 'items[1] MIME type:', items[1].type );

                //在items里找粘贴的image,据上面分析,需要循环  
                for (var i = 0; i < len; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        //console.log( typeof (items[i])); //火狐谷歌均为 DataTransferItem  对象 getAsFile==> base64 图片对象
                        //getAsFile() 此方法只是living standard firefox ie11 并不支持  IE直接获取的就是文件
                        blob = items[i].getAsFile ? items[i].getAsFile() : items[i];
                    }
                }
                if (blob !== null) {
                    //如果是图片 阻止默认行为即不让剪贴板内容在div中显示出来
                    event.preventDefault();

                    var reader = new FileReader();
                    reader.onload = function (event) {
                        // event.target.result 即为图片的Base64编码字符串
                        var base64_str = event.target.result
                        //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
                        var formData = new FormData();
                        formData.append('image', base64_str);
                        formData.append('submission-type', 'paste');
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/service/IMCutService.ashx', true);
                        xhr.onload = function () {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var data = JSON.parse(xhr.responseText);
                                    if (data.result == true) {
                                        var path = data.filePath;
                                        $this.insertImage(path);
                                    } else {
                                        console.log(data.Message);
                                    }
                                } else {
                                    console.log(xhr.statusText);
                                }
                            };
                        };
                        xhr.onerror = function (e) {
                            console.log(xhr.statusText);
                        }
                        xhr.send(formData);

                    }
                    reader.readAsDataURL(blob);
                }
            }
        }
    };

    $.fn.miicFace = function (options) {
        var defaults = {
            id: 'facebox',
            path: 'face/',
            assign: 'content',
            submit: 'submitbtn',
            allowed: 140
        };

        var option = $.extend(defaults, options);
        var assign = $('#' + option.assign);
        var id = option.id;
        var path = option.path;
        var submit = option.submit;
        var char_allowed = option.allowed;

        if (assign.length <= 0) {
            alert('缺少表情赋值对象。');
            return false;
        }

        $(this).click(function (e) {
            if (assign.next().is(":hidden") == false) {
                assign.next().hide();
                assign.show().focus();
            }
            var strFace, labFace;
            if ($('#' + id).length <= 0) {
                strFace = '<div id="' + id + '" style="position:absolute;display:none;z-index:1000;" class="qqFace">' +
							  '<table border="0" cellspacing="0" cellpadding="0"><tr>';
                for (var i = 1; i <= 75; i++) {
                    labFace = "<img class=\\'emotion\\' src=" + path + (i < 10 ? '0' + i : i) + ".gif />";
                    strFace += '<td><img src="' + path + (i < 10 ? '0' + i : i) + '.gif" onclick="$(\'#' + option.assign + '\').setCaret();$(\'#' + option.assign + '\').insertAtCaret(\'' + labFace + '\');$(\'#' + option.assign + '\').setSubmitButton(\'' + option.assign + '\',\'' + submit + '\',\'' + char_allowed + '\');" /></td>';
                    if (i % 15 == 0) strFace += '</tr><tr>';
                }
                strFace += '</tr></table></div>';
            }
            $(this).parent().append(strFace);
            var offset = $(this).position();
            var top = offset.top + $(this).outerHeight();
            $('#' + id).css('top', top);
            $('#' + id).css('left', offset.left);
            $('#' + id).show();
            e.stopPropagation();
        });

        $(document).click(function () {
            $('#' + id).hide();
            $('#' + id).remove();
        });

        //初始化禁用按钮
        $("#" + option.assign).setSubmitButton(option.assign, submit, char_allowed);
    };


    $.fn.miicCharCount = function (options) {
        // default configuration properties
        var defaults = {
            id: "",
            allowed: 140,
            warning: 25,
            css: 'counter',
            counterElement: 'span',
            cssWarning: 'warning',
            cssExceeded: 'exceeded',
            counterText: '',
            overText: ''
        };

        var options = $.extend(defaults, options);

        var $char_counter = options.id && options.id != "" ? $("#" + options.id) : $("." + options.css);

        if (!$char_counter || $char_counter.length == 0) return;

        function calculate(obj) {
            //表情处理-start
            var reg = "";
            var times = 0;
            reg = "/<img/g";
            reg = eval(reg);
            if ($(obj).html().match(reg) != null) {
                times = $(obj).html().match(reg).length;
            }

            if ($(obj).text().match(reg) != null) {
                times -= $(obj).text().match(reg).length;
            }

            var count = $(obj).text().length + times;

            if ($(obj).text().length > 0) {
                //汉字占位符1
                var insert_first_space = " ";
                //汉字占位符2
                var insert_other_space = " ";
                var content_end = $(obj).text().charAt($(obj).text().length - 1);;
                if ($(obj).text().length == 1) {
                    if (insert_first_space == content_end) {
                        count--;
                    }
                } else {
                    if (insert_other_space == content_end) {
                        count--;
                    }
                }
            }

            var available = options.allowed - count;
            if (available <= options.warning && available >= 0) {
                $char_counter.addClass(options.cssWarning);
            } else {
                $char_counter.removeClass(options.cssWarning);
            }
            if (available < 0) {
                $char_counter.addClass(options.cssExceeded);
            } else {
                $char_counter.removeClass(options.cssExceeded);
            }
            if (available >= 0) {
                $char_counter.html(options.counterText + "<span class='charType'>" + available + "</span>" + '&nbsp;字');
            } else {
                $char_counter.html(options.overText + "<span class='charType'>" + Math.abs(available) + "</span>" + '&nbsp;字');
            }
        };
        calculate(this);
        $(this).keyup(function (event) {
            calculate(this);
        });
    };
})(jQuery);

jQuery.extend({
    unselectContents: function () {
        if (window.getSelection)
            window.getSelection().removeAllRanges();
        else if (document.selection)
            document.selection.empty();
    }
});

jQuery.fn.extend({
    changeSrcClick: function () {
        var $this = $($(this).get(0));
        var assign = $this.attr("id");
        var edit = document.getElementById(assign);
        var char_obj = edit.GetCharObj();
        var face_obj = edit.GetFaceObj();

        //如果存在字数监测 则保存原始绑定事件
        if (char_obj.charAllowed != -1) {
            var submitObj = document.getElementById(face_obj.submit);
            var src_event = $.data(submitObj, 'events') || $._data(submitObj, 'events');
            var src_click = src_event.click[0];
            edit.SrcClick = src_click;
        }
    },
    setContents: function (content) {
        var $this = $($(this).get(0));
        $this.next().hide();
        $this.html(content).show().focus();

        var select;
        if (document.selection) {
            select = document.selection.createRange();
        } else if (document.getSelection) {
            select = document.getSelection();
        } else if (window.getSelection) {
            select = window.getSelection();
        }

        var explorer = navigator.userAgent.toLowerCase();
        if (explorer.match(/msie/) != null || explorer.match(/trident/) != null) {
            var range = select.getRangeAt(0);
            range.setStartAfter(select.focusNode, 0);
            select.removeAllRanges();
            select.addRange(range);
        }

        select.selectAllChildren(select.focusNode);

        if (explorer.match(/msie/) != null || explorer.match(/trident/) != null) {
            select.collapse(select.focusNode.parentNode, select.focusNode.parentNode.childNodes.length);
        } else {
            select.collapseToEnd();
        }
      
        var assign = $this.attr("id");
        var edit = document.getElementById(assign);
        var char_obj = edit.GetCharObj();
        var face_obj = edit.GetFaceObj();
        if (char_obj) {
            $this.miicCharCount({
                allowed: char_obj.charAllowed,
                warning: char_obj.charWarning,
                css: char_obj.charCss,
                counterElement: char_obj.charCounterElement,
                counterText: "还能输入&nbsp;",
                overText: "已经超出了&nbsp;"
            });
        }
        $this.setSubmitButton(assign, face_obj.submit, char_obj.charAllowed);
    },

    getContents: function () {
        var content = $(this).html();
        //兼容IE
        if (content == "<br>" || content == "<br/>") {
            content = "";
        }
        return content;
    },

    getCharState: function () {
        var result = true;
        var valLength = $(this).text().length;
        var allowed = 140;
        var reg = "";
        var times = 0;
        reg = "/<img/g";
        reg = eval(reg);
        if ($(this).html().match(reg) != null) {
            times = $(this).html().match(reg).length;
        }

        if ($(this).text().match(reg) != null) {
            times -= $(this).text().match(reg).length;
        }

        valLength += times;

        if (valLength > allowed || valLength == 0) {
            result = false;
        }

        return result;
    },

    selectContents: function () {
        $(this).each(function (i) {
            var node = this;
            var selection, range, doc, win;
            if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined') {
                range = doc.createRange();
                range.selectNode(node);
                if (i == 0) {
                    selection.removeAllRanges();
                }
                selection.addRange(range);
            } else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())) {
                range.moveToElementText(node);
                range.select();
            }
        });
    },

    setCaret: function () {
        var initSetCaret = function () {
            var textObj = $(this).get(0);
            if (document.selection != undefined) {
                textObj.caretPos = document.selection.createRange().duplicate();
            } else {
                textObj.caretPos = window.getSelection();
            }
        };
        $(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret);
    },

    insertAtCaret: function (textFeildValue) {
        var textObj = $(this).get(0);
        
        var select = window.getSelection();

        if (select.rangeCount != 0 && ($(this).find(select.focusNode).length != 0 || select.focusNode == textObj)) {//光标在输入框中
            var range = select.getRangeAt(0);
            range.deleteContents();
            var hasr = range.createContextualFragment(textFeildValue);
            var hasr_last_child = hasr.lastChild;
            while (hasr_last_child && hasr_last_child.nodeName.toLowerCase() == "br" && hasr_last_child.previousSibling && hasr_last_child.previousSibling.nodeName.toLowerCase() == "br") {
                var e = hasr_last_child;
                hasr_last_child = hasr_last_child.previousSibling;
                hasr.removeChild(e)
            }
            range.insertNode(hasr);
            if (hasr_last_child) {
                range.setEndAfter(hasr_last_child);
                range.setStartAfter(hasr_last_child)
            }
            select.removeAllRanges();
            select.addRange(range);
            $(this).focus();
        } else {
            $(this).html($(this).html() + textFeildValue);
        }
    },

    insertImage: function (path) {
        var img = "<img  src='" + path + "'/>";
        $(this).setContents(img);
    },

    setSubmitButton: function (assign, submit, char_allowed) {
        var allowed = char_allowed;
        if (allowed != -1) {
            var edit = document.getElementById(assign);
            var char_set = edit.GetCharObj();
            var $char_counter = char_set.charCounterID && char_set.charCounterID != "" ? $("#" + char_set.charCounterID) : $("." + char_set.charCss);
            var valLength = $("#" + assign).text().length;
            var reg = "";
            var times = 0;
            reg = "/<img/g";
            reg = eval(reg);
            if ($("#" + assign).html().match(reg) != null) {
                times = $("#" + assign).html().match(reg).length;
            }

            if ($("#" + assign).text().match(reg) != null) {
                times -= $("#" + assign).text().match(reg).length;
            }

            valLength += times;
            if (valLength > allowed || valLength == 0) {
                $("#" + submit).removeClass('btn-public-focus').attr("disabled", true);
                $("#" + submit).off("click");
            } else {
                $("#" + submit).addClass('btn-public-focus').attr("disabled", false);
                $("#" + submit).off("click").on("click", edit.SrcClick);
            }

            var available = allowed - valLength;
            if (available <= 20 && available >= 0) {
                $char_counter.addClass("warning");
            } else {
                $char_counter.removeClass("warning");
            }
            if (available < 0) {
                $char_counter.addClass("exceeded");
            } else {
                $char_counter.removeClass("exceeded");
            }
            if (available >= 0) {
                $char_counter.html("还能输入&nbsp;" + "<span class='charType'>" + available + "</span>" + '&nbsp;字');
            } else {
                $char_counter.html("已经超出了&nbsp;" + "<span class='charType'>" + Math.abs(available) + "</span>" + '&nbsp;字');
            }
        } else {
            $("#" + submit).attr("disabled", false);
        }
    }
});