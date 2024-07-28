const express = require('express')
const router  = express.Router()
const axios = require("axios")
const fs = require('fs')
const { mess } = require('../lib/config')
const { photoOxy } = require('../lib/scraper-tools/photooxy')
const { facebookDownload } = require('../lib/scraper-tools/facebook')
const { Download  } = require('../lib/scraper-tools/download')
const { DucHaitenAnimated } = require('../lib/scraper-tools/space')
const { youtube, searchResult } = require('../lib/scraper-tools/ytdl')

const { YTMP3, YTMP4 } = require('../lib/scraper-tools/youtube')
let qrcode = require('qrcode')
const translate = require('@vitalets/google-translate-api')
const fetch = require('node-fetch').default
let QUALITY = ['144','360','480','720','1080']
let languages = `
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'ca': 'Catalan',
  'zh': 'Chinese',
  'zh-cn': 'Chinese (Mandarin/China)',
  'zh-tw': 'Chinese (Mandarin/Taiwan)',
  'zh-yue': 'Chinese (Cantonese)',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'en-au': 'English (Australia)',
  'en-uk': 'English (United Kingdom)',
  'en-us': 'English (United States)',
  'eo': 'Esperanto',
  'fi': 'Finnish',
  'fr': 'French',
  'de': 'German',
  'el': 'Greek',
  'ht': 'Haitian Creole',
  'hi': 'Hindi',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'id': 'Indonesian',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'la': 'Latin',
  'lv': 'Latvian',
  'mk': 'Macedonian',
  'no': 'Norwegian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'pt-br': 'Portuguese (Brazil)',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'es': 'Spanish',
  'es-es': 'Spanish (Spain)',
  'es-us': 'Spanish (United States)',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'ta': 'Tamil',
  'th': 'Thai',
  'tr': 'Turkish',
  'vi': 'Vietnamese',
  'cy': 'Welsh'`
  
const { TiktokDownloader } = require('../lib/scraper-tools/tiktokdl')
const { getBuffer, fetchJson, getRandom } = require('../lib/function')
const { pinterest } = require('../lib/scraper-tools/pinterest')
const { wikiSearch } = require('../lib/scraper-tools/wiki')
const { facebook } = require('../lib/scraper-tools/facebook')
const pinterestdl = require('../lib/scraper-tools/pinterestdl')
const sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms))
}

router.get('/get/buffer', async(req, res) => {
	var url = req.query.url
	if (!url) return res.json(mess.noturl)
	await getbuffer(url).then(hasil => {
    console.log(hasil)
		res.json(hasil)
	}).catch(err => {
		console.log(err)
		res.json(mess.error)
	})
})

router.get('/youtube/search', async(req, res) => {
	var query = req.query.query
	if (!query) return res.json(mess.query)
	await searchResult(query).then(hasil => {
		res.json(hasil)
	}).catch(err => {
		console.log(err)
		res.json(mess.error)
	})
})

router.get('/pinterest', async(req, res) => {
	var query = req.query.query
	if (!query) return res.json(mess.query)
    await pinterest(query).then(hasil => {	
		res.json(hasil)
	}).catch(err => {
		console.log(err)
		res.json(mess.error)
	})
})

router.get('/facebook/downloader', async(req, res) => {
	var link = req.query.link
         if(link.includes('/reel/')) return res.json({ status: false, message: 'Fitur ini tidak berfungsi untuk video reels!' })
            if(!link.includes('/videos/') && !link.includes('watch/')) return res.json({ status: false, message: 'Media tidak valid!\nHanya mendukung tautan seperti contoh : \n- https://facebook.com/username/videos/\n- https://fb.watch/plmnkoijb' })            
             await facebookDownload(link).then((efbe) => { 
         res.json(efbe)
	}).catch(err => {
		console.log(err)
		res.json(mess.error)
	})
})

