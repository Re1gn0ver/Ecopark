// const jwt = require("jsonwebtoken");

// const authenticate = async (req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     return next();
//   }
//   console.log( req.headers.authorization);
//   try {
//     const token = req.headers.authorization.split(' ')[1]; 
//     if (!token) {
//       throw new Error('Authentication failed!');
//     }
//     const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
//     req.userData = {decodedToken};
//     next();
//   } catch (err) {
//     console.error({msg: 'Authentication failed!'});
//     return next(err);
//   }
// }

// module.exports =authenticate
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(200).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;