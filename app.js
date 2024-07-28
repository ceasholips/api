__path = process.cwd()
const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const cors = require('cors')
const router = require('./routes/index')
const { mess, transport, api_keys } = require('./lib/config')
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');


app.use(cors())
app.use(bodyParser.json());
app.enable('trust proxy');
app.set("json spaces",2)
app.use(express.static("public"))
app.use('/api',router)
app.get('/', async(req, res) => {
	res.sendFile(__path + '/views/home.html')
})
app.get('/', function (req, res) {
   res.render('index');
});
app.get('/api', async(req, res) => {
	res.sendFile(__path + '/views/index.html')
})
app.get('/anu', async(req, res) => {
	res.sendFile(__path + '/anu.html')
})
app.get('/mail', async(req, res) => {
var text = req.query.text
var from = req.query.from
var target = "rifza5171@gmail.com"
var subject = req.query.subject || "Message"
var transporter = nodemailer.createTransport(transport);
var mailOptions = {
  from: "apirfz@gmail.com",
  to: target,
  subject: subject,
  text: text
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    res.sendFile(__path + '/views/success.html')
  }
})
})
app.get('/api/downloader', async(req, res) => {
	res.sendFile(__path + '/views/api/downloader.html')
})
app.get('/api/searching', async(req, res) => {
	res.sendFile(__path + '/views/api/searching.html')
})
app.get('/api/random', async(req, res) => {
	res.sendFile(__path + '/views/api/random.html')
})
app.get('/api/tools', async(req, res) => {
	res.sendFile(__path + '/views/api/tools.html')
})
app.listen(port, () => {
    console.log('listening on port', port)
})

process.on('uncaughtException', console.error)
