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


router.get('/:id', (req, res, next) => {
	db('transactions').returning(['fullname', 'itemvolume', 'itemnetwork', 'approved'])
	.where('id', '=', req.params.id)
	.update({'approved': true})
	.then(updatedinfo => {
		res.status(201).send(updatedinfo)
	}).catch( err => {
		console.log(err);
		res.status(401).send(err);
	});
})


module.exports = router;