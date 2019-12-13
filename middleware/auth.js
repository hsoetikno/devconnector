const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
  let token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorisation denied' })
  }

  token = token.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded.user
    next()
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
