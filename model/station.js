const mongoose = require("mongoose");
/**
 * const Int32 = require("mongoose-int32").loadType(mongoose);
 */  
const stationSchema= new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        required:true
    },
    location:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location',
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
    phoneNumber:{
        type:String,
        required:true
    },
    isDelete:{
        type:Boolean,
        required:true,
        default:"false"
    }
})
const Station= mongoose.model('station',stationSchema);
module.exports={Station};