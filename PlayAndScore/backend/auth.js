const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ message: "No access" });
  }
}

module.exports = authenticate;
