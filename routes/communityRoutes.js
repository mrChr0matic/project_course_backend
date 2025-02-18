const { addCommunity, getCommunity } = require('../controllers/communityController');
const { authenticateUser } = require('../middleware/auth');

const communityRouter=require('express').Router();

communityRouter.route('/').post(authenticateUser,addCommunity).get(getCommunity);

module.exports=communityRouter
