const { Router } = require("express");
const cartManager = require("../../managers/cart.manager")

const router = Router(); 


router.post('/', async (req = request, res) => {
  try {
    const { userId } = req.query
    //aca podria ver si ese usuario ya tiene un carrito, y si lo tiene no lo creo y traigo el ya creado.

    if (!userId) {
      throw new Error('userId must be a query param')
    }

    await cartManager.createCart({ userId })
    res.send({ status: 'Success, a new was created' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: 'Error', Error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const cartId = req.params.id
    const cart = await cartManager.getById(cartId)
    if (!cart) {
      throw new Error('cart not found')
    }
    res.send({ status: 'success', payload: cart.products })
  } catch (e) {
    res.send({ status: 'Error', Error: e.message })
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const id = req.params.cid 
    const productId = req.params.pid
    const qty = req.query.qty
    const wasAdded = await cartManager.getByIdAndAddProduct({
      id,
      productId,
      qty,
    })
    if (wasAdded) {
      res.send({
        status: `Success the product (id=${productId}), was added to the cart (id=${id})`,
      })
    }
  } catch (e) {
    console.log(e)
    res.send({ status: `Error`, Error: e.message })
  }
})


router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const id = req.params.cid //es el id del cart
    const productId = req.params.pid
    const qty = +req.body.qty
    await cartManager.getByIdAndModifyProductQty({
      id,
      productId,
      qty,
    })

    res.send({
      status: 'success',
      payload: {
        operation: 'Update quantity of a sigle product in cart',
        cart: id,
        product: productId,
        quantity: qty,
      },
    })
  } catch (e) {
    console.log(e)
    res.send({ status: `Error`, Error: e.message })
  }
})


//Elimina un producto de un carrito. (elimina todas las cantidades que haya del mismo)
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const id = req.params.cid //es el id del cart
    const productId = req.params.pid
    await cartManager.deleteProduct({
      id,
      productId,
    })

    res.status(200).send({
      status: 'success',
      payload: {
        operation: 'delete product from cart',
        cart: id,
        product: productId,
      },
    })
  } catch (e) {
    console.log(e)
    res.send({ status: `Error`, Error: e.message })
  }
})

//Para vaciar un carrito entero (elimina todos los productos)

router.delete('/:cid', async (req, res) => {
  try {
    const id = req.params.cid

    await cartManager.clearProducts({
      id,
    })

    res.status(200).send({
      status: 'success',
      payload: {
        operation: 'delete all products from cart',
        cart: id,
      },
    })
  } catch (e) {
    console.log(e)
    res.send({ status: `Error`, Error: e.message })
  }
})

module.exports = router;