router.get('/pinterest-v2', async(req, res) => {
	var query = req.query.query
	if (!query) return res.json(mess.query)
	let ranI = getRandom('.jpg')	
 	 await pinterest(query).then(async data => {
	 let hasil = data[Math.floor(Math.random() * data.length)];
	 let buff = await getBuffer(hasil)
     await fs.writeFileSync(__path +'/tmp/'+ ranI, buff)
     await res.sendFile(__path +'/tmp/'+ ranI)
     await sleep(25000)
     await fs.unlinkSync(__path +'/tmp/'+ ranI)
     }).catch(err => {
		console.log(err)
		res.json(mess.error)
	})

})


router.get('/pinterest/downloader', async(req, res) => {
	var link = req.query.link
  	 if (!link) return res.json(mess.noturl)
     if(!link.includes('https://pin.it/')) return res.json({ status: 403, message: 'Harap gunakan url "https://pin.it/"!'})	
	 let obj = await fetchJson('https://unshorten.me/json/' + link)
     let object = obj.resolved_url.split("/sent/?")[0]              
 	await pinterestdl(`${object}`).then(hasil => {
		res.status(200).send(hasil)
 	}).catch(err => {
		console.log(err)
		res.status(500).send({
            status: 500,
            message: 'Internal Server Error!'          
        })
	})
})
router.get('/youtubemp4/downloader', async(req, res) => {
    var quality = req.query.quality
	var link = req.query.link
	if(!quality) return res.json(mess.notquality)
	if(!QUALITY.includes(quality)) return res.json({ status: false, message: `Kualitas video yang tersedia : ${QUALITY}`})
	if (!link) return res.json(mess.noturl)
	try{ 
     let down = await Download(link)
     let mp4 = await down.mp4.filter(v => v.quality == quality + 'p' )
     let ranV = getRandom('.mp4')
     let data = await getBuffer(mp4[0].url)
     await fs.writeFileSync(__path +'/tmp/' + ranV, data)
     await res.sendFile(__path +'/tmp/' + ranV)
     await sleep(5000)
     await fs.unlinkSync(__path +'/tmp/' + ranV)     
     } catch (err) {
		console.log(err)
		res.status(500).send({
            status: 500,
            message: 'Internal Server Error!'          
        })
      }
})

router.get('/youtubemp3/downloader', async(req, res) => {
	var link = req.query.link
	if (!link) return res.json(mess.noturl)
	try{ 
     let down = await Download(link)
     let mp3 = down.mp3.filter(_ => _.quality == '128kbps')
     let ranV = getRandom('.mp3')
     let data = await getBuffer(mp3[0].url)
     await fs.writeFileSync(__path +'/tmp/' + ranV, data)
     await res.sendFile(__path +'/tmp/' + ranV)
     await sleep(5000)
     await fs.unlinkSync(__path +'/tmp/' + ranV)     
     } catch (err) {
		console.log(err)
		res.status(500).send({
            status: 500,
            message: 'Internal Server Error!'          
        })
      }
	})

router.get('/multi/downloader', async(req, res) => {
	var link = req.query.link
	if (!link) return res.json(mess.noturl)
	try{ 
     let down = await Download(link)
    	res.status(200).send(down)
     } catch (err) {
		console.log(err)
		res.status(500).send({
            status: 500,
            message: 'Internal Server Error!'          
        })
      }
})

router.get('/wiki/search', async(req, res) => {
	var query = req.query.query
	if (!query) return res.json(mess.query)
	await wikiSearch(query).then(hasil => {	
		res.json(hasil)
	}).catch(err => {
		console.log(err)
		res.json(mess.error)
	})
})
//<---------TIKTOK--------->\\
router.get('/tiktok-v1/downloader', async(req, res) => {
	var link = req.query.link
	if (!link) return res.json(mess.noturl)
	await TiktokDownloader(link).then(hasil => {	
		res.json(hasil)
	}).catch(err => {
		console.log(err)
		res.json(mess.error)
	})
})

