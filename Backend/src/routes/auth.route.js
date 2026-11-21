
import {Router } from 'express'
import { registerController,loginController,googleAuth,getMe } from '../controller/auth.controller.js'
import { registerValid,loginValid } from '../validator/auth.validator.js'
import passport from 'passport'
import { authenticateUser } from '../middleware/auth.middleware.js'
const authRouter = Router()

authRouter.post('/register',registerValid,registerController)

authRouter.post('/login',loginValid,loginController)

authRouter.get('/me',authenticateUser,getMe)

authRouter.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
)

authRouter.get('/google/callback',
    passport.authenticate('google',{ session:false,failureRedirect:"http://localhost:5173/login"}),googleAuth
)

export default authRouter