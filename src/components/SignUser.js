const mongoose = require('mongoose');
const {Schema}=mongoose;
const SignSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Phone number must be exactly 10 digits'
        }
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
  });
  const SignUser=mongoose.model('Sign',SignSchema);
//   SignUser.createIndexes();
  module.exports=SignUser;