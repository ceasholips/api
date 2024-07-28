global.author = "@rifza.p.p";

module.exports = {  
  transport: {
        service: 'gmail',
        auth: {
         user: 'apirfz@gmail.com',
         pass: 'zzbrxguksrejusco'
        }
    },
  api_keys: ["rfzpro","rfzapinew"],
  mess: {
    noturl: {
    	status: false,
    	code: 403,
    	message: 'Forbiden, Invlid link, masukkan parameter link',
    	maintanied_by: `${author}`,
    },
     notquality: {
    	status: false,
    	code: 403,
    	message: 'Masukkan parameter quality!',
    	maintanied_by: `${author}`,
    },
    error: { 
        status: false,
    	code: 503,
    	message: 'Internal Server Error!!',
        maintanied_by: `${author}`,
    },
    query: {
        status: false,
    	code: 403,
    	message: 'Masukan parameter pencarian!',
        maintanied_by: `${author}`,
    }
  }  
}