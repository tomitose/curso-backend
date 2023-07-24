const express = require("express");
const {api} = require(".")

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api", api);


app.listen(port, () =>
  console.log(`Server Port: http://localhost:${port}/api`)
);
