
import { body, validationResult } from 'express-validator'

function validatorResult(req, res, next) {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next()

}

export const registerValid = [
    body('fullName').isString().withMessage('FullName must be String'),
    body('email').isEmail().withMessage('email must be email formate'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 charater'),
    body('contact')
        .matches(/^(\+91[\s-]?)?[0-9]{10}$/)
        .withMessage('Invalid contact number'),
    validatorResult
]

export const loginValid = [
    body('email').isEmail().withMessage('email must be email formate'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 charater'),
    validatorResult
]