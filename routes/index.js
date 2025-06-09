'use strict';

const authRoutes = require('./authRoutes.js');
const userRoutes = require('./userRoutes.js');
const itemRoutes = require('./itemRoutes.js');
const transactionRoutes = require('./transactionRoutes.js');

const allRoutes = [
  ...authRoutes,
  ...userRoutes,
  ...itemRoutes,
  ...transactionRoutes
];

module.exports = allRoutes;
