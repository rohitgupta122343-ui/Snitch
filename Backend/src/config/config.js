
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
}

if (!process.env.JWT_SECRECT) {
    throw new Error('JWT_SECRET is not defined')
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not defined')
}

if (!process.env.GOOGLE_CLIENT_SECRECT) {
    throw new Error('GOOGLE_CLIENT_SECRET is not defined')
}

if(!process.env.RAZORPAY_KEY_ID){
    throw new Error('RAZORPAY_KEY_ID is not define')
}

if(!process.env.RAZORPAY_KEY_SECRECT){
    throw new Error('RAZORPAY_KEY_SECRECT is not define')
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRECT: process.env.JWT_SECRECT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRECT: process.env.GOOGLE_CLIENT_SECRECT,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRECT:process.env.RAZORPAY_KEY_SECRECT
}
