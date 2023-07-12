const express = require("express");
const fs = require("fs");
const ProductManager = require("../index.js");

const app = express();
const port = 8080;
const productManager = new ProductManager();
productManager.init();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Llamo a todos los productos
app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts()
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
    res.status(404).send('<h1 style="text-align:center;">El producto no existe</h1>');
  }
});

// Agregar nuevo producto
app.post("/api/products", (req, res) => {
  // Aquí puedes agregar la lógica para crear un nuevo producto
});

// Actualizar un producto existente
app.put("/api/products/:id", (req, res) => {
  // Aquí puedes agregar la lógica para actualizar un producto existente
});

// Eliminar un producto existente
app.delete("/api/products/:id", (req, res) => {
  // Aquí puedes agregar la lógica para eliminar un producto existente
});

app.listen(port, () => console.log(`Server Port: ${port}`));
