
import {body , validationResult} from 'express-validator'


function validatorResult(req,res,next){

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    next()

}

export const createProductValid = [

    body('title').isString().withMessage('Title must be string'),
    body('description').isString().withMessage('description must be string'),
    body('priceAmount').isNumeric().withMessage('priceAmount must be required'),
    body('priceCurrency').notEmpty().withMessage('priceCurrency must be required'),
    body('color').optional().isString().withMessage('Color must be string'),
    validatorResult
]