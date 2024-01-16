const Users = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
  app.post("/api/register", Users.register);
  app.post("/api/login", Users.login);
  app.post("/api/logout", Users.logout)
  app.get("/api/users", authenticate, Users.getAll); // Only used for initial testing of authorization 
}