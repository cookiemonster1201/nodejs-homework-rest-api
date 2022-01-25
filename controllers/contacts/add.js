const CreateError = require('http-errors');
const {joiSchema} = require('../../models/contact')
const {Contact} = require('../../models');

const add = async (req, res, next) => {
    try {
      const {error} = joiSchema.validate(req.body);
      if (error) {
        throw new CreateError(400, "missing required name field")
      }
      const {_id} = req.user;
      const newContact = await Contact.create({...req.body, owner: _id});
      res.status(201).json(newContact)
    } catch(error) {
      if (error.message.includes('Validation failed')) {
        error.status = 400;
      } 
      next(error)
    }
  }

module.exports = add;