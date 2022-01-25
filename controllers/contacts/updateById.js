const CreateError = require('http-errors');
const { joiSchema } = require("../../models/contact");
const {Contact} = require('../../models')

const updateById = async(req, res, next) => {
    try {
      const {error} = joiSchema.validate(req.body);
      if (error) {
        throw new CreateError(400, 'missing fields')
      }
      const {contactId} = req.params;
      const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
      
      if (!updatedContact) {
        throw new CreateError(404, 'Not found')
      }
      res.json(updatedContact)
    } catch(error) {
      if (error.message.includes('Validation failed')) {
        error.status = 400;
      } 
      next(error)
    }
  }

module.exports = updateById;