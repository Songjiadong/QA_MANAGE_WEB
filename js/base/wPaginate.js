/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This websanova jQuery pagination plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github			http://github.com/websanova/wPaginate
 * @version         Version 1.0.5
 *
 ******************************************/

(function ($) {
    $.fn.wPaginate = function (option, settings) {
        if (typeof option === 'object') {
            settings = option;
        }
        else if (typeof option === 'string') {
            var values = [];

            var elements = this.each(function () {
                var data = $(this).data('_wPaginate');

                if (data) {
                    if (option === 'destroy') data.destroy();
                    else if ($.fn.wPaginate.defaultSettings[option] !== undefined) {
                        if (settings !== undefined) { data.settings[option] = settings; }
                        else { values.push(data.settings[option]); }
                    }
                }
            });

            if (values.length === 1) { return values[0]; }
            if (values.length > 0) { return values; }
            else { return elements; }
        }

        return this.each(function () {
            var $elem = $(this);
            var _settings = $.extend({}, $.fn.wPaginate.defaultSettings, settings || {});

            var paginate = new Paginate(_settings, $elem);
            var $el = paginate.generate();
            //如果总数为0则不显示分页区
            if (_settings.total != 0) {
                $elem.append($el);
            }
            $elem.data('_wPaginate', paginate);
        });
    }

    $.fn.wPaginate.defaultSettings = {
        pid: '',
        theme: 'black',		// theme for plugin to use
        first: '<<',			// html for first page link (null for no link)
        prev: '<',			// html for prev page link (null for no link)
        next: '>',			// html for next page link (null for no link)
        last: '>>',		    // html for last page link (null for no link)
        all: '',
        page: '5,10,20',
        // defPage: '10',
        go: '跳至',
        spread: 5,			// number of links to display on each side (total 11)
        total: 400,			// total number of results
        index: 0,			// current index (0, 20, 40, etc)
        limit: 20,			// increment for index (limit)
        url: '#', 			// url for pagination (also accepts function ex: function(i){ return '/path/' + i*this.settings.limit; })
        ajax: false			// if ajax is set to true url will execute as a function only
    };

    function Paginate(settings, $elem) {
        this.paginate = null;
        this.settings = settings;
        this.$elem = $elem;

        return this;
    }

    Paginate.prototype =
	{
	    generate: function () {
	        if (this.paginate) return this.paginate;

	        this.paginate = $('<div class="_wPaginate_holder _wPaginate_' + this.settings.theme + '"></div>');

	        this.generateLinks();

	        return this.paginate;
	    },
	    generateLinks: function () {
	        var totalPages = Math.ceil(this.settings.total / this.settings.limit);
	        var visiblePages = this.settings.spread * 2 + 1;
	        var currentPage = Math.ceil(this.settings.index / this.settings.limit);
	        var start = 0, end = 0;

	        // console.log(totalPages + ':' + visiblePages)
	        // show or hidden buttons include first,last,prev,next
	        if (totalPages == 1) {
	            this.settings.first = null;
	            this.settings.last = null;
	        } else if (totalPages <= 6 && totalPages > 1) {
	            this.settings.first = null;
	            this.settings.last = null;
	        }

	        // get start and end page
	        if (totalPages <= visiblePages) { start = 0; end = totalPages; }
	        else if (currentPage < this.settings.spread) { start = 0; end = visiblePages; }
	        else if (currentPage > totalPages - this.settings.spread - 1) { start = totalPages - visiblePages; end = totalPages; }
	        else { start = currentPage - this.settings.spread; end = currentPage + this.settings.spread + 1; }

	        this.paginate.html('');

	        // generate links
	        if (this.settings.first) this.paginate.append(this.getLink(0, 'first'));
	        if (this.settings.prev) this.paginate.append(this.getLink(currentPage === 0 ? 0 : currentPage - 1, 'prev'));

	        for (var i = start; i < end; i++) this.paginate.append(this.getLink(i, i * this.settings.limit === this.settings.index ? 'active' : null));

	        if (this.settings.next) this.paginate.append(this.getLink(currentPage === totalPages - 1 ? totalPages - 1 : currentPage + 1, 'next'));
	        if (this.settings.last) this.paginate.append(this.getLink(totalPages - 1, 'last'));
	        this.paginate.append(this.getLink(totalPages, 'all'))

	        if (this.settings.page) {
	            this.paginate.append(this.getLink(totalPages, 'page'))
	        }
	        if (this.settings.go) {
	            this.paginate.append(this.getLink(totalPages, 'go'))
	            this.paginate.append(this.getLink(totalPages + 1, 'goto'))
	        }

	    },

	    getLink: function (i, key) {
	        if (key == "all") {
	            if (this.settings.ajax) {
	                var _self = this;
	                return $('<span style=" margin-left:5px;margin-right:5px;color:#999">' + _self.settings.total + '条</span>');
	            }
	            else {
	                var url = typeof (this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i * this.settings.limit;
	                return $('<a href="' + url + '" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></a>').html(this.settings[key] || (i + 1));
	            }
	        }
	        if (key == "page") {
	            if (this.settings.ajax) {
	                var _self = this;
	                var temp = "";
	                for (var j = 0; j < this.settings[key].split(',').length; j++) {
	                    if (this.settings[key].split(',')[j] == _self.settings.limit) {
	                        temp += "<option value='" + this.settings[key].split(',')[j] + "' selected='selected'>" + this.settings[key].split(',')[j] + "条/页</option>";
	                    }
	                    else {
	                        temp += "<option value='" + this.settings[key].split(',')[j] + "'>" + this.settings[key].split(',')[j] + "条/页</option>";
	                    }

	                }
	                return $('<select class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '">' + temp + '</select>').change(function () {
	                    _self.settings.limit = $(this).val()
	                    _self.settings.index = 0 * _self.settings.limit;
	                    _self.generateLinks();
	                    _self.settings.url.apply(_self, [0]);
	                });
	                $("._wPaginate_link_page").before($('<span>222</span>'))
	            }
	            else {
	                var url = typeof (this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i * this.settings.limit;
	                return $('<a href="' + url + '" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></a>').html(this.settings[key] || (i + 1));
	            }
	        }
	        else if (key == "go") {
	            if (this.settings.ajax) {
	                var _self = this;
	                return $('<span class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></span>').html(this.settings[key])
                    .click(function () {
                        var $page_val = _self.settings.pid && _self.settings.pid != "" ? $("#" + _self.settings.pid + " ._wPaginate_link_goto").val() : $("._wPaginate_link_goto").val();
                        if ($page_val == "") {
                            $.Alert("请输入页数！");
                        }
                        else {
                            var page = parseInt($page_val);
                            var totalPages = Math.ceil(_self.settings.total / _self.settings.limit);
                            if (page > 0 && page <= totalPages) {
                                var sIndex = page - 1;
                                _self.settings.index = sIndex * _self.settings.limit;
                                _self.generateLinks();
                                _self.settings.url.apply(_self, [sIndex]);
                            } else {
                                $.Alert("错误的页数！");
                            }
                        }
                    });
	            }
	            else {
	                var url = typeof (this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i * this.settings.limit;
	                return $('<a href="' + url + '" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></a>').html(this.settings[key] || (i + 1));
	            }
	        }
	        else if (key == "goto") {
	            if (this.settings.ajax) {
	                var _self = this;
	                return $('<input type="text" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '" style="width:40px;height:10px;line-height:13px;padding:3px 5px"/><span style=" margin-left:10px;color:#999">页</span>')
                        .keyup(function () {
                            var c = $(this);
                            if (/[^\d]/.test(c.val())) {
                                var temp_amount = c.val().replace(/[^\d]/g, '');
                                c.val(temp_amount);
                            } else {
                                var page = parseInt(c.val());
                                var totalPages = Math.ceil(_self.settings.total / _self.settings.limit);
                                if (page == 0 || page > totalPages) {
                                    c.val("");
                                }
                            }
                        }).keypress(function (event) {
                            var c = $(this);
                            if (event.keyCode == 13) {
                                var $page_val = c.val();
                                if ($page_val == "") {
                                    $.Alert("请输入页数！");
                                }
                                else {
                                    var sIndex = parseInt($page_val) - 1;
                                    _self.settings.index = sIndex * _self.settings.limit;
                                    _self.generateLinks();
                                    _self.settings.url.apply(_self, [sIndex]);
                                }
                            }
                        });
	            }
	            else {
	                var url = typeof (this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i * this.settings.limit;
	                return $('<a href="' + url + '" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></a>').html(this.settings[key] || (i + 1));
	            }
	        }
	        else if (key == "prev") {
	            if (this.settings.ajax) {
	                var _self = this;
	                return $('<span class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></span>')
                    .click(function () {
                        _self.settings.index = i * _self.settings.limit;
                        _self.generateLinks();
                        _self.settings.url.apply(_self, [i]);
                    });
	            }
	            else {
	                var url = typeof (this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i * this.settings.limit;
	                return $('<a href="' + url + '" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></a>').html(this.settings[key] || (i + 1));
	            }
	        }
	        else if (key == "next") {
	            if (this.settings.ajax) {
	                var _self = this;
	                return $('<span class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></span>')
                    .click(function () {
                        _self.settings.index = i * _self.settings.limit;
                        _self.generateLinks();
                        _self.settings.url.apply(_self, [i]);
                    });
	            }
	            else {
	                var url = typeof (this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i * this.settings.limit;
	                return $('<a href="' + url + '" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></a>').html(this.settings[key] || (i + 1));
	            }
	        }
	        else {
	            if (this.settings.ajax) {
	                var _self = this;
	                return $('<span class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></span>')
                    .html(this.settings[key] || (i + 1))
                    .click(function () {
                        _self.settings.index = i * _self.settings.limit;
                        _self.generateLinks();
                        _self.settings.url.apply(_self, [i]);
                    });
	            }
	            else {
	                var url = typeof (this.settings.url) === 'function' ? this.settings.url.apply(this, [i]) : this.settings.url + '/' + i * this.settings.limit;
	                return $('<a href="' + url + '" class="_wPaginate_link ' + (key ? '_wPaginate_link_' + key : '') + '"></a>').html(this.settings[key] || (i + 1));
	            }
	        }
	    },

	    destroy: function () {
	        this.paginate.remove();
	        this.$elem.removeData('_wPaginate');
	    },
	}
})(jQuery);