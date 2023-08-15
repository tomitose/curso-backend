require("dotenv").config()
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");


const messageModel = require("../models/message.model");

(async function seeder() {
  const filepath = path.join(__dirname, "../", "data", "messages.json");
  const data = await fs.readFile(filepath, "utf-8");
  const messages = JSON.parse(data)

  try {
    
    const uri = `mongodb+srv://${process.env.USER_ATLAS}:${process.env.PASS_ATLAS}@cluster0.qjelxrd.mongodb.net/ecommerce?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      "Database is connected to DB Ecommerce"
    );
    result = await messageModel.insertMany(messages); //aca creo todos los documentos a mongo atlas de una
    console.log(`${result.length} products had been added`);
    mongoose.disconnect() // mato la conexion para que no quede abierta.
  } catch (err) {
    console.log("Ha ocurrido un error en script seed.messages.js");
    console.log(err);
  }
})();