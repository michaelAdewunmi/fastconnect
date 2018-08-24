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

const server_url = "https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/xrequery"; 
var userdata = null;
var raveResponse = null;
var paymentResponses = {
	PaymentVerification: false,
	oktaResponse: null,
	userDBerror: null,
}

router.post('/', (req,res,next) => {
	if(!req.body) return res.sendStatus(400);
	const payload = {
		"SECKEY": process.env.RAVE_SECRET_KEY,
		"txref": req.body.paymentRef,
		"include_payment_entity": 1
	}
	Request.post({
		"headers": { "content-type": "application/json" },
		"url": server_url,
		"body": JSON.stringify(payload)
	}, (error, response, body) => {
		if(!error && response.statusCode===200){
			raveResponse = JSON.parse(body);
			paymentResponses.PaymentVerification = true;
			next();
		}else{
			res.status(404);
			res.send(paymentResponses);
		}
	})
})

router.post('/', (req,res,next) => {
	const amountPaid = req.body.amount;
	if(raveResponse.data.status==="successful" && raveResponse.data.chargecode==="00" && amountPaid===raveResponse.data.amount) {
		db.select('*').from('users')
		.where('email', raveResponse.data.custemail)
		.then( data => {
			userdata = data;
			next('route');
		}).catch(err=> {
			raveResponse.userDBerror = 'Could not Find specified User'
			console.log(err)
			res.send(raveResponse)
		})
	}
});

router.post('/', (req, res, next) => {
	const NewWalletAmount = Number(userdata[0].wallet)+raveResponse.data.amount;
	const increaseCount = (userdata[0].paymentcount)+1
	db('users').returning(['email', 'wallet'])
	.where('email', '=', raveResponse.data.custemail)
	.update({'wallet': NewWalletAmount, 'paymentcount': increaseCount })
	.then(updatedinfo => {
		next('route');
	}).catch( err => {
		console.log(err);
		res.status(401);
		res.send(err);
	});
})

router.post('/', (req,res,next) => {
	console.log("tranzct", userdata);
	db('transactions').returning(['useremail', 'paidintowallet', 'trnzctnamount'])
	.insert({ userid: userdata[0].id, fullname:userdata[0].fullname, useremail: userdata[0].email, trnzctndate: (new Date()).toISOString(), trnzctnamount: raveResponse.data.amount,
		paidintowallet: true, ravepaymentref:req.body.ref, approved: true
	}).then(data=> {
		next('route');
	}).catch(err=> {
		console.log(err);
		res.send(err);
	});
});

router.post('/', (req,res,next) => {
	const newOktaWallet = (req.body.oktaWallet)+raveResponse.data.amount;
	const newPaymentCount = (req.body.oktaPaymentCount)+1;
	console.log(newPaymentCount, newOktaWallet)
	const sendWalletVal = {
		profile: {
			wallet: newOktaWallet,
			paymentcount: newPaymentCount
		}
	}
	Request.post({
		"headers": { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `SSWS ${process.env.OKTA_AUTHORIZATION_TOKEN}` },
		"url": `${process.env.OKTA_USER_UPDATE_BASE_URL}${req.body.id}`,
		"body": JSON.stringify(sendWalletVal)
	}, (error, response, body) => {
		if(!(body.errorCode)){
			console.log(body)
			paymentResponses.oktaResponse = 'User Update successful';
			res.send(paymentResponses);
		}else{
			console.log(body);
			paymentResponses.oktaResponse = 'Could not update Okta Database';
			res.send(paymentResponses);
		}
	})
});


module.exports = router;