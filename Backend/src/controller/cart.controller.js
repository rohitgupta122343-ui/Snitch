
import cartModel from "../model/cart.model.js";
import productModel from '../model/product.model.js'
import { stockOfVariant } from "../dao/product.dao.js";

export async function addTocart(req,res){

    const { productId, variantId } = req.params
    const { quantity = 1} = req.body

    const product = await productModel.findOne({
        _id:productId,
        "variants._id" : variantId
    })

    if(!product){
        return res.status(404).json({
            message : "Product or variant not found",
            success : false
        })
    }

    const stock = await stockOfVariant(productId,variantId)

    const cart = (await cartModel.findOne({ user:req.user._id})) || 
                (await cartModel.create({user:req.user._id}))

    
      const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

       if (isProductAlreadyInCart) {
        
    const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity

       if(quantityInCart + quantity > stock){
        return res.status(400).json({
            message : `only left in a stock ${stock} and you already have ${quantityInCart} items`,
            success: false
        })
       }

       await cartModel.findOneAndUpdate(
        {user: req.user._id,"items.product":productId,"items.variant":variantId},
        {$inc:{"items.$.quantity":quantity}},
        {new:true}
       )

       return res.status(200).json({
        message : 'Cart updated successfully',
        success:true
       })
}

    if(quantity > stock){
        return res.status(400).json({
            message : `only ${stock} item left in stock`,
            success : false
        })
    }

    const variant = product.variants.find(v => v._id.toString() === variantId)

    cart.items.push({
        product:productId,
        variant:variantId,
        quantity,
        price:variant?.price || product.price
    })

    await cart.save()

    return res.status(200).json({
        message : 'product added to cart successfully',
        success:true
    })

}

export async function getCart(req,res){

    const user = req.user

    let cart = await cartModel.findOne({user:user._id}).populate("items.product")

    if(!cart){
        cart = await cartModel.create({user:user._id})
    }

    return res.status(200).json({
        message : 'cart fetched successfully',
        success : true,
        cart
    })
}