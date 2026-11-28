
import express from 'express'
import morgan from 'morgan'
import authRouter from './routes/auth.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import orderRouter from './routes/order.route.js'
import cors from 'cors'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { config } from './config/config.js'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(passport.initialize())

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRECT,
    callbackURL: '/api/auth/google/callback'
},
    (_, __, profile, done) => {
        return done(null, profile)
    }
))

app.get('/',(req,res)=>{
    res.send('hello')
})

app.use('/api/auth',authRouter)
app.use('/api/products',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

export default app