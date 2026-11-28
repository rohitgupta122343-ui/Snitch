
import express from 'express'
import { getOrderById, createOrderr } from '../controller/cart.controller.js'
import { authenticateUser } from '../middleware/auth.middleware.js'
const orderRouter = express.Router()

orderRouter.post('/', authenticateUser, createOrderr)
orderRouter.get('/:orderId', authenticateUser, getOrderById)

export default orderRouter