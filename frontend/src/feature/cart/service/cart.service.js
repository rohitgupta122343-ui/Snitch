
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