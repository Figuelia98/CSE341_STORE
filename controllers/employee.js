const mongodb = require('../db/connection');
const{employeeSchema} = require('../helpers/body_validation');
const createError = require('http-errors');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

const listEmployees = async (req, res, next) => {
  //#swagger.tags=['Employee'];
  try{
   const result = await mongodb.getDb().db().collection('Employee').find();
   if(result){
    result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists); 
  });
   }
   else{
    throw createError(404, "No employee found");
   }
  }
  catch(error){
   console.log(JSON.stringify(error));
   
   next(error);
  }
 
};
const getEmployee = async (req, res, next) => {
   //#swagger.tags=['Employee'];
  try {
    const userId = new ObjectId(req.params.id);

    const user = await mongodb.getDb().db().collection('Employee').findOne({ _id: userId });

    if (!user) {
      throw createError(404, 'Employee not found');
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (error) {
    console.log(JSON.stringify(error));
    
    if (error instanceof mongoose.CastError || error.name === 'BSONTypeError') {
      return next(createError(400, 'Invalid employee ID'));
    }

    next(error);
  }
  
};
const createEmployee = async (req,res,next)=>{
   //#swagger.tags=['Employee'];
 const employee = {
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email,
  position: req.body.position,
  department: req.body.department,
  salary: req.body.salary,
  startDate: req.body.startDate
}

try{
 const result = await employeeSchema.validateAsync(req.body);

  const response = await mongodb.getDb().db().collection('Employee').insertOne(employee);
  if(response.acknowledged > 0){
    res.status(204).send();
  }
}catch(error){
 console.log(JSON.stringify(error));
if(error.name === 'ValidationError'){
  next(createError(422,error.message));
  return;
}
next(error)

}


};
const updateEmployee = async (req,res,next)=>{
//#swagger.tags=['Employee'];
const userId = new ObjectId(req.params.id)
const employee = {
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  email: req.body.email,
  position: req.body.position,
  department: req.body.department,
  salary: req.body.salary,
  startDate: req.body.startDate
}
 try{
 const result = await employeeSchema.validateAsync(req.body);
  const response = await mongodb.getDb().db().collection('Employee').replaceOne({_id:userId},employee);
  if (!response) {
      throw createError(404, 'Employee not found');
  }
  if(response.modifiedCount > 0){
    res.status(204).send();
  }
 }catch(error){
   console.log(JSON.stringify(error));
   if(error instanceof mongoose.CastError){
   next(createError(400,"Invalid employee Id"));
   return;
   }
   if(error.name === 'ValidationError'){
  next(createError(422,error.message));
  return;
    }
   next(error);
 }


};
const deleteEmployee = async (req,res,next)=>{
//#swagger.tags=['Employee'];
try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb.getDb().db().collection('Employee').deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      // No employee was deleted because none matched the ID
      throw createError(404, 'Employee not found');
    }

    // Success: Employee deleted
    res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.log(JSON.stringify(error));

    if (error instanceof mongoose.CastError || error.name === 'BSONTypeError') {
      return next(createError(400, 'Invalid employee ID'));
    }

    next(error);
  }
};

module.exports = {
   listEmployees,
   getEmployee,
   createEmployee,
   updateEmployee,
   deleteEmployee,

 };