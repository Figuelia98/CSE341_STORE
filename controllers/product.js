const mongodb = require('../db/connection');
const { productSchema } = require('../helpers/body_validation');
const ObjectId = require('mongodb').ObjectId;

const listProducts = async (req, res, next) => {
  //#swagger.tags=['Product'];
  const result = await mongodb.getDb().db().collection('Product').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists); 
  });
};
const getProduct = async (req, res, next) => {
   //#swagger.tags=['Product'];
  const userId = new ObjectId(req.params.id)
  const result = await mongodb.getDb().db().collection('Product').find({_id:userId});
  result.toArray().then((user) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user[0]);
  });
};
const createProduct = async (req,res)=>{
//#swagger.tags=['Product'];
const product = {
  name: req.body.name,
  description: req.body.description,
  price: req.body.price,
  category: req.body.category,
  stock: req.body.stock,
  sku: req.body.sku
}
 const result = await productSchema.validateAsync(req.body);
  const response = await mongodb.getDb().db().collection('product').insertOne(product);
  if(response.acknowledged > 0){
    res.status(204).send();
  }
  else{
    res.status(500).json(response.error ||"Some error occur while inserting product");
  }


};
const updateProduct = async (req,res)=>{
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
 const result = await productSchema.validateAsync(req.body);
  const response = await mongodb.getDb().db().collection('Product').replaceOne({_id:userId},product);
  if(response.modifiedCount > 0){
    res.status(204).send();
  }
  else{
    res.status(500).json(response.error ||"Some error occur while updating product ");
  }

};
const deleteProduct = async (req,res)=>{
//#swagger.tags=['Product'];
const userId = new ObjectId(req.params.id)
  const response = await mongodb.getDb().db().collection('Product').deleteOne({_id:userId});
  if(response.deletedCount > 0){
    res.status(204).send();
  }
  else{
    res.status(500).json(response.error ||"Some error occur while deleting product");
  }
};

module.exports = {
   listProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,

 };