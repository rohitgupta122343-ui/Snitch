
import expess from 'express'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { validateAddtoCart,validateIncrementCartItemQuantity } from '../validator/cart.validator.js'
import { addTocart, getCart,incrementCartItemQuantity,createOrderController,verifyOrderController,decrementCartItemQuantity } from '../controller/cart.controller.js'
const cartRouter = expess.Router()

cartRouter.post('/add/:productId/:variantId',authenticateUser,validateAddtoCart,addTocart)

cartRouter.get('/',authenticateUser,getCart)

cartRouter.patch("/quantity/increment/:productId/:variantId",authenticateUser,validateIncrementCartItemQuantity,incrementCartItemQuantity)

cartRouter.patch("/quantity/decrement/:productId/:variantId",authenticateUser,validateIncrementCartItemQuantity,decrementCartItemQuantity)

cartRouter.post('/payment/create/order',authenticateUser,createOrderController)

cartRouter.post('/payment/verify/order',authenticateUser,verifyOrderController)



export default cartRouter