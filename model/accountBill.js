const mongoose = require('mongoose');
const paymentSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        required:true
    }
})

const Payment= mongoose.model('payment',paymentSchema);
module.exports={Payment};