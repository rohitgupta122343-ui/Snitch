
import { createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name:'products', 
    initialState:{
        sellerProduct:[],
        product:null,
        productDetails:null
    },
    reducers:{
        setSellerProduct:(state,action)=>{
            state.sellerProduct = action.payload
        },
        setProduct:(state,action)=>{
            state.product = action.payload
        },
        setProductDetails:(state,action)=>{
            state.productDetails = action.payload
        }
    }
})

export const {setSellerProduct,setProduct,setProductDetails} = productSlice.actions

export default productSlice.reducer