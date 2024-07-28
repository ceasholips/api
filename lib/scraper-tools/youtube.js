const fetch = require('node-fetch').default
let BaseUrl = "https://loader.to/ajax"
let QUALITY = ["360","480","720","1080"]

exports.YTMP3 = async(URL) => {
let hasil = {}
try{
    await fetch(BaseUrl+"/download.php?button=1&start=1&end=1&format=mp3&url="+URL)
     .then(response => response.json())
     .then(async(data) => 
       { 
         async function waitForDl(id){
         await fetch(BaseUrl+"/progress.php?id=" + id)
          .then(response => response.json())
          .then(json => 
            { 
             console.log(json)
             if(json.success == 0){
              setTimeout(()=>{ waitForDl(id) }, 5000)
              } else { 
               console.log('success✓', json.download_url)
                hasil.status = 200
                hasil.result = json.download_url
                return hasil
             }
            })
          }
          waitForDl(data.id)           
       })
       
   } catch { 
    return 'null'
  }
}
exports.YTMP4 = async(URL, quality) => {
if(!QUALITY.includes(quality)) return console.log(`Kualitas video yang tersedia : ${QUALITY}`)
async function waitForDl(id){
         await fetch(BaseUrl+"/progress.php?id=" + id)
          .then(response => response.json())
          .then(json => 
            { 
             if(json.success == 0){
              setTimeout(()=>{ waitForDl(id) }, 5000)
              } else { 
               return json.download_url
             }
            })
}  
    await fetch(BaseUrl+"/download.php?format=" + quality + "&url="+URL)
     .then(response => response.json())
     .then(async(data1) => 
       { 
        waitForDl(data1.id)
      })
} 