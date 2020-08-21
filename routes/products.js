var express = require('express');
var router = express.Router();

/* Post (add) product to database */
router.post('/', function(req, res, next) {
  const product = {
      name: req.body.name,
      price: req.body.price
  };
  res.status(201).json({
      message: 'Product was added',
      product: product.name
  });
});

router.get('/', function(req, res, next) {
  res.status(200).json({
    message: 'product get test is working',
    product: "sample product name"
  })
})

module.exports = router;
