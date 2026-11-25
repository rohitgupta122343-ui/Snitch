
import axios from 'axios'

const api = axios.create({
    baseURL:'/api/cart',
    withCredentials:true
})

export const addItem = async({productId,variantsId}) => {

    const response = await api.post(`/add/${productId}/${variantsId}`,{
        quantity : 1
    })

    return response.data

}