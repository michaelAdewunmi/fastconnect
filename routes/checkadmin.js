const express = require('express');
const router = express.Router();
const Request = require('request');
require('dotenv').config();

router.get('/:userid', (req, res, next) => {
	Request.get({
		"headers": { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `SSWS ${process.env.OKTA_AUTHORIZATION_TOKEN}` },
		"url": `https://dev-858900.oktapreview.com/api/v1/groups/${process.env.OKTA_ADMIN_GROUP_ID}/users`,
	}, (error, response, body) => {
		if(body){
			parsedBody = JSON.parse(body)
			if(parsedBody.length!==0 && !(parsedBody.errorCode)) {
				if(parsedBody[0].id===req.params.userid) {
					res.send(JSON.stringify({Admin: true}));
				}
			}else{
				res.send(JSON.stringify({Admin: false}))
			}
		}
	})
});
///users/${req.params.userid} 

module.exports = router;