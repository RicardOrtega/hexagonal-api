const express = require('express');

function createUserRoutes(userController) {
    const router = express.Router();

    router.get('/users', userController.getAllUsers);
    router.get('/users/stats', userController.getUserStats);
    router.get('/users/check-email/:email', userController.checkEmail);
    router.get('/users/:id', userController.getUserById);
    router.post('/users', userController.createUser);
    router.put('/users/:id', userController.updateUser);
    router.delete('/users/:id', userController.deleteUser);

    return router;
}

module.exports = createUserRoutes;