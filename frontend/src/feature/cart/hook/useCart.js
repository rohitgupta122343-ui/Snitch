
import { addItem } from '../service/cart.service.js'
import { addItem as  addItemCart } from '../state/cart.slice.js'
import {useDispatch} from 'react-redux'

export function useCart(){

    const dipatch = useDispatch()

    const handleAddItem = async({productId,variantsId})=>{
        const data = await addItem({productId,variantsId})

        return data
    }

    return{
        handleAddItem
    }

}
