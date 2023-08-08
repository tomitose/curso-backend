const { Router } = require('express')
const ProductsRouter = require('./api/products.router')
const CartsRouter = require('./api/carts.router')

// /api
const router = Router()

// rutas de products
router.use('/products', ProductsRouter )
// // rutas de carts
router.use('/carts', CartsRouter)


module.exports = {
  api: router
}