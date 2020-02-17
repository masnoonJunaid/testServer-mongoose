const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
	res.statusCode = 200;
	res.setHeader('Content-type', 'text/plain');
	next();
})
.get((req,res,next) =>{
	res.end('This is the result of GET request of leaderRouter module');
})
.post((req,res,next) => {
	res.end('You will add about yourself :' + res.body.leader + 'and your parliament seat detail' + req.body.seat);
})
.put((req,res,next) => {
	// status code 403 signifies certain operation doesn't supported here
	res.statusCode = 403;
res.end('PUT operation is not supported on leadership');
})
.delete((req,res,next) => {
	res.end('Deleting your leadership profile');
})

leaderRouter.route('/:leaderId')
.all((req,res,next) => {
	res.statusCode = 200;
	res.setHeader('content-type', 'text/plain');
	next();
})
.get((req,res,next) => {
	res.end('You will receive your leader profile with your leaderId: ' + req.params.leaderId)
})
.post((req,res,next) => {
	res.statusCode = 403;
	res.end('post operation will be supported at /leadership/ ' + req.params.leaderId + 'once i start taking your reviews' );
})
.put((req,res,next) => {
	res.write('will update your leadership profile at leaderId: ' + req.params.leaderId + '\n');
	res.end('you will update your :' + req.body.flat + 'with address :' + req.body.address);

})
.delete((req,res,next) => {
	res.end('This operation will delete your profile with id:  ' +  req.params.leaderId);
});

module.exports =  leaderRouter;
