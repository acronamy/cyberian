import { argv } from "yargs";

export function injectAt(url: string, callback: Function) {
    if (this.req.baseUrl === url) {
        callback(this);
    }
}

export const production = !(argv.develop);