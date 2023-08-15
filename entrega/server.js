require("dotenv").config({ path: "./.env" });
const http = require('http');
const path = require('path');
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const mongoose = require("mongoose");
const express = require("express");
const { api, home } = require("./routes/mainRoutes");

const port = process.env.PORT || 8080;  

const socketManager = require('./websocket/index')

const app = express();
const server = http.createServer(app) // server http montado con express
const io = new Server(server) // web socket montado en el http

//settings del motor de plantilla
app.engine('handlebars', handlebars.engine()) // registramos handlebars como motor de plantillas
app.set('views', path.join(__dirname, '/views')) // el setting 'views' = directorio de vistas
app.set('view engine', 'handlebars') // setear handlebars como motor de plantillas


//sirvo la carpeta public
app.use('/static', express.static(path.join(__dirname + '/public')))


//middelwares para dar formato
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

//inserto el io en la request.
app.use((req, res, next) => {
  req.io = io
  next()
})

//router de  api
app.use("/api", api);

//router del home
app.use('/', home)


// web socket
io.on('connection', socketManager)


// IIFE Immediate Invoke Function Expression
const main = async () => {  
  try {
    const uri = `mongodb+srv://${process.env.USER_ATLAS}:${process.env.PASS_ATLAS}@cluster0.qjelxrd.mongodb.net/ecommerce?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      "Database is connected "
    );   
    app.listen(port, () => {
      console.log(`corriendo en puerto http://localhost:${port}`);
    });
        
  } catch (err) {
    console.log("Ha ocurrido un error al conectar con la Base de Datos");
    console.log(err);
  }
}

main()


