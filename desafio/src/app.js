const express = require("express");
const {api, home} = require("./routes");
const path = require("path")

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/static', express.static(path.join(__dirname,'../public')))


app.use("/", home)
app.use("/api", api);


app.listen(port, () =>
  console.log(`Server Port: http://localhost:${port}`)
);
