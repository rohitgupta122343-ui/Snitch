
import axios from 'axios'

const api = axios.create({
    baseURL:'/api/cart',
    withCredentials:true
})

export const addItem = async({productId,variantId,quantity = 1}) => {

    const response = await api.post(`/add/${productId}/${variantId}`,{
        quantity
    })

    return response.data

}

export const getCart = async()=>{

    const res = await api.get('/')

    return res.data

}

export const incrementCartItemApi = async({productId,variantId,quantity=1})=>{

    const res = await api.patch(`/quantity/increment/${productId}/${variantId}`,quantity)

    return res.data

}

export const decrementCartItemApi = async({productId,variantId})=>{

    const res = await api.patch(`/quantity/decrement/${productId}/${variantId}`)

    return res.data

}

export const createCartOrder = async()=>{

    const res = await api.post('/payment/create/order')
    return res.data
}

export const verifyCartOrder = async({razorpay_order_id, razorpay_payment_id, razorpay_signature})=>{

    const res = await api.post('/payment/verify/order',{
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return res.data

}
