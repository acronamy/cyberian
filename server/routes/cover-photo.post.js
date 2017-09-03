"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const path = require("path");
function postCoverPhoto(mount, connection) {
    mount.post("/upload/cover-photo", (req, res) => {
        if (utils_1.isLoggedIn(req)) {
            const coverPhoto = req.files.file;
            const filename = path.resolve(__dirname, "../uploads", coverPhoto.name);
            coverPhoto.mv(filename, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send("/uploads/" + coverPhoto.name);
            });
        }
    });
}
exports.postCoverPhoto = postCoverPhoto;
