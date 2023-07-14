const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
const PATH = "./data/products.json"

class ProductManager {
  constructor() {
    this.products = [];
    this.path = PATH;
  }

  // Obtener productos
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

  // Agregar producto
  async addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !code || !stock) {
      throw new Error("Falta agregar un campo");
    }

    if (this.products.some((product) => product.code === code)) {
      console.log("El código del producto ya existe");
    } else {
      const existingProducts = await this.getProducts();
      const product = {
        id:
          existingProducts.length > 0
            ? existingProducts[existingProducts.length - 1].id + 1
            : 1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      existingProducts.push(product);
      const data = { products: existingProducts };
      try {
        await writeFileAsync(this.path, JSON.stringify(data.products), "utf-8");
        console.log("Producto fue agregado correctamente");
      } catch (error) {
        console.log("Error al agregar producto:", error);
      }
    }
  }

  // Obtener producto por ID
  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id === parseInt(id));
    if (!product) {
      console.log("Producto no encontrado");
      return null;
    } else {
      console.log(`El id del producto es: `, product.id);
      return product;
    }
  }

  // Actualizar producto
  async updateProduct(id, newProductData) {
    const products = await this.getProducts();
  
    const productIndex = products.findIndex((product) => product.id === parseInt(id));
  
    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
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
      let products = await this.getProducts();
      const productIndex = products.findIndex((product) => product.id === parseInt(id));
  
      if (productIndex === -1) {
        console.log("Producto no encontrado");
        return null;
      }
  
      products.splice(productIndex, 1);
  
      const data = { products };
      await writeFileAsync(this.path, JSON.stringify(data.products), "utf-8");
      console.log("Producto eliminado correctamente");
  
      return products;
    } catch (error) {
      console.log("Error al eliminar producto:", error);
      return null;
    }
  }
  
  

  // Inicialización: agregar productos
  async init() {
    const existingProducts = await this.getProducts();
    if (existingProducts.length === 0) {
      // Agregar los productos aquí si el archivo está vacío
      this.addProduct(
        "producto 1",
        "Este es un producto 1",
        200,
        "Sin imagen",
        1,
        25
      );
      this.addProduct(
        "producto 2",
        "Este es un producto 2",
        300,
        "Sin imagen",
        2,
        30
      );
      this.addProduct(
        "producto 3",
        "Este es un producto 3",
        300,
        "Sin imagen",
        3,
        30
      );
    } else {
      // Mostrar los productos existentes si el archivo ya los contiene
      console.log("Productos existentes:", existingProducts);
    }
  }
}

module.exports = ProductManager;
