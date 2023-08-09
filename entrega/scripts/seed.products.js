require("dotenv").config()
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");


const productModel = require("../dao/models/product.model");
(async function seeder() {
  const filepath = path.join(__dirname, "../", "data", "products.json");
  const data = await fs.readFile(filepath, "utf-8");
  const products = JSON.parse(data).map(({ id, ...product }) => {
    return product;
  });

  try {
    
    const uri = `mongodb+srv://${process.env.USER_ATLAS}:${process.env.PASS_ATLAS}@cluster0.qjelxrd.mongodb.net/ecommerce?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      "Database is connected"
    );
    result = await productModel.insertMany(products);
    console.log(`${result.length} products had been added`);
    mongoose.disconnect() 
  } catch (err) {
    console.log("Ha ocurrido un error en script seed.products.js");
    console.log(err);
  }
})();
