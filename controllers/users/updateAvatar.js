const Jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
const {User} = require('../../models');
const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars');


const updateAvatar = async(req, res, next) => {
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
}

module.exports = updateAvatar;