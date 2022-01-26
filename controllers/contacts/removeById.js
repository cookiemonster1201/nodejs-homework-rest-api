const CreateError = require('http-errors');
const {Contact} = require('../../models')

const removeById = async(req, res, next) => {
    try {
      const {contactId} = req.params;
      const removedContact = await Contact.findByIdAndRemove(contactId);
      if(!removedContact) {
        throw new CreateError(404, 'Not found')
      }
      res.status(200).json({"message": "contact deleted"})
    } catch(error) {
      next(error)
    }
  }

module.exports = removeById;