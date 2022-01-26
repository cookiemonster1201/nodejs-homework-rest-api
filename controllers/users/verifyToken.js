const CreateError = require('http-errors');
const {User} = require('../../models');

const verifyToken = async(req, res, next) => {
    try {
        const {verificationToken} = req.params;
        const user = await User.findOne({verificationToken});
        console.log(verificationToken, user)
        if (!user) {
            throw new CreateError(404, 'User Not Found')
        }
        await User.findByIdAndUpdate(user._id, {verificationToken: null, verify: true});
        res.status(200).json({
            message: 'Verification successful',
          })
    } catch (error) {
        next(error)
    }
}

module.exports = verifyToken;