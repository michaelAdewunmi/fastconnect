const express = require('express');
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


router.get('/', (req, res, next) => {
	const response = []
	if(!req.body) return res.sendStatus(400);
	db.select('*').from('transactions')
	.where({boughtfromwallet: true}).orderBy('id', 'desc').limit('30')
	.then( orders => {
		res.status(201).send(orders);
	}).catch(err => {
		console.log(err)
		res.status(400);
		res.send(err);
	})
});


module.exports = router;