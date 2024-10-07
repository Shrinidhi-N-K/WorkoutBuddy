const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// static signup method
userSchema.statics.signup = async function(email, password) {

  if(!email || ! password){
    throw Error('Please fill all the required fields')
  }
  if(!validator.isEmail(email)){
    throw Error('Please Enter a Valid Email')
  }
  if(!validator.isStrongPassword(password)){
    throw Error('Password must be a strong password')
  }
  
  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash })

  return user
}

//static login method
userSchema.statics.login = async function(email, password){
  if(!email || !password){
    throw Error('Please fill all the required fields');
  }

  const user = await this.findOne({ email })

  if (!user) {
    throw Error('Email not registered')
  }

  const match = await bcrypt.compare(password, user.password);

  if(!match){
    throw Error('Incorrect Password')
  }

  return user;

}

module.exports = mongoose.model('User', userSchema)