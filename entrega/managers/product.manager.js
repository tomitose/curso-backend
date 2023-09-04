const productModel = require("../models/product.model");

class ProductManager {
  async addProduct(product) {
    return await productModel.create(product);
  }

  async getAll({ limit = undefined, page = 1 }) {
    try {
      if (!limit) {
        return await productModel.find({});
      } else {
        return await productModel
          .find({})
          .limit(limit)
          .skip((page - 1) * limit);
      }
    } catch (e) {
      console.log("Error en el metodo getAll() del ProductManager");
    }
  }


  async getById(id) {
    try{
      return await productModel.findOne({ _id: id });
    }catch (e){
      console.log("Error en el metodo getById() del ProductManager")
      console.log(e)
    }
  }

  async create(body) {
    return productModel.create(body)
  }

  async updateById(id, productUpdated) {
    return await productModel.findOneAndUpdate({ _id: id }, productUpdated,{ new: true });
  }

  async deleteById(id) {
    return await productModel.deleteOne({ _id: id });
  }
}

module.exports = new ProductManager(); // singleton
