const { userLogin, userRegister } = require('../controllers/loginController');
const { getUser, getSelf } = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

const userRouter=require('express').Router();


userRouter.route('/').post(userRegister).get(authenticateUser,getUser);
userRouter.route('/login').post(userLogin);
userRouter.route('/self').get(authenticateUser,getSelf);


module.exports=userRouter;
