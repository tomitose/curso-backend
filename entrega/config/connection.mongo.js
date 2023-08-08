
const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.USER_ATLAS}:${process.env.PASS_ATLAS}@cluster0.qjelxrd.mongodb.net/coderback?retryWrites=true&w=majority`;

const db = mongoose.connection;

//IFFE para conectarse a mongo atlas.
(async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database is connected ");
  } catch (err) {
    
    console.log("Ha ocurrido un error en la conexion de la BD");
    console.log(err);
  }
})();

module.exports = db; 
