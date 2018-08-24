const express = require('express');
const router = express.Router();
const Request = require('request');
const knex = require('knex');
require('dotenv').config();


const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PWORD,
		database: process.env.DATABASE
	}
});

const allResponse = { 
	transactionsDbRes: null,
	oktaError: '',
	status: null,
	usersDbRes: '',
};

var dbInfo = "";

router.post('/', (req, res, next) => {
	if(!req.body) return res.sendStatus(400);
	console.log(req.body)
	db.select('*').from('users')
	.where('email', req.body.email)
	.then(data => {
		if (data[0].wallet>=req.body.amount) {
			dbInfo = data;
			next();
		}else{
			allResponse.usersDbRes = "Sorry! You have Insufficient funds!";
			return res.send(allResponse);
		}
	}).catch(err=> {
			allResponse.usersDbRes = "Couldnt interact with Database! User input wrong or database server is down!";
			res.status(400);
			return res.send(allResponse)
	});
});



router.post('/', (req, res, next) => {
	db('transactions').returning(['useremail', 'trnzctndate', 'trnzctnamount', 'itemrecipient'])
	.insert({ userid: dbInfo[0].id, fullname: dbInfo[0].fullname, useremail: dbInfo[0].email, trnzctndate: (new Date()).toISOString(), trnzctnamount: req.body.amount,
		boughtfromwallet: true, itembought: 'DATA', itemvolume: req.body.volume, itemnetwork: req.body.network, itemrecipient: req.body.recipient
	}).then(data3 => {
		next('route');
	}).catch(err=> {
		allResponse.transactionsDbRes = "There was a Problem! It seems something broke";
		return res.send(allResponse);
	});
});




router.post('/', (req, res, next) => {
	NewWalletAmount = dbInfo[0].wallet - req.body.amount;
	const purchaseCount = dbInfo[0].purchasecount+1;
	db('users').returning(['email', 'wallet'])
	.where('email', '=', dbInfo[0].email)
	.update({'wallet': NewWalletAmount, purchasecount: purchaseCount})
	.then( data2 => {
		allResponse.usersDatabaseRes = "User Database Update was successful";
		next('route')
	}).catch(err=> {
		allResponse.usersDatabaseRes = "Request accepted but there was a problem updating user!";
		return res.send(data2);
	})
});

router.post('/', (req, res, next) => {
	const newOktaWallet = (req.body.oktawallet)-req.body.amount;
	const newPurchaseCount = req.body.purchaseCount+1;
	const sendWalletVal = {
		profile: {
			wallet: newOktaWallet,
			purchasecount: newPurchaseCount
		}
	}
	Request.post({
		"headers": { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `SSWS ${process.env.OKTA_AUTHORIZATION_TOKEN}` },
		"url": `${process.env.OKTA_USER_UPDATE_BASE_URL}${req.body.id}`,
		"body": JSON.stringify(sendWalletVal)
	}, (error, response, body) => {
		if(body && !(body.errorCode)){
			allResponse.status = "Success";
			next('route');
		}else{
			allResponse.oktaNotification = "Okta user profile was not updated";
			res.send(allResponse);
		}
	})
});


router.post('/', (req, res, next) => {
	const txtBody = 
	`Hello Raymond! ${dbInfo[0].fullname} needs ${req.body.volume} of ${req.body.network} data to be sent to the number ${req.body.recipient}`;
	const smsData = {
		SMS: {
		    auth: { username: process.env.SMS_USERNAME, 'apikey': process.env.SMS_API_KEY },
		    message: { sender: 'FASTCONNECT', messagetext: txtBody, flash: '0' },
		    recipients: { gsm: [{ msidn: '2348024455759', msgid: 'Test!' }]}
		}
	}
	Request.post({
		"headers": { "Content-Type": "application/json" },
		"url": "http://api.ebulksms.com:8080/sendsms.json",
		"body": JSON.stringify(smsData)
	}, (error, response, body) => {
		res.status(200);
		res.send(allResponse);
	})
})

module.exports = router;
