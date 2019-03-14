if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
    (function ($) {
        $.fn.wordExport = function (fileName) {
            fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
            var static = {
                mhtml: {
                    top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                    head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                    body: "<body>_body_</body>"
                }
            };
            var options = {
                maxWidth: 624
            };
            // Clone selected element before manipulating it
            var markup = $(this).clone();

            // Remove hidden elements from the output
            markup.each(function () {
                var self = $(this);
                if (self.is(':hidden'))
                    self.remove();
            });

            // Embed all images using Data URLs
            var images = Array();
            var img = markup.find('img');
            for (var i = 0; i < img.length; i++) {
                // Calculate dimensions of output image
                var w = Math.min(img[i].width, options.maxWidth);
                var h = img[i].height * (w / img[i].width);
                // Create canvas for converting image to data URL
                var canvas = document.createElement("CANVAS");
                canvas.width = w;
                canvas.height = h;
                // Draw image to canvas
                var context = canvas.getContext('2d');
                context.drawImage(img[i], 0, 0, w, h);
                // Get data URL encoding of image
                var uri = canvas.toDataURL("image/png");
                $(img[i]).attr("src", img[i].src);
                img[i].width = w;
                img[i].height = h;
                // Save encoded image to array
                images[i] = {
                    type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
                    encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
                    location: $(img[i]).attr("src"),
                    data: uri.substring(uri.indexOf(",") + 1)
                };
            }

            // Prepare bottom of mhtml file with image data
            var mhtmlBottom = "\n";
            for (var i = 0; i < images.length; i++) {
                mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
                mhtmlBottom += "Content-Location: " + images[i].location + "\n";
                mhtmlBottom += "Content-Type: " + images[i].type + "\n";
                mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
                mhtmlBottom += images[i].data + "\n\n";
            }
            mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

            //TODO: load css from included stylesheet
            var styles = "<!--  /* Font Definitions */ "
            styles += "@font-face {";
            styles += "      font-family: 宋体;";
            styles += "      panose-1: 2 1 6 0 3 1 1 1 1 1;";
            styles += "      mso-font-alt: SimSun;";
            styles += "      mso-font-charset: 134;";
            styles += "      mso-generic-font-family: auto;";
            styles += "      mso-font-pitch: variable;";
            styles += "      mso-font-signature: 3 680460288 22 0 262145 0;";
            styles += "}";

            styles += "@font-face {";
            styles += "      font-family: 'Cambria Math';";
            styles += "      panose-1: 2 4 5 3 5 4 6 3 2 4;";
            styles += "      mso-font-charset: 0;";
            styles += "      mso-generic-font-family: roman;";
            styles += "      mso-font-pitch: variable;";
            styles += "      mso-font-signature: 3 0 0 0 1 0;";
            styles += "}";

            styles += " @font-face {";
            styles += "      font-family: 宋体;";
            styles += "      panose-1: 2 1 6 0 3 1 1 1 1 1;";
            styles += "      mso-font-charset: 134;";
            styles += "      mso-generic-font-family: auto;";
            styles += "      mso-font-pitch: variable;";
            styles += "      mso-font-signature: 3 680460288 22 0 262145 0;";
            styles += "}";
            /* Style Definitions */
            styles += "p.MsoNormal, li.MsoNormal, div.MsoNormal {";
            styles += "      mso-style-unhide: no;";
            styles += "      mso-style-qformat: yes;";
            styles += "      mso-style-parent: '';";
            styles += "      margin: 0cm;";
            styles += "      margin-bottom: .0001pt;";
            styles += "      mso-pagination: widow-orphan;";
            styles += "      font-size: 12.0pt;";
            styles += "      font-family: 宋体;";
            styles += "      mso-bidi-font-family: 宋体;";
            styles += "}";

            styles += "p.msonormal0, li.msonormal0, div.msonormal0 {";
            styles += "      mso-style-name: msonormal;";
            styles += "      mso-style-unhide: no;";
            styles += "      mso-margin-top-alt: auto;";
            styles += "      margin-right: 0cm;";
            styles += "      mso-margin-bottom-alt: auto;";
            styles += "      margin-left: 0cm;";
            styles += "      mso-pagination: widow-orphan;";
            styles += "      font-size: 12.0pt;";
            styles += "      font-family: 宋体;";
            styles += "      mso-bidi-font-family: 宋体;";
            styles += "}";

            styles += "span.GramE {";
            styles += "      mso-style-name: '';";
            styles += "      mso-gram-e: yes;";
            styles += "}";

            styles += ".MsoChpDefault {";
            styles += "      mso-style-type: export-only;";
            styles += "      mso-default-props: yes;";
            styles += "      font-size: 10.0pt;";
            styles += "      mso-ansi-font-size: 10.0pt;";
            styles += "      mso-bidi-font-size: 10.0pt;";
            styles += "      mso-ascii-font-family: 'Times New Roman';";
            styles += "      mso-hansi-font-family: 'Times New Roman';";
            styles += "      mso-font-kerning: 0pt;";
            styles += "}";

            styles += "@page WordSection1 {";
            styles += "      size: 595.3pt 841.9pt;";
            styles += "      margin: 36.0pt 36.0pt 36.0pt 36.0pt;";
            styles += "      mso-header-margin: 42.55pt;";
            styles += "      mso-footer-margin: 49.6pt;";
            styles += "      mso-paper-source: 0;";
            styles += "}";

            styles += " div.WordSection1 {";
            styles += "      page: WordSection1;";
            styles += "}";
            styles += "-->";
            // Aggregate parts of the file together
            var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

            // Create a Blob with the file contents
            var blob = new Blob([fileContent], {
                type: "application/msword;charset=utf-8"
            });
            saveAs(blob, fileName + ".doc");
        };
    })(jQuery);
} else {
    if (typeof jQuery === "undefined") {
        console.error("jQuery Word Export: missing dependency (jQuery)");
    }
    if (typeof saveAs === "undefined") {
        console.error("jQuery Word Export: missing dependency (FileSaver.js)");
    }
}
