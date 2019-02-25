var express = require('express');
var router = express.Router();

router.post('/')

router.get('/', (req, res, next) => {
  res.send('OK')
})

module.exports = router;