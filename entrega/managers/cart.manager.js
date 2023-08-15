const cartModel = require('../models/cart.model')
const mongoose = require('mongoose')

class CartManager {
  async createCart({ userId }) {
    console.log('El userId: ', userId)
    await cartModel.create({ user: new mongoose.Types.ObjectId(userId) })
  }

  async getById(id) {
    return await cartModel.findById(id)
  }
  //esta ruta busca el producto y lo aumenta en 1, o en cualquier cantidad pasada, si no existe lo crea y le pone el qty que corresponde.
  async getByIdAndAddProduct({ id, productId, qty = 1 }) {
    const cart = await cartModel.findById(id)
    if (!cart) {
      throw new Error('cart not found')
    }
    const existentProduct = cart.products.find(
      (p) => p.product.toString() === productId
    ) //--> Trucazo: se puede buscar dentro de un documento en particular, y dentro de este a su vez dentro de una propiedad del mismo.

    if (existentProduct) {
      console.log(existentProduct)
      existentProduct.qty += +qty //--> Esto que "conectado" al documento al que pertenece (se pasa como referencia) entonces si actualizo esto actualizo el documento tm
    } else {
      cart.products.push({
        product: new mongoose.Types.ObjectId(productId),
        qty,
      })
    }
    await cart.save()
    return true
  }

  async getByIdAndModifyProductQty({ id, productId, qty = 1 }) {
    try {
      await cartModel.updateOne(
        {
          _id: new mongoose.Types.ObjectId(id),
          'products.product': new mongoose.Types.ObjectId(productId), //-->aca seteo el valor del ($) como el indice del array que cumple con esta condicion.
        },
        { $set: { 'products.$.qty': qty } } // --> El operador ($) representa el índice del elemento coincidente en el array.
      )
    } catch (e) {
      console.log(
        'Error en el metodo getByIdAndModifyProductQty(), del cartManager'
      )
      console.log(e)
    }
  }

  async deleteProduct({ id, productId }) {
    await cartModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) }, // busco el documento.
      {
        $pull: {
          products: { product: new mongoose.Types.ObjectId(productId) },
        },
      } 
    )
    return
  }

  async clearProducts({ id }) {
    await cartModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: { products: [] },
      }
    )
  }
}

module.exports = new CartManager()


