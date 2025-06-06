const mongodb = require('../db/connection');
const { productSchema } = require('../helpers/body_validation');
const ObjectId = require('mongodb').ObjectId;
const createError = require('http-errors');
const mongoose = require('mongoose');
const listProducts = async (req, res, next) => {
  //#swagger.tags=['Product'];
 try {
    const cursor = await mongodb.getDb().db().collection('Product').find();
    const products = await cursor.toArray();

    if (!products || products.length === 0) {
      throw createError(404, 'No products found');
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  } catch (error) {
    console.log(JSON.stringify(error));
    next(error);
  }
};
const getProduct = async (req, res, next) => {
   //#swagger.tags=['Product'];
  const userId = new ObjectId(req.params.id);
  try{
   const result = await mongodb.getDb().db().collection('Product').find({_id:userId});
   console.log(result);
   if(result){
    result.toArray().then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user[0]);
  });
   }
    else{
      throw createError(404, "No product found");
     }
 
  }
  catch(error){
   console.log(JSON.stringify(error));
   if(error instanceof mongoose.CastError){
      next(createError(400,"Invalid employee Id"));
      return;
      }
      next(error);
  }
};
const createProduct = async (req,res,next)=>{
//#swagger.tags=['Product'];
const product = {
  name: req.body.name,
  description: req.body.description,
  price: req.body.price,
  category: req.body.category,
  stock: req.body.stock,
  sku: req.body.sku
}
try{
 const result = await productSchema.validateAsync(req.body);
 const response = await mongodb.getDb().db().collection('product').insertOne(product);

if(response.acknowledged > 0){
    res.status(204).send();
 }
}
catch(error){
if(error.name === 'ValidationError'){
  next(createError(422,error.message));
  return;
}
next(error)
  
}

  

};
const updateProduct = async (req,res,next)=>{
//#swagger.tags=['Product'];
const userId = new ObjectId(req.params.id)
const product = {
  name: req.body.name,
  description: req.body.description,
  price: req.body.price,
  category: req.body.category,
  stock: req.body.stock,
  sku: req.body.sku
}
try{
const result = await productSchema.validateAsync(req.body);
  const response = await mongodb.getDb().db().collection('Product').replaceOne({_id:userId},product);
  if(response.modifiedCount === 0){
    throw createError(404, "No product found");
  }
  res.status(204).send();
}
catch(error){
if(error.name === 'ValidationError'){
  next(createError(422,error.message));
  return;
}
if (error instanceof mongoose.CastError || error.name === 'BSONTypeError') {
      return next(createError(400, 'Invalid employee ID'));
    }
next(error)
}
 

};
const deleteProduct = async (req,res)=>{
//#swagger.tags=['Product'];
const userId = new ObjectId(req.params.id)

try{
   const response = await mongodb.getDb().db().collection('Product').deleteOne({_id:userId});
  if(response.deletedCount === 0){
      throw createError(404, "No product found");
    
  }
 res.status(204).send();
}catch(error){
    if (error instanceof mongoose.CastError || error.name === 'BSONTypeError') {
      return next(createError(400, 'Invalid employee ID'));
    }
    next(error);
}
 

};

module.exports = {
   listProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,

 };