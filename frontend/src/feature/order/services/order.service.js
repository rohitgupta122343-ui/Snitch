

import axios from 'axios'

const api = axios.create({
    baseURL:'/api/order',
    withCredentials:true
})

export async function createOrder({razorpayOrderId}){

    console.log(razorpayOrderId)
    const res = await api.post('/',{razorpayOrderId})
    return res.data

}

export async function getOrder({orderId}){
    
    const res = await api.get(`/${orderId}`)

    return res.data 
}