const Todo = require("../models/todosModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

class toDoController{

    createTodo = asyncHandler(async (req, res, next) => {
    
        const { title, status, password } = req.body;
        const newToDO = new Todo({
            title,
            status,
            password
        })
        await newToDO.save();
        res.status(200).json({
            status: "success",
            data: newToDO
        });
    });
    
    getTodo = asyncHandler(async (req, res) => {
    
        const filter = {}
        const { status, title } = req.query;
    
        if (status) {
            filter.status = status
        }
        if (title) filter.title = title
    
        const result = await Todo.find(filter);
        if (!result) return next(new ApiError(`can't find toDos`, 404));
        res.status(200).json({
            status: "success",
            data: result
        });
    });

    findone = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const find = await Todo.findById(id);
        if (!find) {
            return next(new ApiError(`Invalid id `, 404));
        }
        res.status(200).json({
            status: "success",
            data: find
        });
    })
    // update all todo data  except password 
    updateOne = asyncHandler(async (req, res, next) => {
    
        const update = await Todo.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            status: req.body.status
        });
        res.status(200).json({
            status: "success",
            data: update
        });
    
    });

    changePassword = asyncHandler(async (req, res, next) => {
    
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        if (!hashPassword) return next(new ApiError(`can't bcrypt password`, 404));
    
        const update = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                password: hashPassword,
            },
            {
                new: true
            }
        );
        if (!update) return next(new ApiError(`can't find this toDO`, 404));
    
        res.status(200).json({
            status: "success",
            data: update
        });
    
    });

    deleteOne = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const deletetoDO = await Todo.findByIdAndDelete(id);
        if (!deletetoDO) return next(new ApiError(`can't find this toDO`, 404));
        res.status(200).json({
            status: "success",
            data: deletetoDO
        });
    });

    login = async (req,res,next)=>{
        // 1- check if pass and title in body(login validation)
        // 2- check if title alreay exist and if pass is correct
    
        const todo = await Todo.findOne({title:req.body.title});
        if(!todo){
            return next(new ApiError(`can't find this title`, 401));
        }
        const isMatch = await bcrypt.compare(req.body.password,todo.password);
        if(!isMatch) return next(new ApiError(`incorrect password pls try again`,401));
    
        // 3- generate token
        const token = jwt.sign({todoId:todo._id},process.env.JWT_SECRT_KEY,{
            expiresIn:process.env.JWT_EXPIRE_TIME,
        })
    
        res.status(200).json({
            status:"success",
            data:todo,
            token
        });
    }

    signUp = asyncHandler(async (req,res,next)=>{
        // 1- create todo
        const newtodo = new Todo({
            title:req.body.title,
            status:req.body.status,
            password:req.body.password
        });
        await newtodo.save();
    
        // 2- create tokon
    
        // JWT ==> consist of three parts
        // 1- header ==> in color red {algorithm and type}
        // 2- data(payload) ==> in color violet
        // 3- security ==> in color baby blue
     
        // sign (for creating token ) take paramerter
        // 1-data(payload) ===> object (id)
        // 2- secret key
        // 3-options => expire time  
    
        const token = jwt.sign({todoId:newtodo._id},process.env.JWT_SECRT_KEY,{
            expiresIn:process.env.JWT_EXPIRE_TIME,
        })
        
        res.status(200).json({
            status:"success",
            data:newtodo,
            token
        });
        
    })
}


module.exports = new toDoController();