const { Router } = require("express");
const { CartManager } = require("../../../managers/CartManager");
const { ProductManager } = require("../../../managers/ProductManager");

const myProducts = new ProductManager("products.json");
const myCarts = new CartManager("carts.json");
const router = Router(); 


router.post("/", async (req, res) => {
  try {
    const products = [];
    await myCarts.addCart({ products });
    res.send({ status: "Success" });
  } catch (e) {
    res.status(500).send({ status: "Error, el carrito no fue creado" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = +req.params.cid; 
    const cart = await myCarts.getCartById(cartId);
    res.send({ status: "Success", payload: cart.products });
  } catch (e) {
    res.send({ status: "Carrito no encontrado", payload: null });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = +req.params.cid;
    const productId = +req.params.pid;
    myCarts.checkCartExistence(cartId); 
    myProducts.checkProductExistence(productId); 
    const wasProductAdded = myCarts.addProductToCart(cartId, productId);
    if (wasProductAdded) {
      res.send({
        status: `Success (id=${productId}), fue agregado al carrito (id=${cartId})`,
      });
    }
  } catch (e) {
    res.send({ status: `Error`, Error: e.message });
  }
});

module.exports = router;
