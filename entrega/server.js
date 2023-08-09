require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const express = require("express");
const { api } = require("./routes/mainRoutes");
const puerto = process.env.PORT || 8080;  
const app = express();

//middelwares para dar formato
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//router de  api
app.use("/api", api);


(async () => {  
  try {
    const uri = `mongodb+srv://${process.env.USER_ATLAS}:${process.env.PASS_ATLAS}@cluster0.qjelxrd.mongodb.net/ecommerce?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      "Database is connected "
    );   
    app.listen(puerto, () => {
      console.log(`corriendo en puerto http://localhost:${puerto}`);
    });
        
  } catch (err) {
    console.log("Ha ocurrido un error en el archivo server.js");
    console.log(err);
  }
})();


