const mongoose = require('mongoose');

//basic info
const basicInfo= new mongoose.Schema({
    identifyNumber:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    phoneNumber:{type:String,required:true},
    name:{type:String,required:true}
})

//extends function
// const extend= (Schema,Object)=>(new mongoose.Schema(Object.assign({},Schema.Object,Object)));
const extend = (Schema, obj) => (
    new mongoose.Schema(
      Object.assign({}, Schema.obj, obj)
    )
);

// normal user schema 
const userSchema= extend(basicInfo,{
     balance:{type:Number,required:true},
     residentID:{type:String,required:true},
     activate:String,
     role:String
})


// receptionist schema
const receptionistSchema= extend(basicInfo,{
    address:{type:String,required:true},
    receptionistID:{type:String,required:true},
    role:String
})

// station staff
const stationStaffSchema= extend(basicInfo,{
    address:{type:String,required:true},
    staffID:{
        type:String,
        required:true
    },
    role:String
})

// admin
const adminSchema= extend(basicInfo,{
    adminID:{
        type:String,
        required:true
    },
    role:{type:String}
})

const User= mongoose.model('user',userSchema);
const Receptionist= mongoose.model('receptionist',receptionistSchema);
const StaffStation= mongoose.model('staff',stationStaffSchema);
const Admin= mongoose.model('admin',adminSchema);
module.exports= {User,Receptionist,StaffStation,Admin};

