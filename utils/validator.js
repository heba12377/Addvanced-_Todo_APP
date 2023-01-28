const Joi = require('joi');
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

const schema = Joi.object({
    title: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    status: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    password:Joi.string()
})
const validator = asyncHandler(async(req,res,next)=>{

    const validate = await schema.validateAsync(req.body);
    if(!validate){
        return next(new ApiError(`invalid validation`,422))
    }
    next();
     
});

module.exports = validator;