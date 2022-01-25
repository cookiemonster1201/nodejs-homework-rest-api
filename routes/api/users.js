const express = require('express');
const {authenticate, upload} = require('../../middlewares');

const router = express.Router();

const ctrl = require('../../controllers/users');

router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);

router.get('/logout', authenticate, ctrl.logout);

router.patch('/subscription', authenticate, ctrl.updateSubscription);

router.patch('/avatars', authenticate, upload.single("avatar"), ctrl.updateAvatar);

router.get('/verify/:verificationToken', ctrl.verifyToken);

router.get('/verify', ctrl.requestVerification)


module.exports = router;
