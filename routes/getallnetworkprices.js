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
	const response = {
		dataPrices: null,
		dataVolumes: null
	}
	if(!req.body) return res.sendStatus(400);
	db.select('*').from('dataprices')
	.then( dataPrices => {
		response.dataPrices = dataPrices;
		db.select('*').from('datavolumes')
		.then(dataVolumes => {
			response.dataVolumes = dataVolumes;
			res.status(200);
			res.send(response);
		}).catch(console.log)
	}).catch(err => {
		res.status(400);
		res.send(err);
	})
});

module.exports = router;