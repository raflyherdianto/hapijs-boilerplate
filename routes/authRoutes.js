const AuthController = require('../controllers/AuthController');

const authRoutes = [
    {
        method: 'POST',
        path: '/login',
        handler: AuthController.login,
        options: {
        description: 'Login user',
        tags: ['api', 'auth'],
        }
    },
    {
        method: 'POST',
        path: '/register',
        handler: AuthController.register,
        options: {
            description: 'Register user',
            tags: ['api', 'auth'],
        }
    },
    {
        method: 'POST',
        path: '/logout',
        handler: AuthController.logout,
        options: {
            description: 'Logout user',
            tags: ['api', 'auth'],
        }
    },
];

module.exports = authRoutes;