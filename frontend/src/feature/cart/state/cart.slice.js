
import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        totalPrice:null,
        currency:null,
        items:[]
    },
    reducers:{
        setCart:(state,action)=>{
            state.items = action.payload.items,
            state.totalPrice = action.payload.totalPrice,
            state.currency = action.payload.currency
        },
        setItems:(state,action)=>{
            state.items = action.payload
        },
        addItem:(state,action)=>{
            state.items.push(action.payload)
        },
        incrementCartItem:(state,action)=>{

            const { productId,variantId } = action.payload

            state.items = state.items.map(item=>{
                if(item.product._id === productId && item.variant === variantId ){
                    return {...item,quantity:item.quantity+1}
                }else{
                    return item
                }
            })
        }, decrementCartItem:(state,action)=>{

            const { productId,variantId } = action.payload

            state.items = state.items.map(item=>{
                if(item.product._id === productId && item.variant === variantId ){
                    return {...item,quantity:item.quantity-1}
                }else{
                    return item
                }
            })
        },
        clearCart:(state,action)=>{
            state.items = [],
            state.totalPrice = null
            state.currency = null
        },
        removeItem: (state, action) => {
         const { productId, variantId } = action.payload

     state.items = state.items.filter(item =>
        !(item.product._id === productId && item.variant === variantId)
    )
},

    }
})

export const {setCart,addItem,incrementCartItem,clearCart,decrementCartItem,removeItem} = cartSlice.actions
export default cartSlice.reducer