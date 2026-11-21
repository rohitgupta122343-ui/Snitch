
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feature/auth/state/auth.state.js'
import productRedcer from '../feature/product/state/product.slices.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products:productRedcer
    }
})