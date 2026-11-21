
import userModel from '../model/user.model.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

async function sendToken(user,res,message){

    const token = jwt.sign({
        id:user._id
    },config.JWT_SECRECT,{expiresIn:'7d'})

    res.cookie('token',token)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role
        }
    })

}

export async function registerController(req,res){

    const { fullName,email,password,contact,isSeller } = req.body

    try{

        const isUserExtist = await userModel.findOne({
            $or:[   
                {email},
                {contact} 
            ]
        })

        if(isUserExtist){
            return res.status(400).json({
                message : 'User Already Register'
            })
        }

        const user = await userModel.create({
            email,
            password,
            contact,
            fullName,
            role:isSeller?"seller":"buyyer"
        })

        await sendToken(user,res,"User registered successfully")
        

    }catch(err){
        console.log(err)
         return res.status(500).json({ message: "Server error" });
    }
}


export async function loginController(req,res){

    const { email,password } = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message : 'User Not Found'
        })
    }

    const isMatchPass = await user.comparePassword(password,user.password)

    if(!isMatchPass){
        return res.status(400).json({
            message : 'Invalid email or password'
        })
    }

    await sendToken(user,res,"user loggedIn sucessfull")
}


export async function googleAuth(req,res){

    const { displayName,emails,photos,id } =req.user

    const email = emails[0].value
    const photo = photos[0].value

    let user = await userModel.findOne({email})

    if(!user){
        await userModel.create({
            email,
            googleId:id,
            fullName:displayName
        })
    }

    const token = jwt.sign({id:user._id},config.JWT_SECRECT,{expiresIn:'7d'})

    res.cookie('token',token)

     res.redirect('http://localhost:5173/')
}


export async function getMe(req,res){

    const user = req.user

    res.status(200).json({
        message : 'user fetch successfully',
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email,
            contact:user.contact,
            role:user.role
        }
    })

}