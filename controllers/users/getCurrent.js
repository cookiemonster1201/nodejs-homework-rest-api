const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;
    res.status(200).type('application/json').json({
        email,
        subscription
    })
}

module.exports = getCurrent;