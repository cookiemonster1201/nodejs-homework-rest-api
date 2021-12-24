const express = require('express')
const router = express.Router()
const CreateError = require("http-errors");
const {Contact} = require('../../model');
const {joiSchema} = require('../../model/contact')

router.get('/', async (_, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts)
  } catch(error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
  try {
    const contact = await Contact.findById(contactId );
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
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = joiSchema.validate(req.body);
    if (error) {
      console.log(error.message)
      throw new CreateError(400, "missing required name field")
    }
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact)
  } catch(error) {
    if (error.message.includes('Validation failed')) {
      error.status = 400;
    } 
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
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
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const {error} = joiSchema.validate(req.body);
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (error) {
      throw new CreateError(400, 'missing fields')
    }
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
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const {favorite} = req.body;
    const {error} = joiSchema.validate(req.body);
    const updatedContact = await Contact.findByIdAndUpdate(contactId, {favorite}, {new: true});
    if (error) {
      throw new CreateError(400, 'missing fields')
    }
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
})

module.exports = router
