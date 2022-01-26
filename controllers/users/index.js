const signup = require('./signup');
const login = require('./login');
const getCurrent = require('./getCurrent');
const logout = require('./logout');
const updateSubscription = require('./updateSubscription');
const updateAvatar = require('./updateAvatar');
const verifyToken = require('./verifyToken');
const requestVerification = require('./requestVerification');

module.exports = {
    signup,
    login,
    getCurrent,
    logout,
    updateSubscription,
    updateAvatar,
    verifyToken,
    requestVerification
}