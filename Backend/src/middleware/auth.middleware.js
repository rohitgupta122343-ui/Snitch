
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import userModel from '../model/user.model.js'

export async function authenticateUser(req,res,next) {
    
    const token = req.cookies.token

    if(!token){
        return res.status(400).json({
            message : 'Authorized'
        })
    }

    try {
        const decoded = jwt.verify(token,config.JWT_SECRECT)

        
        const user = await userModel.findById(decoded.id)

        if(!user){
            return res.status(404).json({
                message : 'user not found'
            })
        }

        req.user = user
        next()

    } catch (err) {
        console.log(err)
    }

}

export async function authenticateSeller(req,res,next){

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message : "Unauthorizted"
        })
    }

    try {

        const decoded = jwt.verify(token,config.JWT_SECRECT)

        const user = await userModel.findById(decoded.id)

        if(!user){
            return res.status(400).json({
                message : 'User Not Found'
            })
        }

        if(user.role != 'seller'){
             return res.status(403).json({ message: "Forbidden" })
        }

        req.user = user
        next()

    } catch (err) {
        console.log(err)
        return res.status(401).json({message : 'Unauthorized'})
    }

}