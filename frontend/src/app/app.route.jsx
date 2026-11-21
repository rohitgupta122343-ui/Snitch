

import { createBrowserRouter } from "react-router";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";
import CreateProduct from "../feature/product/pages/CreateProduct";
import Dashboard from "../feature/product/pages/Dashboard";
import Protected from "../feature/auth/components/Protected";
import Home from "../feature/product/pages/Home";
import ProductDetails from "../feature/product/pages/ProductDetails";
import SellerProductDetails from "../feature/product/pages/SellerProductDetails";

export const routes = createBrowserRouter([
    {
        path:'/',
        element:<Home/>
    },{
        path:'/register',
        element:<Register/>
    },{
        path:'/login',
        element:<Login/>
    },
    {
        path:'/product/details/:productId',
        element:<ProductDetails/>
    },
   
    {
        path:'/seller',
        children:[
            {
                path:'/seller/create-product',
                element:<Protected 
                role="seller"
                ><CreateProduct/></Protected>
            },
            {
                path:'/seller/dashboard',
                element:<Protected role="seller"><Dashboard/></Protected>
            },
            {
                path:'/seller/product/:productId',
                element:<Protected role="seller"><SellerProductDetails/></Protected>
            }
        ]
    }
])
