const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_KEY

module.exports = {
  register : async (req,res) => {
    try {
      const possibleUser = await User.findOne({ email : req.body.email })
      if (possibleUser) {
        res.status(400).json({ message : 'This email already exists. Please log in.' })
      } else {
        const newUser = await User.create(req.body)
        const userToken = jwt.sign({ _id : newUser._id, email : newUser.email }, SECRET, { expiresIn: '2h' });
        res
          .status(201)
          .cookie("userToken", userToken, { httpOnly: true, maxAge : 2*60*60*1000})
          .json({msg: "success!", user : newUser})
      }
    }
    catch(err) {
      res.status(400).json(err)
    }
  },

  login: async(req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });     // Search for the given email
      if (user === null) {                                            // Email NOT found in 'users' collection
        // console.log("email not found in collection")
        res.status(400).json({message:"Invalid Credentials"});
      } else {
        const isCorrectPW = await bcrypt.compare(req.body.password, user.password); // compare PW given with PW hash in DB
        // console.log("completed bcrypt.compare")
        if(isCorrectPW) {                                             // Password was a match!
          // console.log("password is correct")
          const userToken = jwt.sign({_id: user._id, email:user.email}, SECRET, {expiresIn:'2h'});  // PW is a match! Define userToken
          res
            .status(201)
            .cookie('userToken', userToken, {httpOnly:true, maxAge: 2*60*60*1000})
            .json({msg: "success!", user : user})
        } else {                                                      // Password was NOT a match
          res.status(400).json({message:"Invalid Credentials"});
        }
      }
    }
    catch(err){
      // console.log("entered catch")
      res.status(400).json(err);
    }
  },
    
  logout: (req, res) => {
    res.clearCookie('userToken');
    res.sendStatus(200);                                              // Apparently, this is the equivalent of res.status(200).send('OK')
  },

  // THIS WAS FOR AUTHORIZATION TESTING ONLY. Can remove 'getAll' later.
  getAll : async (req, res) => {
    try {
      console.log("inside GetAllUsers")
      await User.find({})
      .then(allUsers => {
        res.json(allUsers);
        console.log(res);
      })
    }
    catch(err) {
      res.status(400).json(err);
    }
  }
}