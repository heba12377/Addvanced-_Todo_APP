const express = require("express");
const toDoController= require("../controllers/todo.controllers");
const  validator = require('../utils/validator');
const loginValidator = require("../utils/loginValidator");
const authrization = require("../controllers/auth.controller");

const Router = express.Router();

Router.route('/').get(authrization,toDoController.getTodo);


Router.route('/:id').get(toDoController.findone);

Router.route('/').post(validator,toDoController.createTodo);
Router.route('/signup').post(validator,toDoController.signUp);
Router.route('/login').post(loginValidator, toDoController.login); 

Router.route('/:id').patch(validator,toDoController.updateOne);
Router.route('/changepassword/:id').put(toDoController.changePassword);

Router.route('/:id').delete(toDoController.deleteOne);


module.exports = Router;