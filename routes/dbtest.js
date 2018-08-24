const express = require('express');
const router = express.Router();
const Request = require('request');


//const addusertogroupurl = `https://dev-858900.oktapreview.com/api/v1/groups/00gfx14399GDkOAN50h7/users`;
// const getgroupurl= `https://dev-858900.oktapreview.com/api/v1/groups/00gfx14399GDkOAN50h7/users`;
// const creategroupurl = `https://dev-858900.oktapreview.com/api/v1/groups/00gfx14399GDkOAN50h7/users`;
// const addusertogroupusers = `https://dev-858900.oktapreview.com/api/v1/groups`;


// router.post('/', (req,res,next) => {
// 	if(!req.body) return res.sendStatus(400);
// 	// const user = {
// 	// 	profile: {
// 	// 		email: req.body.email,
// 	// 	}
// 	// }
// 	//console.log(user)
// 	Request.get({
// 		"headers": { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "SSWS 00Mg6j_Af6mMX13DrBTF0Si6X_8kDayK_-3pxkN1hW"},
// 		"url": `${addusertogroupusers}/${req.body.groupid}/users`,
// 		//"body": JSON.stringify(user)
// 	}, (error, response, body) => {
// 		if(!error){
// 			console.log(body)
// 			const oktaResponse=JSON.parse(body);
// 			res.send(oktaResponse[0].id);
// 		}else{
// 			res.send(error);
// 		}
// 	})
// });

//dmilade: 00ufw51wran7B99ms0h7

// router.post('/', (req,res,next) => {
// 	if(!req.body) return res.sendStatus(400);
// 	const userid = {
// 			id: req.body.id
// 		}
// 	Request.get({
// 		"headers": { "Accept": "application/json", "Content-Type": "application/json", "Authorization": "SSWS 00Mg6j_Af6mMX13DrBTF0Si6X_8kDayK_-3pxkN1hW"},
// 		"url": `${url}/${req.body.id}`,
// 	}, (error, response, body) => {
// 		if(!error){
// 			const oktaResponse=JSON.parse(body);
// 			res.send(oktaResponse);
// 		}else{
// 			res.send(error);
// 		}
// 	})
// })



router.post('/', (req, res, next) => {
	    const post_data = {
	        'username' : 'd.devignersplace@gmail.com',
	        'to'       : '+2348024455759',
	        'message'  : req.body.msg
	    }
	    console.log(JSON.stringify(post_data));
		Request.post({
			"headers": { 
				"Accept": "application/json", 
				// "Content-Type": "application/json",
				'Content-Type' : 'application/x-www-form-urlencoded',
				"apikey": "5c2b4982feee79854fd47c73a1445448d1816f55e7d10e8d334d9b7576ba24e7"
			},
			"url": `http://api.africastalking.com/version1/messaging`,
			"rejectUnauthorized" : false,
	        "requestCert"        : true,
	        "agent"              : false,
			"body": JSON.stringify(post_data)

			}, (error, response, body) => {
				if(!error){
					res.send(body);
				}else{
					console.log(error)
					res.send(error);
				}
			});
})



/*GET all user listings*/
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

module.exports = router;
