
import express from 'express'
import { authenticateSeller } from '../middleware/auth.middleware.js'
import multer from 'multer'
import { createProduct, getSellerProduct, getAllProduct, getProductDetails,addProductVariant } from '../controller/product.controller.js'
import { createProductValid } from '../validator/product.validator.js'

const productRouter = express.Router()

const upload = multer({
    storage: multer.memoryStorage()
})

productRouter.post('/', authenticateSeller, upload.array('images', 7), createProductValid, createProduct)

productRouter.get('/seller', authenticateSeller, getSellerProduct)

productRouter.get('/', getAllProduct)

productRouter.get('/:productId', getProductDetails)

productRouter.post('/:productId/variants',authenticateSeller,upload.array('images',7),addProductVariant)

export default productRouter