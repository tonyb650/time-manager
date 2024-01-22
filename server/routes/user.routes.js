const Users = require('../controllers/user.controller');
// const { authenticate } = require('../config/jwt.config');

module.exports = app => {
  app.post("/api/register", Users.register);
  app.post("/api/login", Users.login);
  app.post("/api/logout", Users.logout); // TODO: should I use the authenticate middleware on logout?
}