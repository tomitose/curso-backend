const {Router} = require("express");
const path= require("path");
const {ProductManager} = require('../../managers/ProductManager');
const productManager = new ProductManager('products.json')

const router = Router();

router.get("/", async (req, res) => {
    // res.sendFile(path.join(__dirname, "../../public/index.html"))
    const products = await productManager.getProducts()
    res.render('realtimeproducts', {
        nombre: 'Lucas',
        products
    })
})

module.exports = router