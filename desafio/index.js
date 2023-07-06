import fs from "fs";
import util from "util";


const app = fs;
const writeFileAsync = util.promisify(app.promises.writeFile);
const PATH = "./files/Usuarios.json";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = PATH; 
  }

  //Obtener productos
  async getProducts() {
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

  //Agregar producto
  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Falta agregar un campo");
      return;
    }
  
    if (this.products.some((product) => product.code === code)) {
      console.log("El código del producto ya existe");
    } else {
      const product = {
        id: this.products.length + 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      this.products.push(product);
      const data = { products: this.products };
      try {
        await app.promises.writeFile(
          this.path,
          JSON.stringify(data.products),
          "utf-8"
        );
        console.log("Producto fue agregado correctamente");
      } catch (error) {
        console.log("Error al agregar producto:", error);
      }
    }
  }

  //obtener producto por ID
  async getProductById(id) {
    const products = await this.getProducts();
    const productId = products.find((product) => product.id === id);
    if (!productId) {
      console.log("Producto no encontrado");
    } else {
      console.log(`El id del producto es: `, productId.id);
    }
  }

  // Actualizar producto
  async updateProduct(id, newProductData) {
    const products = await this.getProducts();
  
    const productIndex = products.findIndex(
      (product) => product.id === id
    );
  
    if (productIndex === -1) {
      console.log("Producto no encontrado");
      return;
    }
  
    const updatedProduct = {
      ...products[productIndex],
      ...newProductData,
    };
    products[productIndex] = updatedProduct;
  
    try {
      await writeFileAsync(this.path, JSON.stringify(products), "utf-8");
      console.log("Producto actualizado correctamente");
    } catch (err) {
      console.log("Error al actualizar producto:", err);
    }
  }

  // Eliminar producto
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((product) => product.id === id);
  
      if (productIndex === -1) {
        console.log("Producto no encontrado");
        return;
      }
  
      products.splice(productIndex, 1);
  
      await app.promises.writeFile(this.path, JSON.stringify(products), "utf-8");
      console.log("Producto eliminado correctamente");
    } catch (error) {
      console.log("Error al eliminar producto:", error);
    }
  }
}

//se agregan 3 productos
const productManager = new ProductManager();
productManager.addProduct(
  "producto 1",
  "Este es un producto 1",
  200,
  "Sin imagen",
  1,
  25
);
productManager.addProduct(
  "producto 2",
  "Este es un producto 2",
  300,
  "Sin imagen",
  2,
  30
);
productManager.addProduct(
  "producto 3",
  "Este es un producto 3",
  300,
  "Sin imagen",
  3,
  30
);

//Busco todos los productos
console.log(productManager.getProducts());

//Busco el producto con el ID:2
// console.log(productManager.getProductById(2));

//Actualizo el producto que quiero
// console.log(productManager.updateProduct(2,{title:"producto 2 modificado",stock:60}))

//Elimino el producto con el ID que pongo
// console.log(productManager.deleteProduct(3))
