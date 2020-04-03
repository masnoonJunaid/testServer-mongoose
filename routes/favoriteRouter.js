const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
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

				for(i = 0; i < req.body.length; i++)
					if (favorite.dishes.indexOf(req.body[i]._id))
						favorite.dishes.push(req.body[i]);
				favorite.save()
				.then((favorite) => {
					Favorites.findById(favorite._id)
					.populate('User')
					.populate('dishes')

					.then((favorite) => {
					res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
					})
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
			err = new Error('Favorite')
		}
});

//support for favorite/:dishId end point

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res,) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
	Favorites.findOne({user: req.user._id})
	.then((favorites) => {
		if (!favorites) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json({"exists": false, "favorites": favorites});
		}
		else {
			if(favorites.dishes.indexOf(req.params.dishId) < 0){
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				return res.json({"exists": false, favorites})
			}
			else {
				res.statusCode = 200;
				res.setHeader('Content-Type','application/json');
				return res.json({"exists": true, "favorites" : favorites})
			}
		}

	})
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.findOne({ user: req.user._id}, (err, favorite) => {
		if (err) return next(err);

		if(!favorite){
                    Favorites.create({ user: req.user._id})
                    .then((favorites) => {
                                favorites.dishes.push({ "_id" : req.params.dishId})
																favorite.save()
                                .then((favorite) => {
																				Favorites.findById(favorite._id)
																				.populate('user')
																				.populate('dishes')
																				.then((favorite) => {
																					res.statusCode = 200;
	                                        res.setHeader('Content-Type', 'application/json');
	                                        res.json(favorite);
																				})
                                })
																.catch((err) => {
																	return next(err);
																});
                        })
												.catch((err) => {
													return next(err);
												})
                }
                else{
                      if(favorite.dishes.indexOf(req.params.dishId) < 0) {
												favorite.dishes.push({"_id": req.params.dishId})
												favorite.save()
												.then((favorite) => {
													Favorites.findById(favorite._id)
													.populate('user')
													.populate('dishes')
													.then((favorite) => {
														res.statusCode = 200;
														res.setHeader('Content-Type', 'application/json')
														res.json(favorite);
													})
											})
											.catch((err) => {
												return next(err);
											})
										}
										else {
											res.statusCode = 403;
											res.setHeader('Content-Type', 'text/plain');
											res.end('Dish ' + req.params.dishId + 'already this dish exits')
										}
                })
	})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /favorites')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Favorites.findById(req.params.dishId)
	.then((favorite) => {
		if (favorite != null && favorite.dishes.id(req.params.dishId) != null && favorite.dishes.id == req.user._id){
		favorite.dishes.id(req.params.dishId).remove();
			favorite.save()
			.then((dish) => {
				Favorite.findById(dish._id)
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
