const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    password:Joi.string()
})
const loginValidator = async(req,res,next)=>{
    try {
        await schema.validateAsync(req.body);
        next();
      } catch (error) {
        error.statusCode = 422;
        next(error);
      }
};

module.exports = loginValidator;