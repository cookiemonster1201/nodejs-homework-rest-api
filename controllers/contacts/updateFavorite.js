const CreateError = require('http-errors');
const {joiSchema} = require('../../models/contact');
const {Contact} = require('../../models');

const updateFavorite = async(req, res, next) => {
    try {
      const {error} = joiSchema.validate(req.body);
      if (error) {
        throw new CreateError(400, 'missing fields')
      }
      const {contactId} = req.params;
      const {favorite} = req.body;
      const updatedContact = await Contact.findByIdAndUpdate(contactId, {favorite}, {new: true});
      
      if (!updatedContact) {
        throw new CreateError(404, 'Not found')
      }
      res.json(updatedContact)
    } catch(error) {
      if (error.message.includes('missing field favorite')) {
        error.status = 400;
      } 
      next(error)
    }
  }

module.exports = updateFavorite;