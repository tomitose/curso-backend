class ProductManager {
  constructor() {
    this.products = [];
  }

  // Obtener productos
  getProducts() {
    return this.products;
  }

  // Agregar producto
  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Falta agregar un campo");
      return;
    }

    if (this.products.some((product) => product.code === code)) {
      console.log("El código del producto ya existe");
      return;
    }

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
  }

  // Obtener producto por ID
  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.log("Producto no encontrado");
      return null;
    } else {
      return product;
    }
  }
}

// Se agregan 3 productos
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

// Busco todos los productos
// console.log(productManager.getProducts());

// Busco el producto con el ID:2
console.log(productManager.getProductById(2));
