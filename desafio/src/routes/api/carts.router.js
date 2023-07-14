const { Router } = require("express");
const { CartManager } = require("../../../managers/CartManager");
const { ProductManager } = require("../../../managers/ProductManager");

const myProducts = new ProductManager("products.json");
const myCarts = new CartManager("carts.json");
const router = Router();

// Ver los todos los productos del carrito
router.get("/", async (req, res) => {
    try {
      const carts = await myCarts.getAllCarts();
      res.send({ status: "Success", payload: carts });
    } catch (error) {
      res.status(500).send({ status: "Error", message: "Error al obtener los carritos" });
    }
  });


// Obtener productos de un carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await myCarts.getCartById(cartId);
    if (cart) {
      res.send({ status: "Success", payload: cart.products });
    } else {
      res.status(404).send({ status: "Error", message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(400).send({ status: "Error", message: "ID del carrito inválido" });
  }
});

// Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await myCarts.getCartById(cartId);
    if (!cart) {
      res.status(404).send({ status: "Error", message: "Carrito no encontrado" });
      return;
    }

    const product = await myProducts.getProductById(productId);
    if (!product) {
      res.status(404).send({ status: "Error", message: "Producto no encontrado" });
      return;
    }

    const existingProduct = cart.products.find((p) => p.id === productId); // Cambiar 'product' a 'id'
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ id: productId, quantity: 1 }); // Cambiar 'product' a 'id'
    }

    await myCarts.updateCartItem(cartId, cart); // Cambiar 'updateCart' a 'updateCartItem'

    res.send({
      status: "Success",
      message: `Producto (ID: ${productId}) agregado al carrito (ID: ${cartId})`,
    });
  } catch (error) {
    res.status(400).send({ status: "Error", message: error.message });
  }
});


module.exports = router;
