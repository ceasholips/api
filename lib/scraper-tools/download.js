const axios = require('axios')
const cheerio = require('cheerio')
let author = 'rfz-xm';

async function Download (url) {
    try {
        const tokenn = await axios.get("https://downvideo1.quora-wiki.com/#url=" + url);
        let a = cheerio.load(tokenn.data);
        let token = a("#token").attr("value");
        const param = {
            url: url,
            token: token,
        };
        const { data } = await axios.request("https://downvideo1.quora-wiki.com/system/action.php", {
                method: "post",
                data: new URLSearchParams(Object.entries(param)),
                headers: {
                    "cookie": "__gads=ID=9a603a5ef9e5c31c-222500abbdd80019:T=1670050702:RT=1670050702:S=ALNI_Mbjg_1APyqqZ2duBpl-HWl050fWaA; __gpi=UID=00000b88a8a005bc:T=1670050702:RT=1670050702:S=ALNI_MbnD0KpRAaInl_NnnJynw1dOR2GKw; fpestid=zZyW6-AOWN7D_0MPMLqRvrnw4HyQeagQh-V1ySQDnE2AZrbxjN6ZN1-xgrD7AbZFIoi0bA; PHPSESSID=vc07ua2ifd2bfu0gdguabg8ov7",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": "Mozilla/5.0 (Linux; Android 7.1.1; CPH1801) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36",
                    "referer": "https://downvideo.quora-wiki.com/",
                },
            }
        );
        return {
            status: 200,
            author: author,
            title: data.title,
            thumbnail: "https:" + data.thumbnail,
            duration: data.duration,
            mp4: data.medias.filter(x => x.extension == "mp4"),
            _3gp: data.medias.filter(x => x.extension == "3gp"),
            webm: data.medias.filter(x => x.extension == "webm"),
            m4a: data.medias.filter(x => x.extension == "m4a"),
            mp3: data.medias.filter(x => x.extension == "mp3"),
            jpg: data.medias.filter(x => x.extension == "jpg"),
            jpeg: data.medias.filter(x => x.extension == "jpeg"),
            png: data.medias.filter(x => x.extension == "png"),
            webp: data.medias.filter(x => x.extension == "webp")           
        };
    } catch (e) {
        return e
    }
}

module.exports = { Download }