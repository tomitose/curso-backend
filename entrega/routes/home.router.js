const { Router } = require("express");
const router = Router();
const productManager = require("../managers/product.manager");
const isAuth = require("../middlewares/auth.middleware");


//estas rutas no tienen prefijo (api) son las visualizaciones del home.


router.get('/', async (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'))
  const { page = 1, size = 5 } = req.query
  const { docs: products, ...pageInfo } = await productManager.getAllPaged(page, size)

  pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}&size=${size}` : ''
  pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}&size=${size}` : ''

  // console.log("ID del product manager desde home router", productManager.id)

  // console.log(pageInfo)

  req.session.homeCount = (req.session.homeCount || 0) + 1

console.log( "aca va el :" , req.session)

  res.render('products.handlebars', {
    title: 'Home',
    products,
    pageInfo,
    user: req.session.user ?  {
      ...req.session.user,
      isAdmin: req.user?.role == 'admin',
    } : null,
    style: 'home'
  })
})

router.get("/login", (_, res) => res.render("login"));



router.get("/chat", async (req, res) => {
  res.render("chat", {
    route: {
      hasCSS: true,
      cssFile: "/chat.css",
      hasSocket: true,
      hasJsFile: true,
      jsFile: "/chat.js",
      hasSwalt: true,
    },
  });
});


router.get("/realtimeproducts", async (req, res) => {
  const { limit, page } = req.query;
  // isNaN(Valor), devuelve true si Valor no es parseable a tipo Number
  if (isNaN(limit) && limit !== undefined) {
    res.send({
      status: "Error, the (limit) value is wrong",
      payload: null,
    });
    return;
  }
  const productsRaw = await productManager.getAll({ limit, page });
  const products = [];
  productsRaw.forEach((p) => {
    const { _id, title, description, price, category, ...rest } = p;
    const product = { id: _id.toString(), title, description, price, category };
    products.push(product);
  });

  res.render("realtimeproducts", {
    products,
    route: {
      hasCSS: true,
      cssFile: "realtimeproducts.css",
      hasSocket: true,
      hasJsFile: true,
      jsFile: "realtimeproducts.js",
    },
  });
});


router.get('/profile', isAuth, (req, res) => {
  res.render('profile', {
    user: req.session.user ?  {
      ...req.session.user,
      isAdmin: req.session.user?.role == 'admin',
    } : null,
  })
})

module.exports = router;