router.get('/tiktok-v2/downloader', async(req, res) => {
	var link = req.query.link
	if (!link) return res.json(mess.noturl)
	await TiktokDownloader(link).then(async hasil => {
	var { media } = hasil
	let ranV = getRandom('.mp4')
    let data = await getBuffer(media[1].url)
    await fs.writeFileSync(__path +'/tmp/' + ranV, data)
    await res.sendFile(__path +'/tmp/' + ranV)
    await sleep(25000)
    await fs.unlinkSync(__path +'/tmp/' + ranV)

	}).catch(err => {
		console.log(err)
		res.json(mess.error)
	})
})


//<---------TIKTOK--------->\\

router.get('/random/waifu', async(req, res) => {
    let za = await fetchJson(`https://waifu.pics/api/sfw/waifu`)
	let data = await getBuffer(za.url)
	let ranI = getRandom('.jpg')	
    await fs.writeFileSync(__path +'/tmp/'+ ranI, data)
    await res.sendFile(__path +'/tmp/'+ ranI)
    await sleep(25000)
    await fs.unlinkSync(__path +'/tmp/'+ ranI)
})

router.get('/random/neko', async(req, res) => {
    let ranI = getRandom('.jpg')	
    let za = await fetchJson(`https://waifu.pics/api/sfw/neko`)
	let data = await getBuffer(za.url)
    await fs.writeFileSync(__path +'/tmp/'+ ranI, data)
    await res.sendFile(__path +'/tmp/'+ ranI)
    await sleep(25000)
    await fs.unlinkSync(__path +'/tmp/'+ ranI)
})

router.get('/random/awoo', async(req, res) => {
    let ranI = getRandom('.jpg')	
    let za = await fetchJson(`https://waifu.pics/api/sfw/awoo`)
	let data = await getBuffer(za.url)
    await fs.writeFileSync(__path +'/tmp/'+ ranI, data)
    await res.sendFile(__path +'/tmp/'+ ranI)
    await sleep(25000)
    await fs.unlinkSync(__path +'/tmp/'+ ranI)
})

router.get('/random/megumin', async(req, res) => {
    let ranI = getRandom('.jpg')	
    let za = await fetchJson(`https://waifu.pics/api/sfw/megumin`)
	let data = await getBuffer(za.url)
    await fs.writeFileSync(__path +'/tmp/'+ ranI, data)
    await res.sendFile(__path +'/tmp/'+ ranI)
    await sleep(25000)
    await fs.unlinkSync(__path +'/tmp/'+ ranI)
})

router.get('/tools/ssweb', async(req, res) => {
	var link = req.query.link
	if (!link) return res.json(mess.query)
	let ranI = getRandom('.jpg')	
	try {
	 let buff = await getBuffer('https://image.thum.io/get/width/1204/fullpage/' + link)
       fs.writeFileSync(__path +'/tmp/'+ ranI, buff)
         await res.sendFile(__path +'/tmp/'+ ranI)
         await sleep(25000)
         await fs.unlinkSync(__path +'/tmp/'+ ranI)
      
     } catch (err) {
		console.log(err)
		res.json(mess.error)
	}

})
router.get('/tools/translate', async(req, res) =>
   {
	var teks = req.query.text
	var lang = req.query.language
	if(!lang) return res.json({ message: 'Masukkan parameter language!' })
	if (!teks) return res.json({ message: 'Masukkan parameter text!' })  
   try {
     const { text } = await translate(teks, { to: lang });
     res.json(text)
   } catch (e){ console.log(e)
    res.json({ message: 'list bahasa yang tersedia\n'+languages}) }
  }
)
router.get('/tools/qrcode-maker', async(req, res) => {
    let ranI = getRandom('.jpg')	
	var link = req.query.link
	if (!link) return res.json(mess.noturl)
	let qyuer = await qrcode.toDataURL(link, { scale: 35 })
   let data = new Buffer.from(qyuer.replace('data:image/png;base64,', ''), 'base64')
    await fs.writeFileSync(__path +'/tmp/'+ ranI, data)
    await res.sendFile(__path +'/tmp/'+ ranI)
    await sleep(25000)
    await fs.unlinkSync(__path +'/tmp/'+ ranI)
}) 

