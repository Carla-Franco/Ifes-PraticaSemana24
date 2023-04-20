const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const nodemailer = require('nodemailer')
const porta = 443

app.use(session({ secret: '12134567890' }))

app.use(bodyParser.urlencoded({ extended: true }))

var login = 'admin'
var senha = '1234'

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, './'))

app.get('/', (req, res) => {
  if (req.session.login) {
    res.render('logado')
    console.log('Usuário logado: ' + req.session.login)  
  }
  else {
    res.render('home')
  }
})

app.get('/email', (req, res) => {
  res.render('email')
})

app.post('/', (req, res) => {
  if (req.body.password == senha && req.body.login == login) {
    req.session.login = login
    res.redirect('email')
  }
  else {
    res.render('home')
  }
})

app.post('/email', (req, res) => {
    res.redirect('sendemail')
})

app.get("/sendemail", async (req, res) => {
  
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "83347e0c13ced3",
      pass: "e5412a4e573ff5"
    }
  });

  var message = {
    from: "roncarcla18@gmail.com",
    to: "example@gmail.com",
    subject: "Atividade Prática Semana 4",
    text: "Carla. \n\n Parabéns! Você desenvolveu com sucesso a Atividade Prática da Semana 4 - Criação de páginas customizadas com Node.js. \n\nCarla Franco",
    html: "Prezada Carla, <br><br> Você concluiu com sucesso o módulo de Node.js!<br><br>Carla Franco<br>"
  };

  transport.sendMail(message, function(err) {
    if (err)
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: E-mail não enviado!"
      });
    else
      return res.json({
        erro: false,
        mensagem: "E-mail enviado com sucesso!"
      });
  });
});


app.listen(porta, () => { console.log('Servidor rodando') })