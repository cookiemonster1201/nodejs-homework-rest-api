const express = require('express')
const router = express.Router()
const CreateError = require("http-errors");
const {Contact} = require('../../models');
const {joiSchema} = require('../../models/contact');
const {authenticate} = require('../../middlewares');

router.get('/', authenticate, async (req, res, next) => {
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
})

router.get('/:contactId', authenticate, async (req, res, next) => {
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
})

router.post('/', authenticate, async (req, res, next) => {
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
})

router.delete('/:contactId', authenticate, async (req, res, next) => {
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

router.put('/:contactId', authenticate, async (req, res, next) => {
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
})

router.patch('/:contactId/favorite', authenticate, async (req, res, next) => {
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
})

module.exports = router
