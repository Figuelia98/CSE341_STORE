const Joi = require('@hapi/joi');
const { description } = require('@hapi/joi/lib/base');

const employeeSchema = Joi.object({
  firstName:Joi.string().required(),
  lastName:Joi.string().required(),
  email:Joi.string().email().lowercase().required(),
  position:Joi.string(),
  department:Joi.string(),
  salary:Joi.number().integer(),
  startDate:Joi.date()
})
const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number(),
  category: Joi.string(),
  stock: Joi.number().integer(),
  sku: Joi.string()
})

module.exports = {employeeSchema,productSchema};