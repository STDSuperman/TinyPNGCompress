const Https = window.require("https");
const Url = window.require("url");
const Fs = window.require("fs");

const compressList = [
    "tinyjpg.com",
    "tinypng.com"
];

function RandomHeader() {
    const ip = new Array(4).fill(0).map(() => parseInt(Math.random() * 255)).join(".");
    const index = Math.round(Math.random() * 1);
    return {
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            "Postman-Token": Date.now(),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
            "X-Forwarded-For": ip
        },
        hostname: compressList[index],
        method: "POST",
        path: "/web/shrink",
        rejectUnauthorized: false
    };
}

function UploadImg(file) {
    const opts = RandomHeader();
    return new Promise((resolve, reject) => {
        const req = Https.request(opts, res => res.on("data", data => {
            const obj = JSON.parse(data.toString());
            obj.error ? reject(obj.message) : resolve(obj);
        }));
        req.write(file, "binary");
        req.on("error", e => reject(e));
        req.end();
    });
}

function DownloadImg(url) {
    const opts = new Url.URL(url);
    return new Promise((resolve, reject) => {
        const req = Https.request(opts, res => {
            let file = "";
            res.setEncoding("binary");
            res.on("data", chunk => file += chunk);
            res.on("end", () => resolve(file));
        });
        req.on("error", e => reject(e));
        req.end();
    });
}

export async function start(path) {
    const file = Fs.readFileSync(path, "binary");
    const obj = await UploadImg(file);
    console.log(obj);
    const data = await DownloadImg(obj.output.url);
    const ext = obj.output.type.split('/')[1];
    Fs.writeFileSync('tmg.' + ext, data, {encoding: 'binary'});
    const result = Fs.readFileSync('tmg.' + ext);
    return result;
}