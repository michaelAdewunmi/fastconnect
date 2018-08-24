const express = require('express');
const router = express.Router();
const oktaClient = require('../lib/oktaClient');
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


/* Collect all frontEnd Registation info and register a new user*/
router.post('/', (req, res, next) => {
	if(!req.body) return res.sendStatus(400);
	const newUser = {
		profile: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			wallet: 0,
			mobilePhone: req.body.phone,
			paymentcount: 0,
			purchasecount: 0,
			login: req.body.email
		},
		credentials: {
			password: {
				value: req.body.password
			}
		}
	};
	const fullName = newUser.profile.firstName + " " + newUser.profile.lastName;
	oktaClient.createUser(newUser)
	.then( user => {
		db('users')
		.insert({ email: newUser.profile.email, fullname: fullName, oktaidentifier: user.id, phonenumber: user.profile.mobilePhone, joined: (new Date()).toISOString() })
		.then( data => { 
			res.status(201);
			res.send(user);
		})
		}).catch( err => {
			res.status(400);
			res.send(err);
		})
});

/*GET all user listings*/
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

module.exports = router;
