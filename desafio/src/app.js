const express = require("express");
const fs = require("fs");
const ProductManager = require("../managers/ProductManager.js");

const app = express();
const port = 8080;
const productManager = new ProductManager();
productManager.init();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Llamo a todos los productos
app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
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
app.get("/api/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const product = await productManager.getProductById(id);

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
app.post("/api/products", async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    await productManager.addProduct(
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
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const newProductData = req.body;

  try {
    await productManager.updateProduct(id, newProductData);
    res.status(200).send(`Producto ${newProductData.title} actualizado correctamente`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Eliminar un producto existente
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProducts = await productManager.deleteProduct(id);
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
      res.status(404).send('<h1 style="text-align:center;">El producto no existe</h1>');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(port, () =>
  console.log(`Server Port: http://localhost:${port}/api/products`)
);
