const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connection');
const Routes = require('./routes/index');
const createError = require('http-errors');
const port = process.env.PORT || 8080;
const app = express();


app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With,Content-type,Accept,Z-key'
    );
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
    next();
  })
  .use('/', Routes);


  app.use((req,res,next)=>{
     next(createError(404,'Not Found'))
  });

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
app.use((err,req,res,next)=>{
  res.status(err.status || 500);
  res.send({
    error:{
      status:err.status || 500,
      message: err.message
    }
  });
});