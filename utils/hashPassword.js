const bcrypt = require('bcryptjs');

const hashPassword = async(pwd) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(pwd, salt);
    return hashedPwd;
}

module.exports = hashPassword;