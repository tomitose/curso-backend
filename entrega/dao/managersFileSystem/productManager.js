
// const fs = require("fs");
// const path = require("path");

// class ProductManager {
//   constructor(fileNameDB) {
//     this.productsCode = [];
//     this.products = [];
//     this.currentId = 0;
//     this.path = path.join(__dirname, "..", "data", fileNameDB); 

//     this.getSavedProducts = async function () {
//       if (fs.existsSync(this.path)) {
//         const allProductstFile = fs.readFileSync(this.path);
//         this.products = JSON.parse(allProductstFile);
//         this.products.forEach((product) => {
//           this.productsCode.push(product.code);
//         });
//         if (this.products.length) {
//           this.currentId = this.products[this.products.length - 1].id;
//         }
//       }
//     };
//     this.getSavedProducts();
//   }

//   async addProduct({
//     title,
//     description,
//     price,
//     code,
//     stock,
//     category,
//     status = true,
//     thumbnails,
//   }) {
//     const productToAdd = {
//       title,
//       description,
//       price,
//       code,
//       stock,
//       status,
//       category,
//     };

//     if (
//       !this.productsCode.includes(code) &&
//       !Object.values(productToAdd).includes(undefined)
//     ) {
//       productToAdd.thumbnails = thumbnails; 
//       this.currentId += 1;
//       productToAdd.id = this.currentId;
//       this.productsCode.push(productToAdd.code);
//       this.products.push(productToAdd);
//       if (!fs.existsSync(this.path)) {
//         fs.writeFileSync(this.path, JSON.stringify(this.products));
//       } else {
//         const allProductstFile = fs.readFileSync(this.path);
//         const allProductsAsArray = JSON.parse(allProductstFile);
//         allProductsAsArray.push(productToAdd);
//         fs.writeFileSync(this.path, JSON.stringify(allProductsAsArray));
//       }
//       return true; 
//     } else {
//       if (this.productsCode.includes(code)) {
//         throw new Error(
//           "El campo code del producto que se intenta agregar, ya pertenece a otro producto"
//         );
//       } else {
//         throw new Error("Productos con los parametros mal definidos");
//       }
//     }
//   }

//   getProducts() {
//     return this.products;
//   }

//   showProductsCode() {
//     console.log(this.productsCode);
//   }

//   getProductById(idFounded) {
//     for (let product of this.products) {
//       if (product.id === idFounded) {
//         return product;
//       }
//     }
//     throw new Error(`Not found, any product have the id: ${idFounded}`);
//   }

//   checkProductExistence(productId) {
//     if (this.getProductById(productId)) {
//       return true;
//     } else {
//       throw Error("product id not found");
//     }
//   }

//   deleteProductById(idProduct) {
//     try {
//       const productToDelete = this.getProductById(idProduct);
//       const index = this.products.indexOf(productToDelete);
//       this.products.splice(index, 1);
//       fs.writeFileSync(this.path, JSON.stringify(this.products));
//       return true;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async updateProductById(productId, newPropiertiesValues) {
//     try {
//       const productModify = this.getProductById(productId);
//       const propiertiesNames = Object.keys(newPropiertiesValues);
//       if (propiertiesNames.includes("id")) {
//         throw new Error("The Product id can't be modified");
//       } else {
        
//         if (propiertiesNames.includes("code")) {
//           if (
//             this.productsCode.includes(newPropiertiesValues["code"]) &&
//             productModify["code"] !== newPropiertiesValues["code"]
//           ) {
//             throw new Error(
//               "The value of the new code alredy owns to another product"
//             );
//           } else {
//             const oldCodeIndex = this.productsCode.indexOf(
//               newPropiertiesValues.code
//             );
//             const newCodeValue = propiertiesNames.code;
//             this.productsCode.splice(oldCodeIndex, 1, newCodeValue);
//           }
//         }
//         propiertiesNames.forEach((propierty) => {
//           productModify[propierty] = newPropiertiesValues[propierty];
//         });
//         fs.writeFileSync(this.path, JSON.stringify(this.products));
//       }
//     } catch (err) {
//       throw err;
//     }
//   }

//   modifyProductById(idProduct, newProduct) {
//     try {
//       const oldProduct = this.getProductById(idProduct);
//       const codeTodelete = oldProduct.code;
//       const { title, description, price, thumbnail, code, stock } = newProduct;
//       const productUpdated = {
//         title,
//         description,
//         price,
//         thumbnail,
//         code,
//         stock,
//       };

//       const arrayCodeAuxiliar = [...this.productsCode]; 
//       arrayCodeAuxiliar.splice(this.productsCode.indexOf(codeTodelete), 1);

//       if (
//         !Object.values(productUpdated).includes(undefined) &&
//         !arrayCodeAuxiliar.includes(code)
//       ) {
//         this.productsCode.splice(
//           this.productsCode.indexOf(codeTodelete),
//           1,
//           code
//         ); 
//         productUpdated.id = oldProduct.id; 
//         this.products.splice(
//           this.products.indexOf(oldProduct),
//           1,
//           productUpdated
//         );
//         fs.writeFileSync(this.path, JSON.stringify(this.products));
//       } else {
//         if (this.productsCode.includes(code)) {
//           throw new Error(
//             "Se intenta modificar un producto, pero el campo code coincide con otro producto, solo se permite que coincida con el codigo que tenia el mismo producto anteriormente."
//           );
//         } else {
//           throw new Error("Productos con los parametros mal definidos");
//         }
//       }
//     } catch (err) {
//       throw err;
//     }
//   }
// }

// module.exports = {
//   ProductManager,
// };
