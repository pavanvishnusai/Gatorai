// import { NextFunction, Request, Response } from "express";
// import { body, ValidationChain, validationResult } from "express-validator";
import { body, validationResult } from "express-validator";
// ✅ Middleware to run all validations
export const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty())
                break;
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    };
};
// ✅ Common validation chains
export const loginValidator = [
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator,
];
export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required"),
];
//# sourceMappingURL=validators.js.map