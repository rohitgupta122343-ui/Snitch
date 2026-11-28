
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feature/auth/state/auth.state.js'
import productRedcer from '../feature/product/state/product.slices.js'
import cartReducer from '../feature/cart/state/cart.slice.js'
import orderReducer from '../feature/order/state/order.slice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products:productRedcer,
        cart:cartReducer,
        order:orderReducer
    }
})