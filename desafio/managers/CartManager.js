const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
const PATH = "./data/carts.json";

class CartManager {
  constructor() {
    this.cart = [];
    this.path = PATH;
  }

  async getAllCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      if (!data) {
        console.log("El archivo está vacío");
        return []; // Retorna un arreglo vacío si el archivo está vacío
      }
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo:", error);
      return []; // Retorna un arreglo vacío en caso de error
    }
  }

  async addToCart(productId, quantity) {
    if (!productId || !quantity) {
      throw new Error("Falta agregar un campo");
    }

    const product = await this.getProductById(productId);
    if (!product) {
      console.log("El producto no existe");
      return;
    }

    const existingCart = await this.getCart();

    const cartItem = {
      id: existingCart.length + 1,
      productId,
      quantity,
    };

    existingCart.push(cartItem);

    const data = { cart: existingCart };
    try {
      await writeFileAsync(this.path, JSON.stringify(data.cart), "utf-8");
      console.log("Producto agregado al carrito correctamente");
    } catch (error) {
      console.log("Error al agregar producto al carrito:", error);
    }
  }

  async getCartById(cartId) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find((item) => item.id === parseInt(cartId));
      if (!cart) {
        console.log("Carrito no encontrado");
        return null;
      } else {
        console.log(`El id del carrito es: ${cart.id}`);
        return cart;
      }
    } catch (error) {
      console.log("Error al obtener el carrito:", error);
      return null;
    }
  }

  async updateCartItem(cartId, newQuantity) {
    const cart = await this.getCart();

    const cartItemIndex = cart.findIndex(
      (item) => item.id === parseInt(cartId)
    );

    if (cartItemIndex === -1) {
      throw new Error("Elemento del carrito no encontrado");
    }

    const updatedCartItem = {
      ...cart[cartItemIndex],
      quantity: newQuantity,
    };

    cart[cartItemIndex] = updatedCartItem;

    try {
      await writeFileAsync(this.path, JSON.stringify(cart), "utf-8");
      console.log("Elemento del carrito actualizado correctamente");
    } catch (err) {
      console.log("Error al actualizar elemento del carrito:", err);
    }
  }

  async removeCartItem(cartId) {
    try {
      let cart = await this.getCart();
      const cartItemIndex = cart.findIndex(
        (item) => item.id === parseInt(cartId)
      );

      if (cartItemIndex === -1) {
        console.log("Elemento del carrito no encontrado");
        return null;
      }

      cart.splice(cartItemIndex, 1);

      const data = { cart };
      await writeFileAsync(this.path, JSON.stringify(data.cart), "utf-8");
      console.log("Elemento del carrito eliminado correctamente");

      return cart;
    } catch (error) {
      console.log("Error al eliminar elemento del carrito:", error);
      return null;
    }
  }

}

module.exports = {CartManager}
