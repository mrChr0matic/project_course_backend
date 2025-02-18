const postRouter=require('express').Router();
const { addPost, getPosts } = require('../controllers/postController');
const { authenticateUser } = require('../middleware/auth');

postRouter.route('/').post(authenticateUser,addPost).get(getPosts);

module.exports=postRouter;
