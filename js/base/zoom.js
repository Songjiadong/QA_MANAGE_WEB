(function(e) {
    function u(u) {
        if (!!$(this).data("Wait") && $(this).data("Wait") == true) {
            return false;
        }

		function c() {
		    function h(e) {
		        $("html").css("overflow-y","hidden");
		        $(".mask").show();
		        $(".dialog-imglist").show();
				n.removeClass("loading");
				e.show();
			}
			var t = e(this),
				r = parseInt(n.css("borderLeftWidth")),
                //s-容器宽 o-容器高
                //r- 一般为0 
				i = s - r * 2,
				u = o - r * 2,
				a = t.width() == 0 ? this.width : t.width(),
				f = t.height() == 0 ? this.height : t.height();
				mwidth = t.width();
				mheight = t.height();

			if (a == n.width() && a <= i && f == n.height() && f <= u) {
				h(t);
				return
			}
			if (a > i || f > u) {
				var l = u < f ? u : f,
					c = i < a ? i : a;
				if (l / f <= c / a) {
					t.width(a * l / f);
					t.height(l)
				} else {
					t.width(c);
					t.height(f * c / a)
				}
			}

			var aw = t.width() == 0 ? this.width : t.width(),
			    ah = t.height() == 0 ? this.height : t.height();

			n.animate({
			    width: aw,
			    height: ah,
			    marginTop: -(ah / 2) - r,
				marginLeft: -(aw / 2) - r
			}, 100, function() {
			    var image = $("<img/>").attr("src", e("#zoom .content>img").attr("src"));
			    var image_content = e("#zoom .content");
			    if (image_content.width() == image[0].width && image_content.height() == image[0].height) {
			        $("#zoom .zoom-in").hide();
			    } else {
			        $("#zoom .zoom-in").show();
			    }
			    h(t);
			})
		}
		if (u) u.preventDefault();
		var a = e(this),
			f = a.attr("href");
		if (!f) return;
		var l = e(new Image).hide();
		e("#zoom .previous, #zoom .next").show();
		if (a.hasClass("zoom") || $(".slide-item").find("li").length == 1) e("#zoom .previous, #zoom .next").hide();
		if (!r) {
			r = true;
			t.show();
			e(".imglist").addClass("zoomed")
		}
		n.html(l).delay(500).addClass("loading");
		l.load(c).attr("src", f);
		i = a
	}

	// 上一页
    function a() {
        var t = i.closest("li").prev();
        if (t.length == 0) {
            t = i.closest("li").parent("ul").prev();
            if (t.length == 0) {
                var temp_li = $(".slide-item").find("li");
                t = $(".slide-item").find("li:eq(" + (temp_li.length - 1) + ")");
            } else {
                t = t.find("li:last-child");
            }
        }
        t.find("a").trigger("click")
    }

	// 下一页
	function f() {
	    var t = i.closest("li").next();
		if (t.length == 0) {
		    t = i.closest("li").parent("ul").next();
		    if (t.length == 0) {
		        t = $(".slide-item").find("li:eq(0)");
		    } else {
		        t = t.find("li:first-child");
		    }
		}
		t.find("a").trigger("click")
	}


    // 关闭预览
	function l(s) {
	    if (s) s.preventDefault();
	    r = false;
	    i = null;
	    var lsStr = "";
	    lsStr += '<a class="zoom-in"></a>';
	    lsStr += '<a href="#previous" class="previous"></a>';
	    lsStr += '<a href="#next" class="next"></a>';
	    lsStr += '<div class="content loading"></div>';
		lsStr += '</div>';
	    t.hide().empty().append(lsStr);
	    n = e("#zoom .content"),
		r = false,
		i = null,
		s = e(".imglist").width(),
		o = e(".imglist").height();
        e(".imglist").removeClass("zoomed").css("overflow", "auto");

        $(".mask").hide();
        $(".dialog-imglist").hide();
        $("html").css("overflow-y", "scroll");
	}

    // 图片放大
	function z() {
	    var image = $("<img/>").attr("src", e("#zoom .content>img").attr("src"));
		if (e(window).height()>image[0].height) {
			var imgTop = (e(window).height()/2)-(image[0].height/2);
			var imgLeft = (e(window).width()/2)-(image[0].width/2);
			if (imgLeft<0) imgLeft = 0;
			image.css({
				"top": imgTop + "px",
				"left": imgLeft + "px",
				"position": "absolute"
			});
		}
	    e(".mask").append(image);
	    e(".dialog-imglist").hide();
	    image.on("click", function () {
	        e(this).remove();
	        e(".dialog-imglist").show();
	    });
	}

	// 图片大小以区域为准
	function c() {
		s = e(window).width();
		o = e(window).height();
	}

	var zoomStr = "";
	zoomStr += '<div id="zoom">';
	zoomStr += "<a class='zoom-in'></a>";
	zoomStr += '<a href="#previous" class="previous"></a>';
	zoomStr += '<a href="#next" class="next"></a>';
	zoomStr += '<div class="content loading"></div>';
	zoomStr += '</div>';
	e(".imglist").append(zoomStr);

	var t = e("#zoom").hide(),
		n = e("#zoom .content"),
		r = false,
		i = null,
		s = e(".imglist").width(),
		o = e(".imglist").height();

    (function () {
		e(document).on("click","#zoom", function(t) {
			t.preventDefault();
		});
		e(document).on("click", ".imglist-close", l);
		e(document).on("click", "#zoom .zoom-in", z);
		e(document).on("click", "#zoom .previous", a);
		e(document).on("click", "#zoom .next", f);
		e(document).keydown(function(e) {
			if (!i) return;
			if (e.which == 38 || e.which == 40) e.preventDefault();
			if (e.which == 27) l();
			if (e.which == 37 && !i.hasClass("zoom")) a();
			if (e.which == 39 && !i.hasClass("zoom")) f()
		});
		e(document).on("click", ".zoom-item", u);
	})();

	// 窗口变化
	(function() {
		e(".imglist").on("resize", c)
	})();
})(jQuery);