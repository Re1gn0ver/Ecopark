const mongoose = require('mongoose');
const bikeSchema= new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    station:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"station"
    },
    status:{
        type:String,
        required:true
    },
    numberPlate:{
        type:String,
        required:true
    },
    isDelete:{
        type:Boolean,
        required:true,
        default:"false"
    }
})

const Bike= mongoose.model('bike',bikeSchema);
module.exports={Bike};