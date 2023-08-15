const { Router } = require("express");
const router = Router(); 
const productManager = require("../../managers/product.manager");
const productModel = require("../../models/product.model");


router.get("/", async (req, res) => {
  const { limit, page } = req.query;
  if (isNaN(limit) && limit !== undefined) {
    res.send({
      status: "Error, the (limit) value is wrong",
      payload: null,
    });
    return;
  }
  res
    .status(200)
    .send({
      status: "success",
      payload: await productManager.getAll({ limit, page }),
    });
  return;
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    product = await productManager.getById(id);
    res.send({ status: "success", payload: product });
  } catch {
    res.send({ status: "product not found", payload: null });
  }
});

router.post("/", async (req, res) => {
  const {body} = req
  const product = await productModel.create(body)
  console.log(product)

  res.status(201).send(product)
});

router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newPropiertiesValues = req.body;
    const productUpdated = await productManager.updateById(
      id,
      newPropiertiesValues
    );
    res.send({ status: "success", payload: productUpdated });
  } catch (e) {
    res.status(500).send({ status: "Error", "Error type": e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const info = await productManager.deleteById(id);
    if (info.deletedCount === 1) {
      res.send({ status: `success, the product with id:${id} was deleted` });
      return;
    }
    res.status(404).send({ status: `error, product not found` });
    return;
  } catch (err) {
    res.send({ status: "Error", "Error type": err.message });
  }
});

module.exports = router;
