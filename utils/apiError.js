// this class is responsiable about operation errors (error i can predict)
class ApiError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status=`${statusCode}`.startsWith(4)?'fail':'error';
        this.isOperational = true;  // i can predict error  ===> mean that i send this error
    }
}

module.exports = ApiError;