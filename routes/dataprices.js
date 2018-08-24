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

router.post('/', (req, res, next) => {
	const response = []
	if(!req.body) return res.sendStatus(400);
	db.select('*').from('dataprices')
	.where('id', req.body.id)
	.then( dataPrices => {
		response.push(dataPrices[0]);
		db.select('*').from('datavolumes')
		.where('id', req.body.id)
		.then(dataVolumes => {
			response.push(dataVolumes[0]);
			res.status(200);
			res.send(response);
		}).catch(console.log)
	}).catch(err => {
		res.status(400);
		res.send(err);
	})
});

module.exports = router;
