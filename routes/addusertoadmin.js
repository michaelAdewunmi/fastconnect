const express = require('express');
const router = express.Router();
const Request = require('request');
require('dotenv').config();

router.get('/', (req, res, next) => {
	Request.get({
		"headers": { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `SSWS ${process.env.OKTA_AUTHORIZATION_TOKEN}` },
		"url": `https://dev-858900.oktapreview.com/api/v1/groups/${process.env.OKTA_ADMIN_GROUP_ID}/users`,
	}, (error, response, body) => {
		if(body){
			parsedBody = JSON.parse(body)
			if(!(parsedBody.errorCode)) {
				res.send(parsedBody);
			}else{
				res.send(parsedBody);
			}
		}
	})
});
///users/${req.params.userid} 
//${process.env.OKTA_ADMIN_GROUP_ID}/users
//00ufxxt8jwEmrLRzp0h7

module.exports = router;