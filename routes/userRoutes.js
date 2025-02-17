const { samplefn } = require('../controllers/communityController');

const userRouter=require('express').Router();

userRouter.route("/").get(samplefn);

module.exports=userRouter;
