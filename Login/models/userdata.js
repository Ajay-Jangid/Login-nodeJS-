const mongoose =require('mongoose')

const userDataSchema = new mongoose.Schema({
    uid :{
        type : Number,
        required : true,
        unique:true
    },
    name : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('UserData',userDataSchema)
