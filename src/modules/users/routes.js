const userRoutes = require('express').Router();
const isAuthenticated = require('../../middlewares/authenticated');

const {
  loginUserController, createNewUserController,
  updateUserController, changeUserPasswordController,
  getUsersController, deleteUserController,
} = require('./controller');

userRoutes.get('/users', isAuthenticated, getUsersController);
userRoutes.post('/users/singup', createNewUserController);
userRoutes.post('/users/singin', loginUserController);
userRoutes.put('/users/:userId', isAuthenticated, updateUserController);
userRoutes.delete('/users/:userId', isAuthenticated, deleteUserController);
userRoutes.patch('/users/:userId/change-password', isAuthenticated, changeUserPasswordController);

module.exports = userRoutes;
