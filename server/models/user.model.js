const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, "First name is required"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email"
      }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be 8 characters or longer"]
    }
  }, {timestamps: true});
  
  // add this after UserSchema is defined
UserSchema.virtual('confirmPassword')
.get( () => this._confirmPassword ) // 'this' here refers to the entire file
.set( value => this._confirmPassword = value );

UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
      this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
  });
  

// this should go after 
UserSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10) // bcrypt.hash returns a promise. 10 salt 'rounds'
    .then(hash => {
      this.password = hash;
      next();
    });
});

module.exports = mongoose.model("User", UserSchema);