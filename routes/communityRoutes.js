const { addCommunity, getCommunity, getAllCommunity } = require('../controllers/communityController');
const { joinComm } = require('../controllers/membershipController');
const { authenticateUser } = require('../middleware/auth');

const communityRouter=require('express').Router();

communityRouter.route('/').post(authenticateUser,addCommunity)
communityRouter.route('/specific').post(getCommunity);
communityRouter.route('/all').get(getAllCommunity);
communityRouter.route('/join').post(authenticateUser,joinComm);

module.exports=communityRouter
