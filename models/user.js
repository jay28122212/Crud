const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');


const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
});

// userSchema.pre("save", function (next) {
//   const user = this;
//       if(user.isModified('password')){
//         bcrypt.hash().then(pwd => {
//           user.password = pwd
//           next()
//           })
//         }
// });
userSchema.methods.generateAuthtoken=async function(){
const user=this
const token=jwt.sign({_id:user._id.toString()},'thishshfkfhg')
return token
}

userSchema.statics.findBycredentials = async (email, password) => {
    const user = await User.findOne({ email });
    

    if (!user) {
      throw new Error("Wrong email");
    }
    // const ismatch = await bcrypt.compare(password, user.password);
    // if (!ismatch) {
    //   throw new Error("Wrong password");
    // }
    return user;
  };
const User = mongoose.model("users", userSchema);



module.exports = User;
