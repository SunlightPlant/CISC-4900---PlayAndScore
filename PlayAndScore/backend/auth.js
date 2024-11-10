const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifed = jwt.verify(token, process.env.SECRET);
    req.user = verifed;
    next();
  } catch (error) {
    return res.status(401).json({ message: "No access" });
  }
}

module.exports = authenticate;
