/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */
! function(a) {
    "use strict";
    jQuery(function() {
        var b = jQuery(window),
            c = jQuery(document.body);
        c.scrollspy({
            target: ".bs-docs-sidebar"
        }), b.on("load", function() {
            c.scrollspy("refresh")
        }), jQuery(".bs-docs-container [href=#]").click(function(a) {
            jQuery.preventDefault()
        }), setTimeout(function() {
            var b = jQuery(".bs-docs-sidebar");
            b.affix({
                offset: {
                    top: function() {
                        var c = b.offset().top,
                            d = parseInt(b.children(0).css("margin-top"), 10),
                            e = jQuery(".bs-docs-nav").height();
                        return this.top = c - e - d
                    },
                    bottom: function() {
                        return this.bottom = jQuery(".bs-docs-footer").outerHeight(!0)
                    }
                }
            })
        }, 100), setTimeout(function() {
            jQuery(".bs-top").affix()
        }, 100),
        function() {
            var b = jQuery("#bs-theme-stylesheet"),
                c = jQuery(".bs-docs-theme-toggle"),
                d = function() {
                    b.attr("href", b.attr("data-href")), c.text("Disable theme preview"), localStorage.setItem("previewTheme", !0)
                };
            localStorage.getItem("previewTheme") && d(), c.click(function() {
                var a = b.attr("href");
                a && 0 !== jQuery.indexOf("data") ? (b.attr("href", ""), c.text("Preview theme"), localStorage.removeItem("previewTheme")) : d()
            })
        }(), jQuery(".tooltip-demo").tooltip({
            selector: '[data-toggle="tooltip"]',
            container: "body"
        }), jQuery(".popover-demo").popover({
            selector: '[data-toggle="popover"]',
            container: "body"
        }), jQuery(".tooltip-test").tooltip(), jQuery(".popover-test").popover(), jQuery(".bs-docs-popover").popover(), jQuery("#loading-example-btn").on("click", function() {
            var b = jQuery(this);
            b.button("loading"), setTimeout(function() {
                b.button("reset")
            }, 3e3)
        }), jQuery("#exampleModal").on("show.bs.modal", function(b) {
            var c = jQuery(b.relatedTarget),
                d = c.datjQuery("whatever"),
                e = jQuery(this);
            e.find(".modal-title").text("New message to " + d), e.find(".modal-body input").val(d)
        }), jQuery(".bs-docs-activate-animated-progressbar").on("click", function() {
            jQuery(this).siblings(".progress").find(".progress-bar-striped").toggleClass("active")
        });
        // ZeroClipboard.config({
        //     moviePath: "http://getbootstrap.com/assets/flash/ZeroClipboard.swf",
        //     hoverClass: "btn-clipboard-hover"
        // }), jQuery(".highlight").each(function() {
        //     var b = '<div class="zero-clipboard"><span class="btn-clipboard">Copy</span></div>';
        //     jQuery(this).before(b)
        // });
        // var d = new ZeroClipboard(jQuery(".btn-clipboard")),
        //     e = jQuery("#global-zeroclipboard-html-bridge");
        // d.on("load", function() {
        //     e.datjQuery("placement", "top").attr("title", "Copy to clipboard").tooltip()
        // }), d.on("dataRequested", function(b) {
        //     var c = jQuery(this).parent().nextAll(".highlight").first();
        //     b.setText(c.text())
        // }), d.on("complete", function() {
        //     e.attr("title", "Copied!").tooltip("fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("fixTitle")
        // }), d.on("noflash wrongflash", function() {
        //     e.attr("title", "Flash required").tooltip("fixTitle").tooltip("show")
        // })
    })
}(jQuery);
