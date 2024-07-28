const axios = require('axios')
const fetch = require('node-fetch')
/** For Duchaiten
       [ 
          "vivinh7fxk", //DucHaitenAnimated_v5.0
          "vrwsvth8eq" //DucHaitenDreamWorld_v2.4.1
       ]
*/
exports.stableDiffusion = async(prompt, negativePrompt) => {

return new Promise(async(resolve, reject) => {
 try{  
  let a = await axios('https://camenduru-webui-docker.hf.space/run/predict/',
   {
   method: 'POST',
   data: {
   "fn_index": 49,
   "data": [
    prompt,
    negativePrompt,
    "None",
    "None",
    20,
    "DPM++ 2M Karras",
    false,
    false,
    1,
    1,
    7,
    -1,
    -1,
    0,
    0,
    0,
    false,
    1344,
    1024,
    false,
    0.7,
    0,
    0,
    "None",
    null,
    "",
    ""
  ],
    "session_hash": "7h0xtimb0f8"
   }
   })   
   resolve('https://camenduru-webui-docker.hf.space/file='+ a["data"]["data"][0][0]["name"]) 
  } catch (e){ 
    reject(e)
  }
 })
}

exports.esrgan = async(file) => {
return new Promise(async(resolve, reject) => {
 
  let azfir = await axios('https://doevent-face-real-esrgan.hf.space/run/predict',
   {
   method: 'POST',
   data: {      
      "fn_index": 0,
      "data": [
           "data:image/jpg;base64," + file.toString('base64'),
           "8x"
         ],
          "session_hash":"x4tdsp37sb"                               
    },
   headers: {
      'method': 'POST',
      'cookie': 'session-space-cookie=ae775f3e4c92af9d437b82bfa40cbafc',
   }
   }).catch((e)=> reject({ err: true }))
  resolve(new Buffer.from(azfir.data.data[0].replace('data:image/png;base64,', ''), 'base64'))
})
}

let checkpoint =
         [ 
          "vivinh7fxk", //DucHaitenAnimated_v5.0
          "vrwsvth8eq" //DucHaitenDreamWorld_v2.4.1
         ]


exports.DucHaitenAnimated = async(prompt, negativePrompt) => {
return new Promise(async(resolve, reject) => {  
 try{  
 console.log(prompt, negativePrompt)
  let a = await axios('https://duchaiten-webui.hf.space/run/predict/',
   {
     method: "POST",
     data: {
     "fn_index": 49,
     "data": [
       prompt,
       negativePrompt,
      "None",
      "None",
       50,
      "DPM++ SDE Karras",
       false,
       false,
       1,
       1,
       7,
      -1,
      -1,
       0,
       0,
       0,
       false,
       512,
       640,
       false,
       0.7,
       0,
       0,
       "None",
        null,
        "",
        ""
       ],
       "session_hash": "vivinh7fxk"
     },     
    })   
    resolve({       
      output: 'https://duchaiten-webui.hf.space/file='+ a["data"]["data"][0][0]["name"],
      data: a.data.data
    })
  
  } catch (e) {
  reject(e)
  } 
 })
}

