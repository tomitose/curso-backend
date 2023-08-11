require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const express = require("express");
const { api } = require("./routes/mainRoutes");
const port = process.env.PORT || 8080;  
const app = express();

//middelwares para dar formato
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

//router de  api
app.use("/api", api);


// IIFE Immediate Invoke Function Expression
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
    app.listen(port, () => {
      console.log(`corriendo en puerto http://localhost:${port}`);
    });
        
  } catch (err) {
    console.log("Ha ocurrido un error al conectar con la Base de Datos");
    console.log(err);
  }
})();


