const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
	Leaders.find({})
	.then((leaders) => {
		res.statusCode = 200;
		res.setHeader('Content-Type','application/json');
		res.json(leaders);
	}, (err) =>(err))
	.catch((err) => next(err));
})
.post((req,res,next) => {
	Leaders.create(req.body)
	.then((leader) => {
		console.log('Your profile as a leader added', leader);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(leader);
	}, (err) => next())
	.catch((err) =>next(err));
})
.put((req,res, next) => {
	res.statusCode = 403;
	res.end('This operation is not supported on /leaders')
})
.delete((req,res,next) => {
	Leaders.remove({})
	.then((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(res);
	},(err) => next(err))
	.catch((err) => next(err));
})


module.exports =  leaderRouter;
