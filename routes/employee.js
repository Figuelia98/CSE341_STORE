const express = require('express');
const createError = require('http-errors');
const employeeController = require('../controllers/employee');
const router = express.Router();
const{isAuthenticated} = require("../middleware/authenticate");
router.get('/', employeeController.listEmployees);
router.get('/:id',employeeController.getEmployee);
router.post('/',isAuthenticated, employeeController.createEmployee);
router.put('/:id',isAuthenticated, employeeController.updateEmployee);
router.delete('/:id',isAuthenticated, employeeController.deleteEmployee);
module.exports = router;

