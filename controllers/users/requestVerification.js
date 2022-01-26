const CreateError = require('http-errors');
const {User} = require('../../models');
const {sendMail} = require('../../utils');
const {SITE_NAME} = process.env;

const requestVerification = async(req, res, next) => {
    try {
        const {email} = req.body;
        if(!email) {
            throw new CreateError(400, 'missing required field email');            
        }
        const user = await User.findOne({email});
        if(!user) {
            throw new CreateError(404, 'User Not Found')
        }
        if(user.verify) {
            throw new CreateError(400, 'Verification has already been passed')
        }
        const {verificationToken} = user;
        const data = {
            to: email,
            subject: "Email Confirmation",
            html: `<a target="_blank" href="${SITE_NAME}api/users/verify/${verificationToken}">Please confirm your email!</a>`,
            }
    
        await sendMail(data);
        res.status(200).type('application/json').json({
            "message": "Verification email sent"
          })
    } catch (error) {
        next(error)
    }
}

module.exports = requestVerification;