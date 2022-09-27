const mongoose = require('mongoose')

const categorySchema= new mongoose.Schema({
    cost:{type:Number,required:true},
    image:{type:String,required:true},
    description:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    name_lower:{
        type:String,
        required:true
    },
    isDelete:{
        type:Boolean,
        required:true,
        default:"false"
    },
    img:{
        type:String,
        required:false
    }
})

const Category= mongoose.model('category',categorySchema);
module.exports={Category};