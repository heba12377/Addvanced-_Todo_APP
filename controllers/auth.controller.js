const asyncHandler = require("express-async-handler");
const Todo = require("../models/todosModel");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

const auth =asyncHandler(async(req,res,next)=>{
    // 1-check if token exist or not
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1]; 
    }
    if(!token){
        return next(new ApiError(`you are not login, pls login to get access this route`,401));
    }

    //2- verify token ==> that no change happen && expired token 
    const decoded = jwt.verify(token, process.env.JWT_SECRT_KEY)  

    //3- check if todo exist
    const currentTodo = await Todo.findById(decoded.todoId);
    if(!currentTodo){
        return next (new ApiError(`the toDo that is belong to this token does no longer exists`,401));
    }

    next()
})

module.exports = auth;

