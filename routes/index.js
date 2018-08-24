var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
	
//  	res.render('index');
// });

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('App is Running! Server is Listening on port')
  res.render('index', { title: 'Express' });
});

module.exports = router;
