const CreateError = require('http-errors');
const {User} = require('../../models');

const updateSubscription = async(req, res, next) => {
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
  }

module.exports = updateSubscription;