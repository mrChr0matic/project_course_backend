const postRouter=require('express').Router();
const { addPost, getPosts } = require('../controllers/postController');
const { userVote } = require('../controllers/votes.controller');
const { authenticateUser } = require('../middleware/auth');

postRouter.route('/').post(authenticateUser,addPost).get(getPosts);
postRouter.route('/vote').post(authenticateUser,userVote);

module.exports=postRouter;
