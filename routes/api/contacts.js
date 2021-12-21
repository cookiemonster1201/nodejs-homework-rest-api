const express = require('express')
const router = express.Router()
const CreateError = require("http-errors");
const Joi = require("joi");
const contactsOperations = require("../../model/index")

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get('/', async (_, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts();
    res.json(contacts)
  } catch(error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
  try {
    const contact = await contactsOperations.getContactById(contactId);
    if (!contact) {
      throw new CreateError(404, 'Not found')
    }
    res.json(contact)
  } catch(error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = joiSchema.validate(req.body);
    if (error) {
      throw new CreateError(400, "missing required name field")
    }
    const newContact = await contactsOperations.addContact(req.body);
    res.status(201).json(newContact)
  } catch(error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const removedContact = await contactsOperations.removeContact(contactId);
    if(!removedContact) {
      throw new CreateError(404, 'Not found')
    }
    res.status(200).json({"message": "contact deleted"})
  } catch(error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const {error} = joiSchema.validate(req.body);
    const updatedContact = await contactsOperations.updateContact(contactId, req.body);
    if (error) {
      throw new CreateError(400, 'missing fields')
    }
    if (!updatedContact) {
      throw new CreateError(404, 'Not found')
    }
    res.json(updatedContact)
  } catch(error) {
    next(error)
  }
})

module.exports = router
