const express = require('express')
const CreateError = require("http-errors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticate, upload} = require('../../middlewares');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const router = express.Router();

const {joiSchema} = require('../../models/user');
const {User} = require('../../models/user');
const {SECRET_KEY} = process.env;
const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars')

router.post('/signup', async (req, res, next) => {
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
        const avatarURL = gravatar.url(email);
        const newUser = await User.create({...req.body, avatarURL, password: hashedPassword});
        console.log(newUser)
        res.status(201).type('application/json').json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        })
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
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
})

router.get('/current', authenticate, async (req, res) => {
    const {email, subscription} = req.user;
    res.status(200).type('application/json').json({
        email,
        subscription
    })
})

router.get('/logout', authenticate, async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: null});
    res.status(204).send();
})

router.patch('/subscription', authenticate, async (req, res, next) => {
    try {
    const subscriptionTypes = ['starter', 'pro', 'business'];
    const {subscription} = req.body;
    if (!subscriptionTypes.includes(subscription)) {
        throw new CreateError(400, 'invalid subscription type')
    }
    const {_id} = req.user;
    const updatedUser = await User.findByIdAndUpdate(_id, {subscription}, {new: true});
    res.json(updatedUser);
    } catch(error) {
        next(error);
    }
  })

router.patch('/avatars', authenticate, upload.single("avatar"), async(req, res, next) => {
    try {
        const  {path: tempUpload, filename} = req.file;
        const [extension] = filename.split('.').reverse();
        const newFileName = `${req.user._id}.${extension}`;
        const fileUpload = path.join(avatarsDir, newFileName);
        const img = await Jimp.read(tempUpload);
        img.resize(250, 250).write(tempUpload);
        await fs.rename(tempUpload, fileUpload);
        const avatarURL = path.join('avatars', newFileName);
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {avatarURL}, {new: true});
        res.json({avatarURL})
    } catch (error) {
        next(error);
    }
})

async function hashPassword(pwd) {
    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(pwd, salt);
    return hashedPwd;
}

module.exports = router;