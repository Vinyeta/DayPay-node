const jwt = require ('jwt')
const config = require('../config')

function isAuth (req, res, next) {
    if(!req.headers.authorization) {
        return res.status(403).send({message:'no authorized'})
    }
    const token = req.header.authorization.split (" ")[1]
    const payload = jwt.decode(token,config.SECRET_TOKEN)
}