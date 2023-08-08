const express = require("express");
const http = require("http")
const {api, home} = require("./src/routes");
const path = require("path");
const handlebars = require("express-handlebars");
const {Server} = require("socket.io")
const socketManager = require('./websocket')


const app = express();
const port = 8080;
const server = http.createServer(app);
const io = new Server(server)


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(path.join(__dirname,'/public')))


app.use("/", home)
app.use("/api", api);

app.use((req,res,next)=>{
  req.io= io
  next()
})

//web socket

io.on('connection', socketManager)


server.listen(port, () =>
  console.log(`Server Port: http://localhost:${port}`)
);
