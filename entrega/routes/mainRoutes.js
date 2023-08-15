const { Router } = require('express');
const ProductsRouter = require('./api/products.router');
const CartsRouter = require('./api/carts.router');
const HomeRouter = require('./home.router.js');
const MessageRouter = require('./api/messages.router');
const routerApi = Router();
const routerHome = Router();



// rutas de products
routerApi.use('/products', ProductsRouter )
// // rutas de carts
routerApi.use('/carts', CartsRouter)
//rutas de messages
routerApi.use('/messages', MessageRouter)


routerHome.use('/', HomeRouter)


module.exports = {
  api:routerApi,
  home:routerHome
}