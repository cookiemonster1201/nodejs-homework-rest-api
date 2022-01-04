const jwt = require('jsonwebtoken');
const CreateError = require("http-errors");
const {SECRET_KEY} = process.env;
const {User} = require('../models');

const authenticate = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization) {
            throw new CreateError(401, 'Not Authorized')
        }
        const [bearer, token] = authorization.split(' ');
        if (bearer !== 'Bearer') {
            throw new CreateError(401, 'Not Authorized');
        }
        try {
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user) {
            throw new CreateError(401, 'Not Authorized');
        }
        req.user = user;
        next();
        } catch (error) {
            throw new CreateError(401, 'Not Authorized')
        }
    } catch (error) {
        next(error)
    }
}

module.exports = authenticate; 