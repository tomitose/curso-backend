const { Router } = require('express')
const ProductRoutes = require('./api/products.router.js')
const UserRoutes = require('./api/users.router.js')
const SessionRoutes = require('./api/sessions.router.js')
const HomeRoutes = require('./home.router.js')
// const LoginRoutes = require('./login.router.js')
const AdminRoutes = require('./admin.router.js')


const api = Router();

api.use('/products', ProductRoutes);
api.use('/users', UserRoutes);
api.use('/sessions',SessionRoutes)
const home = Router()


home.use('/', HomeRoutes)
// home.use('/', LoginRoutes)


home.use('/admin', AdminRoutes)

module.exports = {
  api,
  home
};