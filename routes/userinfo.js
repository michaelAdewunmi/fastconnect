const express = require ('express');
const router = express.Router();
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

var allData = { userData: null, paymentHistory: null, purchaseHistory: null };

router.get('/:email', (req, res, next) => {
	db.select('*').from('users').where('email', req.params.email).then( data => {
		allData.userData = data;
		next();
	}).catch(err => {
		res.status(404);
		return res.send(err);
	})
});

router.get('/:email', (req, res, next) => {
	db.select('*').from('transactions').where({useremail: allData.userData[0].email, paidintowallet: true}).orderBy('id', 'desc')
	.then( data2 => {
		allData.paymentHistory = data2;
		next('route')
	}).catch(err => {
		res.status(404);
		return res.send(err);
	})
});


router.get('/:email', (req, res, next) => {
	db.select('*').from('transactions').where({useremail: allData.userData[0].email, boughtfromwallet: true}).orderBy('id', 'desc')
	.then( data3 => {
		allData.purchaseHistory = data3;
		res.status(201).send(allData);
	}).catch(err => {
		res.status(404);
		return res.send(err);
	})
});

module.exports = router;