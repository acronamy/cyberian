"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function globalData($) {
    const self = this;
    const CyberianCarousel = {
        "carousel-includes": self.design.carouselIncludes,
        "photo-gallery-includes": self.design.photoGaleryncludes
    };
    const CyberianSettings = {
        "carousel": {
            speed: self.design.carouselSpeed,
            autoscroll: self.design.carouselAutoScroll
        }
    };
    const dynamicScript = `
    <script>
        window.CyberianPrepopulate = ${JSON.stringify(CyberianCarousel)};
        window.CyberianSettings = ${JSON.stringify(CyberianSettings)};
    </script>
    `
        .trim().replace(/[\n|\t]/g, "");
    $("head").prepend(dynamicScript);
}
exports.globalData = globalData;