router.get('/photo-maker/photooxy', async(req, res) => {
	var text = req.query.text
	var theme = req.query.theme
	let ranI = getRandom('.jpg')	
    let listOxy = [
    'undergrass',
    'doublelove', 
    'coffecup',
    'underwaterocean',
    'smokyneon',
    'starstext',
    'rainboweffect',
    'balloontext',
    'metalliceffect',
    'embroiderytext',
    'shadow', 
    'write', 
    'narutobanner', 
    'shinetext',
    'romantic', 
    'love', 
    'flamingtext',
    'stonetext',
    'writeart',
    'summertext',
    'wolfmetaltext',
    'nature3dtext',
    'rosestext',
    'naturetypography',
    'quotesunder',
    'burnpaper',
    'smoke'
   ]
    if(!text) return res.json({ status: false, message: 'Masukkan parameter text!' })
    if(!theme) return res.json({ status: false, message: 'Masukkan parameter theme!' })
    if(!listOxy.includes(theme)) return res.json({ status: false, message: `Theme yang tersedia : ${listOxy}`})
	try {
           let url
            if (/naturetypography/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/create-vector-nature-typography-355.html'
            if (/quotesunder/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/quotes-under-fall-leaves-347.html'
            if (/shinetext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/rainbow-shine-text-223.html'
            if (/shadow/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html'
            if (/write/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/write-text-on-the-cup-392.html'
            if (/romantic/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/romantic-messages-for-your-loved-one-391.html'
            if (/burnpaper/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/write-text-on-burn-paper-388.html'
            if (/nature3dtext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/make-nature-3d-text-effects-364.html'
            if (/rosestext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/yellow-roses-text-360.html'
            if (/narutobanner/.test(theme)) url = 'https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html'
            if (/love/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html'
            if (/undergrass/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html'
            if (/doublelove/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/love-text-effect-372.html'
            if (/coffecup/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html'
            if (/underwaterocean/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/creating-an-underwater-ocean-363.html'
            if (/smoke/.test(theme)) url = 'https://photooxy.com/other-design/create-an-easy-smoke-type-effect-390.html'
            if (/smokyneon/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/make-smoky-neon-glow-effect-343.html'
            if (/starstext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html'
            if (/rainboweffect/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/glow-rainbow-effect-generator-201.html'
            if (/balloontext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/royal-look-text-balloon-effect-173.html'
            if (/metalliceffect/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html'
            if (/embroiderytext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/create-embroidery-text-online-191.html'
            if (/flamingtext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html'
            if (/stonetext/.test(theme)) url = 'https://photooxy.com/online-3d-white-stone-text-effect-utility-411.html'
            if (/writeart/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/write-art-quote-on-wood-heart-370.html'
            if (/summertext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/3d-summer-text-effect-367.html'
            if (/wolfmetaltext/.test(theme)) url = 'https://photooxy.com/logo-and-text-effects/create-a-wolf-metal-text-effect-365.html'
             let result = await photoOxy(url, text)
            res.status(200).json({ status: 200, message: "ok", result: result })
      } catch (err) {
		console.log(err)
		res.json(mess.error)
	}
})

router.get('/ai/duchaiten-animated', async(req, res) =>
   {
	var prompt = req.query.prompt
	var negative = req.query.negative
	if(!prompt) return res.json({ message: 'Masukkan parameter prompt!' })
	if (!prompt) return res.json({ message: 'Masukkan parameter negative!' })  
   try {
     const ress = await DucHaitenAnimated(prompt, negative);
     res.json(ress)
   } catch (e){ console.log(e)
    res.json({ message: 'err'}) }
  }
)

module.exports = router