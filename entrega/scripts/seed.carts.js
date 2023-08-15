require("dotenv").config();

console.log("hola desde seed.carts.js");

const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");

const faker = require("@faker-js/faker");

(async function seeder() {
  try {
    const uri = `mongodb+srv://${process.env.USER_ATLAS}:${process.env.PASS_ATLAS}@cluster0.qjelxrd.mongodb.net/ecommerce?retryWrites=true&w=majority`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database is connected to cluster0.xp1dk2t.mongodb.net/ecommerce");

    const allProducts = await productModel.find({});
    const allUsers = await userModel.find({});

    console.log("All Products:", allProducts);
    console.log("All Users:", allUsers);

    const totalCarts = 15;
    const carts = [];

    for (let i = 0; i < totalCarts; i++) {
      const productsCart = [];
      const productsDifferents = Math.floor(Math.random() * 5) + 1;
      const alreadyAdded = [];
      for (let j = 0; j < productsDifferents; j++) {
        const randomProductIndex = Math.floor(Math.random() * allProducts.length);
        const pid = allProducts[randomProductIndex]._id;
        if (alreadyAdded.includes(pid)) {
          continue;
        }
        alreadyAdded.push(pid);
        const product = {
          product: pid,
          qty: Math.floor(Math.random() * 5) + 1,
        };

        productsCart.push(product);
      }
      
      if (allUsers.length > 0) {
        const randomUserIndex = Math.floor(Math.random() * allUsers.length);
        const userId = allUsers[randomUserIndex]._id;
        allUsers.splice(randomUserIndex, 1);
        carts.push({ products: productsCart, user: userId });
      }
    }

    result = await cartModel.insertMany(carts);
    console.log(`${result.length} carts had been added`);
    mongoose.disconnect();
  } catch (err) {
    console.log("Ha ocurrido un error en script seed.carts.js");
    console.log(err);
  }
})();
