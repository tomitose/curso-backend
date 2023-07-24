const { Router } = require("express");
const { ProductManager } = require("../../../managers/ProductManager");

const myProducts = new ProductManager();
const router = Router();

// Llamo a todos los productos

router.get("/", async (req, res) => {
  const products = await myProducts.getProducts();
  const html = `<ul>${products
    .map(
      (product) => `
          <li>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
          </li>`
    )
    .join("")}
      </ul>`;
  res.send(html);
});

// Llamo al producto según su ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await myProducts.getProductById(id);

  if (product) {
    const html = `
        <ul>
          <li>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
          </li>
        </ul>
      `;
    res.send(html);
  } else {
    res
      .status(404)
      .send('<h1 style="text-align:center;">El producto no existe</h1>');
  }
});

// Agregar nuevo producto
router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    await myProducts.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    res.status(201).send("Producto agregado correctamente");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Actualizar un producto existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newProductData = req.body;

  try {
    await myProducts.updateProduct(id, newProductData);
    res
      .status(200)
      .send(`Producto ${newProductData.title} actualizado correctamente`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Eliminar un producto existente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProducts = await myProducts.deleteProduct(id);
    if (updatedProducts) {
      const html = `<ul>${updatedProducts
        .map(
          (product) => `
            <li>
              <h2>${product.title}</h2>
              <p>${product.description}</p>
              <p>Precio: ${product.price}</p>
              <p>Stock: ${product.stock}</p>
            </li>`
        )
        .join("")}
          </ul>`;
      res.send(html);
    } else {
      res
        .status(404)
        .send('<h1 style="text-align:center;">El producto no existe</h1>');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
