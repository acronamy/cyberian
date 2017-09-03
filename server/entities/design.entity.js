"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let Design = class Design {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Design.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "#000000" }),
    __metadata("design:type", String)
], Design.prototype, "themePrimaryColor", void 0);
__decorate([
    typeorm_1.Column({ default: "#ffffff" }),
    __metadata("design:type", String)
], Design.prototype, "themeGeneralColor", void 0);
__decorate([
    typeorm_1.Column({ default: "#000000" }),
    __metadata("design:type", String)
], Design.prototype, "themeTextColor", void 0);
__decorate([
    typeorm_1.Column({ default: "{}" }),
    __metadata("design:type", String)
], Design.prototype, "carouselIncludes", void 0);
__decorate([
    typeorm_1.Column({ default: 8 }),
    __metadata("design:type", Number)
], Design.prototype, "carouselSpeed", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Number)
], Design.prototype, "carouselAutoScroll", void 0);
__decorate([
    typeorm_1.Column({ default: "About me" }),
    __metadata("design:type", String)
], Design.prototype, "aboutMeHeading", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Design.prototype, "aboutMeTextBio", void 0);
__decorate([
    typeorm_1.Column({ default: "right" }),
    __metadata("design:type", String)
], Design.prototype, "aboutMeTextAlignment", void 0);
__decorate([
    typeorm_1.Column({ default: "/images/no-image.jpeg" }),
    __metadata("design:type", String)
], Design.prototype, "aboutMeBackgroundImage", void 0);
__decorate([
    typeorm_1.Column({ default: "right" }),
    __metadata("design:type", String)
], Design.prototype, "aboutMeBackgroundImageAlignment", void 0);
__decorate([
    typeorm_1.Column({ default: "{}" }),
    __metadata("design:type", String)
], Design.prototype, "photoGaleryncludes", void 0);
__decorate([
    typeorm_1.Column({ default: "/images/no-image.jpeg" }),
    __metadata("design:type", String)
], Design.prototype, "contactMeBackgroundImage", void 0);
__decorate([
    typeorm_1.Column({ default: "right" }),
    __metadata("design:type", String)
], Design.prototype, "contactMeBackgroundImageAlignment", void 0);
Design = __decorate([
    typeorm_1.Entity()
], Design);
exports.Design = Design;
