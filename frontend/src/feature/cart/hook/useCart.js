
import { addItem,getCart,incrementCartItemApi,createCartOrder,verifyCartOrder,decrementCartItemApi } from '../service/cart.service.js'
import { setCart ,incrementCartItem,decrementCartItem,removeItem } from '../state/cart.slice.js'
import {useDispatch} from 'react-redux'

export function useCart(){

    const dispatch = useDispatch()

    const handleAddItem = async({productId,variantId,quantity = 1})=>{
        const data = await addItem({productId,variantId,quantity})

        return data
    }

    async function handleGetCart(){

        const data = await getCart()
        dispatch(setCart(data.cart))

    }

    async function handleIncrementCartItem({productId,variantId}){

        const data = await incrementCartItemApi({productId,variantId})
        
        dispatch(incrementCartItem({productId,variantId}))
    }


    async function handleDecrementCartItem({productId,variantId}){

        const data = await decrementCartItemApi({productId,variantId})

        dispatch(decrementCartItem({productId,variantId}))

    }


    async function handleCreateCartOrder(){

        const data = await createCartOrder()

        return data.order
    }

    async function handleVerifyCartOrder({razorpay_order_id,razorpay_payment_id, razorpay_signature}){

        const data = await verifyCartOrder({razorpay_order_id,razorpay_payment_id,razorpay_signature})

        return data.success

        
    }

 async function handleRemoveProduct(item) {
  const productId = item.product?._id || item.product;
  const variantId = item.variant?._id || item.variant;

  if (!productId) return;

  dispatch(removeItem({ productId, variantId }));
}


    return{
        handleAddItem,
        handleGetCart,
        handleIncrementCartItem,
        handleCreateCartOrder,
        handleVerifyCartOrder,
        handleDecrementCartItem,
        handleRemoveProduct
    }

}
