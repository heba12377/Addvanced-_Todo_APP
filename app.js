require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const todoRouter = require("./routes/todoRoutes")
const ApiError = require("./utils/apiError");
const globalError = require("./controllers/error.controller");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.dbURL).then( ()=> {
    console.log("connected to databse succesfully")
});

app.use(express.json());
app.use('/todos',todoRouter);

// in case client send route not in all our route
app.all('*',(req, res, next)=>{
   next(new ApiError(`can't find this route ${req.originalUrl}`, 400))
})

// global error handling middleware for express
app.use(globalError)

const server =  app.listen(port,()=>{
    console.log(`server now listen on port ${port}`);
})

// handel any external error like mongodb
process.on('unhandledRejection',(err)=>{
    console.error(`unhandledRejection Error:${err.name}|${err.message}`);
    server.close(()=>{
        console.error('shutting down.......');
        process.exit(1);
    })
})