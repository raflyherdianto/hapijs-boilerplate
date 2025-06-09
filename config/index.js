'use strict';

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const environments = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'backend_capstone',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5433,
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: parseInt(process.env.DB_PORT_PROD, 10) || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

const activeDBConfig = environments[env] || environments.development;

const appConfig = {
  env: env,
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || (env === 'production' ? '0.0.0.0' : 'localhost'),
  },
  database: activeDBConfig,
  environments: environments
};

if (env === 'production' && (!appConfig.database.username || !appConfig.database.password || !appConfig.database.database || !appConfig.database.host)) {
    console.error("❌ KESALAHAN: Kredensial database produksi (DB_USERNAME_PROD, DB_PASSWORD_PROD, DB_NAME_PROD, DB_HOST_PROD) wajib diatur di environment variables untuk mode production!");
}

module.exports = appConfig;