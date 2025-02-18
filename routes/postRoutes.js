const postRouter=require('express').Router();
const { addPost } = require('../controllers/postController');
const { authenticateUser } = require('../middleware/auth');

postRouter.route('/').post(authenticateUser,addPost);

module.exports=postRouter;
