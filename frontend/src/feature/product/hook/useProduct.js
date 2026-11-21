
import { createProduct, getSellerProduct, getAllProduct, getProductDetails,addProductVariant } from "../services/product.api";
import { setSellerProduct, setProduct, setProductDetails } from "../state/product.slices";
import { useDispatch } from 'react-redux'


export function useProduct() {

    const dispatch = useDispatch()

    const handleCreateProduct = async (FormData) => {

        const data = await createProduct(FormData)
        return data.product
    }

    const handleGetSellerProduct = async () => {

        const data = await getSellerProduct()
        dispatch(setSellerProduct(data.products))
        return data.products
    }

    const handleGetAllProduct = async () => {
        const data = await getAllProduct()
        dispatch(setProduct(data.product))
    }

    const handleGetProductDetails = async (productId) => {

        const data = await getProductDetails(productId)
        dispatch(setProductDetails(data.product))
        return data.product
    }

    const handleAddProductVariant = async(productId,newProductVariant)=>{

        const data = await addProductVariant(productId,newProductVariant)
        return data
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProduct,
        handleGetProductDetails,
        handleAddProductVariant
    }

}