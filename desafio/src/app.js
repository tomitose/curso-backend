//npm start para iniciar nodemon

import express from "express";
import fs from "fs";

const app = express();
const port = 5000;


app.use(express.urlencoded({extended:true}))

//Llamo a todos los productos 

app.get("/products", (req, res) => {
  const usuarios = JSON.parse(
    fs.readFileSync("./files/Usuarios.json", "utf-8")
  );
  const html = `<ul>${usuarios
    .map(
      (usuario) => `
    <li>
      <h2>${usuario.title}</h2>
      <p>${usuario.description}</p>
      <p>Precio: ${usuario.price}</p>
      <p>Stock: ${usuario.stock}</p>
    </li>`
    )
    .join("")}
  </ul>`;
  res.send(html);
});


//Llamo al producto según su ID

app.get("/products/:id", (req, res) => {
  const usuarios = JSON.parse(
    fs.readFileSync("./files/Usuarios.json", "utf-8")
  );
  const id = parseInt(req.params.id);
  const usuario = usuarios.find((usuario) => usuario.id === id);
  console.log(usuario)
  if (usuario) {
    const html = `
      <ul>
        <li>
          <h2>${usuario.title}</h2>
          <p>${usuario.description}</p>
          <p>Precio: ${usuario.price}</p>
          <p>Stock: ${usuario.stock}</p>
        </li>
      </ul>
    `;
    res.send(html);
  } else {
    res.status(404).send('<h1 style="text-align:center;">El producto no existe</h1>');
}
});

app.listen(port, () => console.log(`Server Port: ${port}`));
