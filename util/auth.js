const jwt = require("jsonwebtoken")

const createJwtToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: '10h'
  })
}

module.exports = { createJwtToken }