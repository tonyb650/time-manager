const jwt = require('jsonwebtoken');
const secret = "Its a mad mad mad mad world";
module.exports.secret = secret;
module.exports.authenticate = (req, res, next) => {
  jwt.verify(req.cookies.userToken, secret, (err, payload) => {
    console.log("**************************************************")
    console.log('verifying')
    // console.log(req)
    // console.log(req.cookies)
    console.log(req.cookies.userToken)
    if (err) {
      console.log("NOT VERIFIED")
      res.status(401).json({verified: false});
    } else {
      next();
    }
  });
}

// const secret = process.env.FIRST_SECRET_KEY;
// TODO: does the above make sense?