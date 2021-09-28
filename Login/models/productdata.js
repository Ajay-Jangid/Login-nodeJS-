const mongoose =require('mongoose')


const productDataSchema = new mongoose.Schema({
    pid: {
        type:Number,
        required:true,
        unique:true
    },
    name :{
        type:String,
        required :true
    },
    userid :{
        type:Number,
        required:true
    }
});


module.exports = mongoose.model('ProductData',productDataSchema)
