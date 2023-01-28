const { string } = require("joi");
const mongoose = require("mongoose")
const { Schema } = mongoose;
const bcrypt = require("bcryptjs")

const todoSchema = new Schema({
  title:  String, 
  status: String,
  password:String
});

// to hash password before saving data in database
// hash ==> return promise so we need function to be async

todoSchema.pre('save',async function(next){
  // if there is no modified happen ==> go to next middleware and dont execute hash
  if(!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password,salt);
  next();
})

const Todo = mongoose.model('Todo', todoSchema );
module.exports= Todo;
