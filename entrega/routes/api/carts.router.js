const { Router } = require("express");
const { CartManager } = require("../../dao/managersFileSystem/cartManager");
const productManager = require('../../managers/product.manager')
// const { validationProductExistence } = require("../../middelwares/validations");

const myCarts = new CartManager("carts.json");
const router = Router(); 


router.post("/", async (req, res) => {
  try {
    const products = [];
    await productManager.addCart({ products });
    res.send({ status: "Success, a new was created" });
  } catch (e) {
    res.status(500).send({ status: "Error, the cart was not created" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = +req.params.cid; 
    const cart = await myCarts.getCartById(cartId);
    res.send({ status: "Success", payload: cart.products });
  } catch (e) {
    res.send({ status: "Cart Not Found", payload: null });
  }
});

router.post("/:cid/product/:id", async (req, res) => {
  try {
    const cartId = +req.params.cid;
    const productId = +req.params.id;
    myCarts.checkCartExistence(cartId); 
    myProducts.checkProductExistence(productId); 
    const wasProductAdded = myCarts.addProductToCart(cartId, productId);
    if (wasProductAdded) {
      res.send({
        status: `Success the product (id=${productId}), was added to the cart (id=${cartId})`,
      });
    }
  } catch (e) {
    res.send({ status: `Error`, Error: e.message });
  }
});

module.exports = router;
