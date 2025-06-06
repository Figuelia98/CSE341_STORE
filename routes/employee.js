const express = require('express');
const createError = require('http-errors');
const employeeController = require('../controllers/employee');
const router = express.Router();
router.get('/', employeeController.listEmployees);
router.get('/:id',employeeController.getEmployee);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
module.exports = router;

