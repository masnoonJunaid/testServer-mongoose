const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const cors = require('../cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();


favoriteRouter.route('/')
.options(cors.covrsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res,next) => {
	Favorites.findOne({user: req.user._id})
	.populate('User')
	.populate('dishes')
	.then((err, favorites) => {
		if(favorites != null){
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(favorites.dishes);
			res.json(favorites.User);
		} else {
			err = new Error('Favorite' + req.params.dishId + 'not found');
			err.status = 404;
			return next(err);
		}
	}, (err)  => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.findOne({ user: req.user._id}, (err, favorite) => {
		if(!favorite) {
			Favorites.create({ user: req.user._id})
			.then((favorite) => {
				favorite.dishes.push({"_id": req.params.dishes});
				favorite.save()
				.then((favorite) => {
					res.statusCode = 200;
					console.log('Favorite dish is created!');
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
				}).catch((err) => {
					return next(err);
				})
			})
			.catch((err) => {
				return next(err);
			})
		} else {
			favorite.save();
		}
	})
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.setHeader('Content-Type', 'text/plain');
	res.end('PUT operation is not supported')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
	Favorites.findOne({user: req.user._id}, {err, favorite});
		if(err) {
			return next(err);
			}
			let indexOfdish = favorite.dishes.indexOf(req.params.dishId);
			if (indexOfdish >= 0) {
			Favorite.remove()
			
	
		.then((favorite) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(favorite);
		}, (err) => next(err));
		} else{
			err = New Error('Favorite')
		})
});


