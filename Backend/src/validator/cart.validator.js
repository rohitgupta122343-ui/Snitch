
import { param,body,validationResult } from "express-validator";

 function validatorResult(req,res,next){

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    next()

}

export const validateAddtoCart = [

    param('productId').isMongoId().withMessage("Invalid product Id"),
    param('variantId').optional().isMongoId().withMessage("Invalid Variant Id"),
    body('quantity').optional().isInt({min:1}).withMessage("Quantity must be atleast 1"),
    validatorResult

]
export const validateIncrementCartItemQuantity=[

    param('productId').isMongoId().withMessage("Invalid product Id"),
    param('variantId').optional().isMongoId().withMessage("Invalid Variant Id"),
    
]