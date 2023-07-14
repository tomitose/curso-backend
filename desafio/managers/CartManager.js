const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
const PATH = "./data/cart.json";

class CartManager {
  constructor() {
    this.cart = [];
    this.path = PATH;
  }

  async getCart() {
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

  async getCartItemById(cartItemId) {
    const cart = await this.getCart();
    const cartItem = cart.find((item) => item.id === parseInt(cartItemId));
    if (!cartItem) {
      console.log("Elemento del carrito no encontrado");
      return null;
    } else {
      console.log(`El id del elemento del carrito es: ${cartItem.id}`);
      return cartItem;
    }
  }

  async updateCartItem(cartItemId, newQuantity) {
    const cart = await this.getCart();

    const cartItemIndex = cart.findIndex(
      (item) => item.id === parseInt(cartItemId)
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

  async removeCartItem(cartItemId) {
    try {
      let cart = await this.getCart();
      const cartItemIndex = cart.findIndex(
        (item) => item.id === parseInt(cartItemId)
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

  async init() {
    const existingCart = await this.getCart();
    if (existingCart.length === 0) {
      // Agregar los elementos del carrito aquí si el archivo está vacío
      this.addToCart(1, 2); // Ejemplo: Agregar el producto con ID 1 y cantidad 2 al carrito
      this.addToCart(2, 1); // Ejemplo: Agregar el producto con ID 2 y cantidad 1 al carrito
    } else {
      // Mostrar los elementos del carrito existentes si el archivo ya los contiene
      console.log("Elementos del carrito existentes:", existingCart);
    }
  }
}

module.exports = CartManager;
