const express = require('express');
const bodyParser =  require('body-parser');
const app = express();


const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
	res.statusCode = 200;
	res.setHeader('Content-type', 'text/plain');
	next();
})
.get((req,res, next) => {
	res.end('you will get your promocodes here');
})
.post((req,res,next) => {
	res.end('will add the promo code: ' + res.body.name + ' with promo details: ' + req.body.description);
})
.put((req,res,next) => {
	res.statusCode = 403;
	// statuscode 403 signify the particular operation not supported
	res.end('PUT operation not supported now, will make a input form soon to take your reviews');
})
.delete((req,res,next) => {
	res.end('Deleting your promocodes');
});

promoRouter.route('/:promoId')
.all((req,res,next) => {
	res.statusCode = 200;
	res.setHeader('Content-type', 'text/plain');
	next();
})
.get((req,res,next) => {
	res.send('This request give you promoId which is ' + req.params.promoId)
})
.post((req,res, next) => {
	res.statusCode = 403;
	res.end('you will add promodetails at  /promotions/ of your promotions ' + res.params.promoId);
})
.put((req,res,next) => {
	res.write('Updating the dish: ' + req.params.promoId + '\n');
	res.end('Will update your promotion id for new promotion: ' + req.params.promotion + 'and promotions details are :' + req.body.description);
})
.delete((req,res,next) => {
	res.end('deleting your promotions  details of' + req.params.promoId );
});


module.exports = promoRouter;
