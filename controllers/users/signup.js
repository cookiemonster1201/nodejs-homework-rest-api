const {nanoid} = require('nanoid');
const gravatar = require('gravatar');

const CreateError = require('http-errors');
const {joiSchema} = require('../../models/user');
const {User} = require('../../models');
const {hashPassword, sendMail} = require('../../utils');
const {SITE_NAME} = process.env;

const signup = async (req, res, next) => {
    try {
        const {error} = joiSchema.validate(req.body);
        if (error) {
            throw new CreateError(400, error.message)
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (user) {
            throw new CreateError(409, "Email in use");
        }
        const hashedPassword = await hashPassword(password);
        const verificationToken = nanoid();
        const avatarURL = gravatar.url(email);
        const newUser = await User.create({
            ...req.body, 
            avatarURL, 
            password: hashedPassword, 
            verificationToken});

        const data = {
        to: email,
        subject: "Email Confirmation",
        html: `<a target="_blank" href="${SITE_NAME}api/users/verify/${verificationToken}">Please confirm your email!</a>`,
        }

        await sendMail(data);

        res.status(201).type('application/json').json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = signup;