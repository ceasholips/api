const fetch = require('node-fetch')
const https = require('https')
const axios = require('axios');
axios.defaults.httpsAgent = new https.Agent({
   rejectUnauthorized: false,
   })
const cheerio = require('cheerio');
const fs = require('fs')
const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
    console.log(res)
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}
const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}
const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
    fetch(url, options)
        .then(response => response.json())
        .then(json => {
            resolve(json)
        })
        .catch((err) => {
            reject(err)
        })
})


function randomInt(from, to) {
  if (from > to) [from, to] = [to, from]
  from = Math.floor(from)
  to = Math.floor(to)
  return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}  
const runtime = function(seconds) {
 seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " day, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hours, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minute, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " second") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

module.exports = { getBuffer, getRandom, fetchJson, pickRandom, randomInt, runtime }
