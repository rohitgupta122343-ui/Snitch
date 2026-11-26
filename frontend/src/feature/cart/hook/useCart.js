
import { addItem,getCart } from '../service/cart.service.js'
import { addItem as  addItemCart, setItems } from '../state/cart.slice.js'
import {useDispatch} from 'react-redux'

export function useCart(){

    const dispatch = useDispatch()

    const handleAddItem = async({productId,variantId,quantity = 1})=>{
        const data = await addItem({productId,variantId,quantity})

        return data
    }

    async function handleGetCart(){

        const data = await getCart()
        dispatch(setItems(data.cart.items))

    }

    return{
        handleAddItem,
        handleGetCart
    }

}
