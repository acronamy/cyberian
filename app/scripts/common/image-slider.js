"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CardCarouselStructure = (function () {
    function CardCarouselStructure(id) {
        this.theme = "#000"; //valid css color
        this.cycle = "infinite"; //todo
        this.target = "[data-component='card-carousel']";
        //yes these are real js media queries
        this.media = {
            xs: {
                show: 1,
                minWidth: "0px"
            },
            sm: {
                show: 2,
                minWidth: "768px"
            },
            md: {
                show: 3,
                minWidth: "992px"
            },
            lg: {
                show: 4,
                minWidth: "1200px"
            }
        };
        this.carousel = {
            size: {
                maxHeight: 400
            }
        };
        this.card = {
            size: {
                width: 300,
                height: 400,
                spacing: 30,
                units: "px",
                show: 4
            },
            placeholder: {
                background: "#000"
            }
        };
        this.target = id || this.target;
        this.uid = "_" + Math.random().toString(36).substr(2, 9);
        this.inner = this.root(".inner");
        this.rail = this.root(".inner .rail");
        this.cards = this.root(".inner .rail .card");
        this.cardsImage = this.root(".inner .rail .card img");
        this.ctrls = this.root(".inner .ctrl");
        this.playlistElements = this.root("template");
        //overides
        this.media.xs.show = parseInt($(this.target).data("xs-show")) || this.media.xs.show;
        this.media.sm.show = parseInt($(this.target).data("sm-show")) || this.media.sm.show;
        this.media.md.show = parseInt($(this.target).data("md-show")) || this.media.md.show;
        this.media.lg.show = parseInt($(this.target).data("md-show")) || this.media.lg.show;
        this.media.xs.minWidth = parseInt($(this.target).data("xs-minWidth")) || this.media.xs.minWidth;
        this.media.sm.minWidth = parseInt($(this.target).data("sm-minWidth")) || this.media.sm.minWidth;
        this.media.md.minWidth = parseInt($(this.target).data("md-minWidth")) || this.media.md.minWidth;
        this.media.lg.minWidth = parseInt($(this.target).data("md-minWidth")) || this.media.lg.minWidth;
        this.theme = $(this.target).data("theme") || this.theme;
    }
    CardCarouselStructure.prototype.root = function (selector) {
        return this.target + " " + selector;
    };
    CardCarouselStructure.prototype.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    };
    CardCarouselStructure.prototype.checkVisible = function () {
        $(this.cards).each(function () {
            var _this = this;
            var elem = $(this);
            //acount for animation
            setTimeout(function () {
                if (elem.offset().left + elem.outerWidth() < $(window).outerWidth()) {
                    $(_this).addClass("onscreen").removeClass("offscreen");
                }
                else {
                    $(_this).removeClass("onscreen").addClass("offscreen");
                }
            }, 500);
        });
    };
    CardCarouselStructure.prototype.recalculate = function () {
        //eficiently show the desired amount always in proportion
        var self = this;
        $(this.cards).each(function () {
            $(this).attr("style", self.cardCSS);
        });
        this.checkVisible();
        this.recentre();
    };
    CardCarouselStructure.prototype.recentre = function () {
        this.position = 0;
        this.current = 0;
        $(this.rail).animate({ left: this.position });
    };
    CardCarouselStructure.prototype.equalize = function () {
        var shortest = Infinity;
        //equalize get shortest
        $(this.cardsImage).each(function () {
            if ($(this).innerHeight() < shortest) {
                shortest = $(this).innerHeight();
            }
        });
        //apply
        $(this.cardsImage).each(function () {
            $(this).css({
                maxHeight: shortest + 'px'
            });
        });
    };
    CardCarouselStructure.prototype.orientation = function (src) {
        var orientation, img = new Image();
        return new Promise(function (resolve, reject) {
            img.onload = function () {
                if (img.naturalWidth > img.naturalHeight) {
                    orientation = 'landscape';
                }
                else if (img.naturalWidth < img.naturalHeight) {
                    orientation = 'portrait';
                }
                else {
                    orientation = 'even';
                }
                resolve(orientation);
            };
            img.src = src;
        });
    };
    Object.defineProperty(CardCarouselStructure.prototype, "prefix", {
        get: function () {
            var styles = window.getComputedStyle(document.documentElement, ''), pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1], dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
            return '-' + pre + '-';
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CardCarouselStructure.prototype, "cardCSS", {
        //Cards
        get: function () {
            var _this = this;
            Object.keys(this.media).forEach(function (size) {
                if (window.matchMedia("(min-width: " + _this.media[size].minWidth + ")").matches) {
                    _this.card.size.show = _this.media[size].show;
                }
            });
            //the width required to show n number of items
            var showWidth = ($(this.target).outerWidth() / this.card.size.show) - (this.card.size.spacing);
            return ("\n\t\t\t" + this.prefix + "transition:all .3s;\n\t\t\ttransition:all .3s;\n\t\t\tbox-sizing:border-box;\n\t\t\twidth:" + showWidth + "px;\n\t\t\theight:" + this.card.size.height + this.card.size.units + ";\n\t\t\tdisplay:inline-block;\n\t\t\tvertical-align: top;\n\t\t\tmargin-left:" + this.card.size.spacing / 2 + this.card.size.units + ";\n\t\t\tmargin-right:" + this.card.size.spacing / 2 + this.card.size.units + ";\n\t\t\toverflow:hidden;\n\t\t\tposition:relative;\n\t\t\tmax-height:" + this.carousel.size.maxHeight + "px;\n\t\t")
                .trim().replace(/[\t|\n]/g, '');
        },
        enumerable: true,
        configurable: true
    });
    CardCarouselStructure.prototype.cardTemplate = function (config) {
        return ("\n\t\t\t<div style='" + this.cardCSS + "' index='" + config.index + "' class='card " + config.active + " " + config.orientation + "'>\n\t\t\t\t" + (config.backdrop ? "<div style='" + this.backdropCSS(config) + "' class='backdrop'></div>" : "") + "\n\t\t\t\t<img style='max-height:100%; max-width:" + this.carousel.size.maxHeight + "px; object-fit: contain; " + this.carouselRailImageCSS(config) + "' src='" + config.url + "'/>\n\t\t\t</div>\n\t\t")
            .trim().replace(/[\t|\n]/g, '');
    };
    Object.defineProperty(CardCarouselStructure.prototype, "carouselCSS", {
        //Carousel
        get: function () {
            return ("\n\t\t\tbox-sizing:border-box;\n\t\t\twhite-space:pre;\n\t\t\toverflow:hidden;\n\t\t\tbackground:" + this.theme + ";\n\t\t\tmax-height:" + this.carousel.size.maxHeight + "px;\n\t\t\tposition:relative;\n\t\t")
                .trim().replace(/[\t|\n]/g, '');
        },
        enumerable: true,
        configurable: true
    });
    CardCarouselStructure.prototype.carouselTemplate = function () {
        return ("\n\t\t\t<div style='" + this.carouselCSS + "' class='inner'>\n\t\t\t\t<div style='" + this.carouselRailCSS + "' class='rail'></div>\n\t\t\t\t\t<div data-dir='left' style='" + this.ctrlCSS("left") + "' class='ctrl'></div>\n\t\t\t\t\t<div data-dir='right' style='" + this.ctrlCSS("right") + "' class='ctrl'></div>\n\t\t\t</div>\n\t\t")
            .trim().replace(/[\t|\n]/g, '');
    };
    CardCarouselStructure.prototype.ctrlCSS = function (dir) {
        return ("\n\t\t\t" + this.prefix + "transition:all .3s;\n\t\t\ttransition:all .3s;\n\t\t\tposition:absolute;\n\t\t\t" + dir + ":0;\n\t\t\tbottom:0;\n\t\t\ttop:0;\n\t\t\tmargin:auto 10px;\n\t\t\theight:20px;\n\t\t\twidth:20px;\n\t\t\tbox-sizing:border-box;\n\t\t\tborder:2px solid #fff;\n\t\t\topacity:.2;\n\t\t\tz-index:1;\n\t\t\tcursor:pointer;\n\t\t\tborder-" + (dir === "left" ? "right" : "left") + ":0;\n\t\t\tborder-bottom:0;\n\t\t\tborder-top-" + dir + "-radius:0;\n\t\t\ttransform:rotate(45deg);\n\t\t\t" + (dir === "left" ? "\n\t\t\t\ttransform:rotate(-45deg);\n\t\t\t" : "") + "\n\t\t")
            .trim().replace(/[\t|\n]/g, '');
    };
    CardCarouselStructure.prototype.backdropCSS = function (config) {
        return ("\n\t\t\tposition:absolute;\n\t\t\ttop:0;\n\t\t\tbottom:0;\n\t\t\tleft:0;\n\t\t\tright:0;\n\t\t\tbackground:radial-gradient(ellipse at center, transparent 0%, " + this.theme + " 75%), url(" + config.url + ");\n\t\t\tbackground-position:center;\n\t\t\tbackground-repeat:no-repeat;\n\t\t\tbackground-size:contain;\n\t\t\t" + this.prefix + "filter:blur(30px);\n\t\t\ttransform:scale(.9);\n\t\t\tbackground-blend-mode:hard-light;\n\t\t\t" + (config.orientation === 'landscape' || 'even' ? "\n\t\t\t\tbackground-size:cover;\n\t\t\t" : "") + "\n\t\t")
            .trim().replace(/[\t|\n]/g, '');
    };
    Object.defineProperty(CardCarouselStructure.prototype, "carouselRailCSS", {
        //Carousel: rail
        get: function () {
            return "\n\t\t\tbox-sizing:border-box;\n\t\t\twidth:9999em;\n\t\t\tposition:relative;\n\t\t"
                .trim().replace(/[\t|\n]/g, '');
        },
        enumerable: true,
        configurable: true
    });
    //Carousel: rail image
    CardCarouselStructure.prototype.carouselRailImageCSS = function (config) {
        return ("\n\t\t\twidth:" + (config.orientation === "landscape" || "even" ? "100%" : "auto") + ";\n\t\t\theight:" + (config.orientation === "landscape" || "even" ? "auto" : "100%") + ";\n\t\t\tposition:absolute;\n\t\t\tmargin:auto;\n\t\t\tleft:-100%;\n\t\t\tright:-100%;\n\t\t\ttop:-100%;\n\t\t\tbottom:-100%;\n\t\t\topacity:0;\n\t\t\ttransition:opacity 4s;\n\t\t\t" + this.prefix + "user-select: none;\n\t\t\tuser-select: none;\n\t\t")
            .trim().replace(/[\t|\n]/g, '');
    };
    return CardCarouselStructure;
}());
var CardCarousel = (function (_super) {
    __extends(CardCarousel, _super);
    function CardCarousel(selector) {
        var playlistItems = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            playlistItems[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, selector) || this;
        _this.position = 0;
        _this.current = 0;
        _this.playlist = [];
        var self = _this;
        $(_this.target).children().wrapAll("<template/>");
        $(_this.playlistElements).find("img").each(function () {
            self.playlist.push({ url: $(this).attr("src") });
        });
        _this.playlist = (_a = _this.playlist).concat.apply(_a, playlistItems);
        $(_this.populate.bind(_this));
        return _this;
        var _a;
    }
    CardCarousel.prototype.populate = function () {
        var _this = this;
        $(this.target).append(this.carouselTemplate());
        this.playlist.forEach(function (item, index) {
            var active = true;
            if (index !== 0) {
                active = false;
            }
            _this.orientation(item.url).then(function (o) {
                $(_this.rail).append(_this.cardTemplate({
                    active: active ? "active" : "",
                    index: index,
                    url: item.url,
                    orientation: o,
                    backdrop: true
                }));
            });
        });
        //look for smallest image, use Infinity as first value, images will fit as if contained
        var postInitLoop = setInterval(function () {
            if (_this.playlist.length === $(_this.cardsImage).length) {
                clearInterval(postInitLoop);
                _this.onInit();
            }
        }, 100);
    };
    CardCarousel.prototype.onInit = function () {
        var _this = this;
        var self = this;
        this.equalize();
        var _recalculate = this.debounce(this.recalculate, 250);
        this.checkVisible();
        $(this.cardsImage).css({ opacity: 1 });
        setTimeout(function () {
            window.addEventListener('resize', _recalculate.bind(_this));
        }, 1000);
        $(this.ctrls).on("mouseup", function (e) {
            self.move(self, e);
        });
    };
    CardCarousel.prototype.move = function (self, e) {
        var size = $(self.cards).eq(self.current).outerWidth() +
            parseInt($(self.cards).eq(self.current).css("margin-left")) +
            parseInt($(self.cards).eq(self.current).css("margin-right"));
        var rail = $(self.rail);
        var dir = $(e.target).data("dir");
        var cycle = self.cycle;
        //Left clicked
        if (dir === "left") {
            if (self.current > 0) {
                self.current--;
                rail.animate({
                    left: self.position += size
                });
            }
        }
        else {
            if (self.current >= 0 && self.current < $(self.cards).length - 1) {
                self.current++;
                rail.animate({
                    left: self.position -= size
                });
            }
        }
    };
    return CardCarousel;
}(CardCarouselStructure));

module.exports = CardCarousel;
