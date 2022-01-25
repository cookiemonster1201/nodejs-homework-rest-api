const {Contact} = require('../../models');
const CreateError = require('http-errors');

const getById = async(req, res, next) => {
    const {contactId} = req.params;
    try {
      const contact = await Contact.findById(contactId);
      if (!contact) {
        throw new CreateError(404, 'Not found')
      }
      res.json(contact)
    } catch(error) {
      if (error.message.includes('Cast to ObjectId failed')) {
        error.status = 404;
      }
      next(error)
    }
  }

module.exports = getById;