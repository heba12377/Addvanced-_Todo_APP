const ApiError = require("../utils/apiError");

const sendErrorForDev = (err,res)=>{
    return res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack // where error happen 
    });
} 
const sendErrorForPro = (err,res)=>{
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message 
    });
}

const handelJwtInvalidSignature = ()=> new ApiError(`Invalid token ,pls login again..`,401);
const handelJwtExpired = ()=> new ApiError(`Expired token ,pls login again..`,401);

const globalError =  (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    switch(process.env.NODE_ENV){
        case'development':
            sendErrorForDev(err,res);
            break;
        case'production':
            if(err.name === "JsonWebTokenError") err = handelJwtInvalidSignature();
            if(err.name === "TokenExpiredError") err = handelJwtExpired();
            sendErrorForPro(err,res);
            break;
    }
}
module.exports = globalError;