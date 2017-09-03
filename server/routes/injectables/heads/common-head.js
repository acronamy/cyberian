"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function commonHead($) {
    $("head")
        .append('<script src="http://localhost:35729/livereload.js"></script>')
        .append(`<title>${this.name} | ${this.req.url.replace("/", "")}</title>`)
        .append("<link rel='stylesheet' type='text/css' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'/>")
        .append("<link rel='stylesheet' type='text/css' href='/styles/cyberian-common.css'/>");
    $("body").append('<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>');
}
exports.default = commonHead;
