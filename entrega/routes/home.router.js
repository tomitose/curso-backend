const { Router } = require('express')
const router = Router()
const productManager = require("../managers/product.manager");
const userManager = require('../managers/user.manager');
const isAuth = require('../middlewares/auth.middleware');



//estas rutas no tienen prefijo (api) son las visualizaciones del home.

router.get('/', async(req, res) => {
  const { limit, page } = req.query;
  // isNaN(Valor), devuelve true si Valor no es parseable a tipo Number
  if (isNaN(limit) && limit !== undefined) {
    res.send({
      status: "Error, the (limit) value is wrong",
      payload: null,
    });
    return;
  }
  const productsRaw = await productManager.getAll({ limit, page })
  const products = []
  productsRaw.forEach(p => {
    const {_id,title,description,price,category, ...rest} = p
    const product = {id:_id.toString(),title,description,price,category}
    products.push(product)
  })


  res.render('products', {
    products,
    route: {
      hasCSS: false,
      cssFile: null,
      hasSocket: false,
      hasJsFile: false,
      jsFile: null,
    },
  })
})

router.get('/chat', async(req, res) => {

  res.render('chat', {
    route: {
      hasCSS: true,
      cssFile: '/chat.css',
      hasSocket: true,
      hasJsFile: true,
      jsFile: '/chat.js',
      hasSwalt:true,
    },
  })
})

router.get('/realtimeproducts', async (req, res) => {

  const { limit, page } = req.query;
  // isNaN(Valor), devuelve true si Valor no es parseable a tipo Number
  if (isNaN(limit) && limit !== undefined) {
    res.send({
      status: "Error, the (limit) value is wrong",
      payload: null,
    });
    return;
  }
  const productsRaw = await productManager.getAll({ limit, page })
  const products = []
  productsRaw.forEach(p => {
    const {_id,title,description,price,category, ...rest} = p
    const product = {id:_id.toString(),title,description,price,category}
    products.push(product)
  })

  res.render('realtimeproducts', {
    products,
    route: {
      hasCSS: true,
      cssFile: "realtimeproducts.css",
      hasSocket: true,
      hasJsFile: true,
      jsFile: 'realtimeproducts.js',
    },
  })
})


// router.get('/carrito', (req, res) => {
//   // res.sendFile(path.join(__dirname, '../public/carrito.html'))
//   // interactuar con el manager de carrito
//   res.render('carrito', {
//     numItems: 2,
//     title: 'Carrito',
//     user: req.user ?  {
//       ...req.user,
//       isAdmin: req.user?.role == 'admin',
//     } : null,
//   })
// })


router.get('/signup', (_, res) => res.render('signup'))
router.post('/signup', async (req, res) => {
  const user = req.body
  
  console.log(user)

  const existing = await userManager.getByEmail(user.email)

  if (existing) {
    return res.render('signup', {
      error: 'El email ya existe'
    })
  }

  // crear al usuario
  try {
    const newUser = await userManager.create(user)

    console.log(newUser);


    req.session.user = {
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    }

    console.log(req.session)

    req.session.save((err) => {
      res.redirect('/')
    })

  } catch(e) {
    console.log(e)
    return res.render('signup', {
      error: 'Ocurrio un error. Intentalo mas tarde'
    })
  }
})



router.get('/login', (_, res) => res.render('login'))
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const user = await userManager.getByEmail(email);

    if (!user) {
      return res.render('login', { error: 'El usuario no existe' });
    }

    req.session.user = {
      name: user.firstname,
      id: user._id,
      // role: 'Admin'
      ...user
    };

    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
        res.render('login', { error: 'Ha ocurrido un error' });
      } else {
        console.log("Redirigiendo a /");
        res.redirect('/');
      }
    });
  } catch(e) {
    res.render('login', { error: 'Ha ocurrido un error' });
  }

  // guardo la session con la información del usuario
});

router.get('/logout', isAuth, (req, res) => {
  const { user } = req.cookies

  console.log(user)

  // borrar la cookie
  res.clearCookie('user')

  req.session.destroy((err) => {
    if(err) {
      return res.redirect('/error')
    }

    res.render('logout', {
      user: req.user.name
    })

    req.user = null
  })

  // res.render('logout', {
  //   user
  // })
})


module.exports = router
