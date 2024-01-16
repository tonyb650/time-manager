const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

// TODO: the following line seems unnecessary ? I'm not sure where I got it from...  Maybe it's supposed to be required by controller?
// module.exports.secret = secret;

module.exports.authenticate = (req, res, next) => {
  jwt.verify(req.cookies.userToken, secret, (err, payload) => {
    if (err) {
      console.log("Authenticate failed within jwt.config.js")
      res.status(401).json({verified: false});
    } else {
      next();
    }
  });
}

