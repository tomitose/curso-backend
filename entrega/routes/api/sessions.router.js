const { Router } = require("express");
const isAuth = require("../../middlewares/auth.middleware");
const userManager = require("../../managers/user.manager");
const {hashPassword} = require('../../utils/password.utils')

const router = Router()

router.get("/signup", (_, res) => res.render("signup"));
router.get('/login', (_, res) => res.render('login'))


//controllers:

const signup = async (req, res) => {
  const user = req.body;

  console.log(user);
  
  const existing = await userManager.getByEmail(user.email);
  
  if (existing) {
    return res.render("signup", {
      error: "El email ya existe",
    });
  }

  if (user.password !== user.password2) {
    return res.render("signup", {
      error: "Las contraseñas no coinciden",
    });
  }

  // crear al usuario
  try {
    const newUser = await userManager.create({
      ...user,
      password: hashPassword(user.password)
    });

    req.session.user = {
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc,
    };

    console.log(req.session);

    req.session.save((err) => {
      res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    return res.render("signup", {
      error: "Ocurrio un error. Intentalo mas tarde",
    });
  }
}
const login = async (req, res) => {
  // console.log(req.body);
   console.log("session: ", req.session);
   console.log("Hola tomi")
   const { email } = req.body;
 
   try {
     const user = await userManager.getByEmail(email).lean();
     console.log("user: ", user);
     if (!user) {
       return res.render("login", { error: "El usuario no existe" });
     }
 
     req.session.user = {
       name: user.firstname,
       id: user._id,
       // role: 'Admin'
       ...user,
     };
 
     console.log(req.session);
 
     req.session.save((err) => {
       if (err) {
         console.error("Error al guardar la sesión:", err);
         res.render("login", { error: "Ha ocurrido un error" });
       } else {
         console.log("Redirigiendo a /");
         res.redirect("/");
       }
     });
   } catch (e) {
     console.log(e);
     res.render("login", { error: "Ha ocurrido un error" });
   }
 
   // guardo la session con la información del usuario
 }
const logout = (req, res) => {
  const { user } = req.cookies;

  // borrar la cookie
  res.clearCookie("user");

  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/error");
    }

    res.render("logout", {
      user: req.user.name,
    });

    req.user = null;
  });

  // res.render('logout', {
  //   user
  // })
}


//routes :

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", isAuth, logout);


module.exports = router