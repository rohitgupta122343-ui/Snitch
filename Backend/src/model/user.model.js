
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:function (){
             return !this.googleId;
        }
    },
    contact:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['buyyer','seller'],
        default:'buyyer'
    },
    googleId:{
        type:String
    }

})


userSchema.pre('save',async function(){

    if(!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, 10)
    
})


userSchema.methods.comparePassword = async function (candidatePassword) {
    
    return await bcrypt.compare(candidatePassword,this.password)
}


const userModel = mongoose.model('users',userSchema)

export default userModel