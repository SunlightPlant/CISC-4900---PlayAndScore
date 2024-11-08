const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET);
  req.user = user;
  next();
}

module.exports = authenticate;
