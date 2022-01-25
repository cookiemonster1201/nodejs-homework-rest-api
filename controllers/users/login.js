const CreateError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {joiSchema} = require('../../models/user');
const {User} = require('../../models');
const {SECRET_KEY} = process.env;

const login = async(req, res, next) => {
    try {
        const {error} = joiSchema.validate(req.body);
        if (error) {
            throw new CreateError(400, error.message)
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        let doesPasswordMatch;
        if (user) {
            doesPasswordMatch = await bcrypt.compare(password, user.password)
        }
        if (!user || !doesPasswordMatch) {
            throw new CreateError(401, "Email or password is wrong")
        }
        if(!user.verify) {
            throw new CreateError(401, 'Email not verified')
        }
        const {subscription, _id} = user;
        const payload = {
            id: _id
        };
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '1h'});
        await User.findByIdAndUpdate(_id, {token});
        res.status(200).type('application/json').json({
                token,
                user: {
                    email,
                    subscription,
                }               
        })
    } catch (error) {
        next(error)
    }
}

module.exports = login;