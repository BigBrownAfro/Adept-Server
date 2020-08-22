var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products')

/* Post (add) product to database */
router.post('/', function(req, res, next) {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  })

  product.save()
    .then(result =>{
      console.log(result);
    })
    .catch(err => console.log(err));
    
  res.status(201).json({
    message: 'Product was added:',
    product: product
  });
});

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'No product returned as none was specified'
  })
})

router.get('/:productId', function(req, res, next) {
  const id = req.params.productId;

  Product.findById(id).exec()
    .then(doc => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });
});

module.exports = router;
