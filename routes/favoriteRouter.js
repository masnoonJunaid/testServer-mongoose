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

//support for favorite/:dishId end point

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res,) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
	res.statusCode = 403;
	res.end('GET operation not supported here!');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.findById(req.params.dishId)
	.then((favorite) => {
		if(!favorite){
			favorite.dish.push(req.body);
			favorite.save()
			.then((favorite) => {
				Favorites.findById(dish._id)
				.populate('favorite.dishes')
				.then((favorite) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
				})
			}, (err) => next(err));
		}
		else{
			err = new Error('Dish' + req.params.dishId + 'already your favorite dish');
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /favorites')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (res, res, next) => {
	Favorites.findById(req.params.dishId)
	.then((favorite) => {
		if (favorite != null && favorite.dishes.id(req.params.dishId) != null && favorite.dishes.id == req.user._id){
		favorite.dishes.id(req.params.dishId).remove();
			favorite.save()
			.then((dish) => {
				Favorite.findById(dish._is)
				.populate('dishes.author')
				.then((favorite) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
				})
			}, (err) => next(err));
		}
		else if(favorite == null) {
			err = new Error('Favorite Dish' + req.params.dishId + ' not found');
			err.status = 404;
			return next(err);
		} else {
			err = new Error('Favotite dish' + req.params.dsihId + ' Not found');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});



module.exports = favoriteRouter;


