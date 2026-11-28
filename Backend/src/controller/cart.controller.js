
import cartModel from "../model/cart.model.js";
import productModel from '../model/product.model.js'
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.doa.js";
import paymentModel from "../model/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";
import orderModel from "../model/order.model.js";


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

    let cart = await getCartDetails(user._id)

    if(!cart){
        cart = await cartModel.create({user:user._id})
    }

    return res.status(200).json({
        message : 'cart fetched successfully',
        success : true,
        cart
    })
}

export async function incrementCartItemQuantity(req,res){

    const { productId,variantId} = req.params

    const product = await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    })

    if(!product){
        return res.status(404).json({
            message : 'product or variant not found',
            success:false
        })
    }

    const cart = await cartModel.findOne({user:req.user._id})

    if(!cart){
         return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId,variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0

        if (itemQuantityInCart + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
            success: false
        })
    }

     await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        { $inc: { "items.$.quantity": 1 } },
        { new: true }
    )

        return res.status(200).json({
        message: "Cart item quantity incremented successfully",
        success: true
    })

}

export async function decrementCartItemQuantity(req,res){

    const { productId,variantId} = req.params

    const product = await productModel.findOne({
        _id:productId,
        "variants._id":variantId
    })

    if(!product){
        return res.status(404).json({
            message : 'product or variant not found',
            success:false
        })
    }

    const cart = await cartModel.findOne({user:req.user._id})

    if(!cart){
         return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    
    const Index = cart.items.findIndex(
            (item) =>
                item.product.toString() === productId &&
                item.variant?.toString() === variantId
        );

        if(Index === -1){
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (cart.items[Index].quantity > 1) {
        cart.items[Index].quantity -= 1;
    } else {
        cart.items.splice(Index, 1);
    }

    await cart.save();

    return res.status(200).json({ message: "Updated", success: true, cart });


}

export async function createOrderController(req,res){

    const cart = await getCartDetails(req.user._id)

    if(!cart){
        return res.status(400).json({
            message : "Cart is Empty",
            success:false
        })
    }

    const order = await createOrder({amount:cart.totalPrice,currency:cart.currency})

    const payment = await paymentModel.create({
        user : req.user._id,
        razorpay:{
            orderId: order.id
        },
        price:{
            amount : cart.totalPrice,
            currency:cart.currency
        },
        orderItems: cart.items.map(item=>({
            title:item.product.title,
            productId:item.product._id,
            variantId:item.variant,
            quantity:item.qunatity,
            images: item.product.variants.images || item.product.images,
            description:item.product.description,
            price:{
                amount:item.product.variants.price.amount || item.product.price.amount,
                currency: item.product.variants.price.currency || item.product.price.currency
            }
        }))
    })

    return res.status(200).json({
        message : 'order created successfully',
        success:true,
        order
    })
}

export async function verifyOrderController(req,res){

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId" : razorpay_order_id,
        status:"pending"
    })

    if(!payment){
        return res.status(400).json({
            message : "Payment Not Found",
            success:false
        })
    }



    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
    }, razorpay_signature,config.RAZORPAY_KEY_SECRECT)

    if(!isPaymentValid){
        payment.status = "failed"
        await payment.save()

        return res.status(400).json({
            message : "Payment verification failed",
            success : false
        })
    }

    payment.status = "paid"

    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    await payment.save()

    await cartModel.findOneAndUpdate(
        {user : req.user._id},
        { $set: { items: [] } }
    )

    

    return res.status(200).json({
        message : 'payment verification successfully',
        success : true
    })

}

export async function createOrderr(req, res) {
  try {
    const userId = req.user._id;
    const { razorpayOrderId } = req.body;

    const cart = await cartModel.findOne({ user: userId });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + (item.price?.amount || 0) * item.quantity,
      0
    );

    const order = await orderModel.create({
      user: userId,
      items: cart.items,
      razorpayOrderId,
      totalPrice: {
        amount: totalAmount,
        currency: cart.items[0]?.price?.currency || 'INR',
      },
      status: 'pending',
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

}

export async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const order = await orderModel
      .findOne({ razorpayOrderId: orderId })
      .populate('items.product', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}