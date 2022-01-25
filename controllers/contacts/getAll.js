const {Contact} = require('../../models');

const getAll = async (req, res, next) => {
    try {
      const {page = 1, limit = 20, favorite} = req.query;
      const skip = (page - 1) * limit;
      const {_id} = req.user;
      if (favorite === 'true') {
        const contacts = await Contact.find({owner: _id, favorite: true}, "", {skip, limit: +limit});
        res.json(contacts)
      }
      const contacts = await Contact.find({owner: _id}, "", {skip, limit: +limit});
      res.json(contacts)
    } catch(error) {
      next(error)
    }
  }

module.exports = getAll;