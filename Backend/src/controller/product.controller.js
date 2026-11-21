
import { uploadFile } from "../services/storage.service.js"
import productModel from "../model/product.model.js"

export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency, color } = req.body
    const seller = req.user
    console.log(req.files)
    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))


    const product = await productModel.create({

        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency
        },
        color: color || '',
        seller: seller._id,
        images

    })

    res.status(201).json({
        message: 'Product created sucessfully',
        product,
        success: true
    })


}

export async function getSellerProduct(req, res) {

    const seller = req.user

    const products = await productModel.find({ seller: seller._id })

    res.status(200).json({
        message: 'product fetch sucessfully',
        success: true,
        products
    })
}

export async function getAllProduct(req, res) {

    const product = await productModel.find()

    res.status(200).json({
        message: 'Product fetch successfully',
        product
    })

}

export async function getProductDetails(req, res) {

    console.log(req.params.productId)
    const productId = req.params.productId

    const product = await productModel.findById(productId)

    res.status(200).json({
        message: 'Product Fetch successfully',
        product
    })

}

export async function addProductVariant(req,res){


    const productId = req.params.productId

    const product = await productModel.findOne({
        _id:productId,
        seller:req.user._id
    })

    if(!product){
        return res.status(404).json({
            message : 'product not found',
            success:false
        })
    }

    const files = req.files
    const images = []

    if(files || files.length !== 0){
        (await Promise.all(files.map(async(file)=>{
            const image = await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname
            })
            return image
        }))).map(image => images.push(image))
    }

    const price = req.body.priceAmount
    const stock = req.body.stock
    const attributes = JSON.parse(req.body.attributes || "{}")


    product.variants.push({
        images,
        price:{
            amount:price || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save()

    return res.status(200).json({
        message :'Product variants added successfully',
        product
    })

}