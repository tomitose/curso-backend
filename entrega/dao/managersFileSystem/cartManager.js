const fs = require("fs");
const path = require("path");

class CartManager {
  constructor(fileNameDB) {
    this.carts = [];
    this.currentId = 0;
    this.path = path.join(__dirname, "..", "data", fileNameDB); 

    this.getSavedCarts = async function () {
      if (fs.existsSync(this.path)) {
        const allCartsFile = fs.readFileSync(this.path);
        this.carts = JSON.parse(allCartsFile);

        if (this.carts.length) {
          this.currentId = this.carts[this.carts.length - 1].id;
        }
      }
    };
    this.getSavedCarts();
  }

  async addCart({ products }) {
    this.currentId += 1;
    const cartToAdd = {};
    cartToAdd.products = products;
    cartToAdd.id = this.currentId;

    this.carts.push(cartToAdd);

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify(this.carts));
    } else {
      const allCartsFile = fs.readFileSync(this.path);
      const allCartssAsArray = JSON.parse(allCartsFile);
      allCartssAsArray.push(cartToAdd);
      fs.writeFileSync(this.path, JSON.stringify(allCartssAsArray));
    }
    return true;
  }

  getCarts() {
    return this.carts;
  }

  getCartById(idFounded) {
    for (let cart of this.carts) {
      if (cart.id === idFounded) {
        return cart;
      }
    }
    throw new Error("cart id not found");
  }

  checkCartExistence(cartId){
    if(this.getCartById(cartId)){
      return true
    }else{
      throw Error("cart id not found")
    }
  }

  deleteCartByID(cartId) {
    try {
      const cartToDelete = this.getChartById(cartId);
      const index = this.carts.indexOf(cartToDelete);
      this.carts.splice(index, 1);
      fs.writeFileSync(this.path, JSON.stringify(this.carts));
    } catch (err) {
      throw err;
    }
  } 

  addProductToCart(cartId, productId) {
    try {
      const cart = this.getCartById(cartId);
      const indexCart = this.carts.indexOf(cart);
      let productToAdd;
      let isProductAlredyInCart = false;
      for (let product of cart.products) {
        if (product.productId === productId) {
          product.quantity++;
          isProductAlredyInCart = true;
        }
      }

      if (!isProductAlredyInCart) {
        productToAdd = { productId: productId, quantity: 1 };
        cart.products.push(productToAdd);
      }

      this.carts.splice(indexCart, 1, cart);
      fs.writeFileSync(this.path, JSON.stringify(this.carts));
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = {
  CartManager,
};
