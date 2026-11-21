

import axios from 'axios'


const api = axios.create({
    baseURL: '/api/products',
    withCredentials: true
})


export async function createProduct(formData) {

    const res = await api.post('/', formData)
    return res.data

}

export async function getSellerProduct() {

    const res = await api.get('/seller')

    return res.data
}

export async function getAllProduct() {

    const res = await api.get('/')

    return res.data
}

export async function getProductDetails(productId) {

    const res = await api.get(`/${productId}`)

    return res.data
}

export async function addProductVariant(productId, newProductVariant) {
    // 1. Check what is actually inside the array in your browser console
    console.log("Raw :", newProductVariant);

    const formData = new FormData();

    newProductVariant.images?.forEach((image) => {
        // Supports raw File objects directly, or common UI library wrappers
        const actualFile = image instanceof File 
            ? image 
            : (image?.file || image?.originFileObj || image?.raw);

        if (actualFile instanceof File) {
            formData.append('images', actualFile);
        }
    });

    formData.append('stock', newProductVariant.stock);
    formData.append('price', newProductVariant.price.amount);
    formData.append('attributes', JSON.stringify(newProductVariant.attributes));

    const response = await api.post(`/${productId}/variants`, formData);
    return response.data;
}
