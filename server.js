'use strict';

const Hapi = require('@hapi/hapi');
const appConfig = require('./config');
const db = require('./models');
const allAppRoutes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: appConfig.server.port,
    host: appConfig.server.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  if (allAppRoutes && allAppRoutes.length > 0) {
    server.route(allAppRoutes);
    console.log(`✅ ${allAppRoutes.length} route berhasil didaftarkan dari routes/index.js`);
  } else {
    console.warn("⚠️ Tidak ada route yang ditemukan atau didaftarkan dari routes/index.js.");
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return { message: `Selamat datang di Hapi.js Project Saya! (Env: ${appConfig.env})` };
    }
  });

  // Koneksi database menggunakan konfigurasi dari appConfig (models/index.js secara implisit akan menggunakan config yang sama jika setupnya benar)
  if (appConfig.env !== 'production' || process.env.RUN_DB_AUTH_IN_PROD === 'true') { // Hati-hati dengan db auth di production saat startup
    try {
      await db.sequelize.authenticate();
      console.log(`Koneksi database ke '${appConfig.database.database}' di host '${appConfig.database.host}' berhasil.`);
    } catch (error) {
      console.error(`Tidak dapat terhubung ke database '${appConfig.database.database}':`, error.message);
      // process.exit(1); // Pertimbangkan untuk keluar jika koneksi DB kritis untuk startup
    }
  }


  await server.start();
  console.log(`Server berjalan pada http://${appConfig.server.host}:${appConfig.server.port}`);
  console.log(`Lingkungan saat ini: ${appConfig.env}`);
};

process.on('unhandledRejection', (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

init();