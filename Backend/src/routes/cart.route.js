
import expess from 'express'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { validateAddtoCart } from '../validator/cart.validator.js'
import { addTocart, getCart } from '../controller/cart.controller.js'
const cartRouter = expess.Router()

cartRouter.post('/add/:productId/:variantId',authenticateUser,validateAddtoCart,addTocart)

cartRouter.get('/',authenticateUser,getCart)


export default cartRouter