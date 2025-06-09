const fs = require('fs');
const path = require('path');

const resourceNameSingular = process.argv[2];
if (!resourceNameSingular) {
  console.error('❌ Harap berikan nama resource (singular, PascalCase). Contoh: npm run make:resource Product');
  process.exit(1);
}

// Konvensi Nama
const modelName = resourceNameSingular.charAt(0).toUpperCase() + resourceNameSingular.slice(1);
const controllerName = `${modelName}Controller`;
const routeFileName = `${modelName.toLowerCase()}Routes.js`;

// Fungsi pluralize sederhana
function pluralize(word) {
  if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2))) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
    return word + 'es';
  } else if (word.toLowerCase() === 'person') {
      return 'people';
  }
  return word + 's';
}

const tableName = pluralize(modelName.toLowerCase());

const projectRoot = process.cwd();

function getCurrentTimestamp() {
  const now = new Date();
  const pad = (num) => num.toString().padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear().toString().slice(-2);
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

// Template Model
const modelTemplate = `
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ${modelName} extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The \`models/index\` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan asosiasi di sini
    }
  }
  ${modelName}.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    // Tambahkan definisi atribut lain untuk model ${modelName} di sini
  }, {
    sequelize,
    modelName: '${modelName}',
    tableName: '${tableName}',
    timestamps: true,
  });
  return ${modelName};
};
`;

// Template Controller
const controllerTemplate = `
'use strict';

const { ${modelName} } = require('../models');

const index = async (request, h) => {
  try {
    const data = await ${modelName}.findAll();
    return h.response({
      status: 'success',
      data: { ${tableName}: data }
    }).code(200);
  } catch (error) {
    console.error('Error di ${controllerName}.index:', error);
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

const store = async (request, h) => {
  try {
    const newData = await ${modelName}.create(request.payload);
    return h.response({
      status: 'success',
      message: '${modelName} berhasil dibuat',
      data: { ${modelName.toLowerCase()}: newData }
    }).code(201);
  } catch (error) {
    console.error('Error di ${controllerName}.store:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
      return h.response({ 
        status: 'fail', 
        message: 'Data tidak valid', 
        errors 
      }).code(400);
    }
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

const show = async (request, h) => {
  try {
    const { id } = request.params;
    const data = await ${modelName}.findByPk(id);
    if (!data) {
      return h.response({ 
        status: 'fail',
        message: '${modelName} tidak ditemukan' 
      }).code(404);
    }
    return h.response({
      status: 'success',
      data: { ${modelName.toLowerCase()}: data }
    }).code(200);
  } catch (error) {
    console.error('Error di ${controllerName}.show:', error);
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

const update = async (request, h) => {
  try {
    const { id } = request.params;
    const [updatedRows] = await ${modelName}.update(request.payload, { where: { id } });
    if (updatedRows === 0) {
      return h.response({ 
        status: 'fail',
        message: '${modelName} tidak ditemukan atau tidak ada perubahan' 
      }).code(404);
    }
    const updatedData = await ${modelName}.findByPk(id);
    return h.response({
      status: 'success',
      message: '${modelName} berhasil diperbarui',
      data: { ${modelName.toLowerCase()}: updatedData }
    }).code(200);
  } catch (error) {
    console.error('Error di ${controllerName}.update:', error);
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
      return h.response({ 
        status: 'fail', 
        message: 'Data tidak valid', 
        errors 
      }).code(400);
    }
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

const destroy = async (request, h) => {
  try {
    const { id } = request.params;
    const deletedRows = await ${modelName}.destroy({ where: { id } });
    if (deletedRows === 0) {
      return h.response({ 
        status: 'fail',
        message: '${modelName} tidak ditemukan' 
      }).code(404);
    }
    return h.response({ 
      status: 'success',
      message: '${modelName} berhasil dihapus' 
    }).code(200);
  } catch (error) {
    console.error('Error di ${controllerName}.destroy:', error);
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

module.exports = {
  index,
  store,
  show,
  update,
  destroy,
};
`;

// Template Migration
const migrationTimestamp = getCurrentTimestamp();
const migrationFileName = `${migrationTimestamp}_create_${tableName}_table.js`;
const migrationTemplate = `
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('${tableName}', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Tambahkan kolom lain di sini
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('${tableName}');
  }
};
`;

// Template Route dengan middleware auth
const specificRouteTemplate = `
'use strict';
const ${controllerName} = require('../controllers/${controllerName}');
const { authenticate, authorize } = require('../middleware/auth');

const ${modelName.toLowerCase()}Routes = [
  {
    method: 'GET',
    path: '/${tableName}',
    handler: ${controllerName}.index,
    options: {
      description: 'Dapatkan semua ${tableName}',
      tags: ['api', '${tableName}'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'POST',
    path: '/${tableName}',
    handler: ${controllerName}.store,
    options: {
      description: 'Buat ${modelName} baru',
      tags: ['api', '${tableName}'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'GET',
    path: '/${tableName}/{id}',
    handler: ${controllerName}.show,
    options: {
      description: 'Dapatkan ${modelName} berdasarkan ID',
      tags: ['api', '${tableName}'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'PUT',
    path: '/${tableName}/{id}',
    handler: ${controllerName}.update,
    options: {
      description: 'Perbarui ${modelName} berdasarkan ID',
      tags: ['api', '${tableName}'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'DELETE',
    path: '/${tableName}/{id}',
    handler: ${controllerName}.destroy,
    options: {
      description: 'Hapus ${modelName} berdasarkan ID',
      tags: ['api', '${tableName}'],
      pre: [
        { method: authenticate }
      ]
    }
  }
];

module.exports = ${modelName.toLowerCase()}Routes;
`;

// ---- Membuat File ----
const directories = {
  models: path.join(projectRoot, 'models'),
  controllers: path.join(projectRoot, 'controllers'),
  migrations: path.join(projectRoot, 'migrations'),
  routes: path.join(projectRoot, 'routes'),
};

Object.values(directories).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const filesToCreate = [
  { path: path.join(directories.models, `${modelName.toLowerCase()}.js`), content: modelTemplate, name: 'Model' },
  { path: path.join(directories.controllers, `${controllerName}.js`), content: controllerTemplate, name: 'Controller' },
  { path: path.join(directories.migrations, migrationFileName), content: migrationTemplate, name: 'Migration' },
  { path: path.join(directories.routes, routeFileName), content: specificRouteTemplate, name: 'Route' },
];

filesToCreate.forEach(file => {
  if (fs.existsSync(file.path)) {
    console.warn(`⚠️  ${file.name} file ${file.path} sudah ada. Dilewati.`);
  } else {
    fs.writeFileSync(file.path, file.content.trim());
    console.log(`✅ ${file.name} berhasil dibuat: ${file.path}`);
  }
});

// Generate/Update routes/index.js
const routesDir = directories.routes;
const routeIndexFile = path.join(routesDir, 'index.js');

try {
  const allRouteFiles = fs.readdirSync(routesDir)
    .filter(file => file.endsWith('Routes.js') && file !== 'index.js');

  let indexContent = `'use strict';\n\n`;
  let allRoutesArrayElements = [];

  if (allRouteFiles.length === 0) {
    indexContent += `// Tidak ada file route individual yang ditemukan di direktori ini (selain index.js).\n`;
    indexContent += `// Pastikan file route Anda memiliki akhiran 'Routes.js'.\n`;
  } else {
    allRouteFiles.forEach(file => {
      const routeModuleName = file.substring(0, file.indexOf('Routes.js'));
      indexContent += `const ${routeModuleName}Routes = require('./${file}');\n`;
      allRoutesArrayElements.push(`...${routeModuleName}Routes`);
    });
  }

  indexContent += `\nconst allRoutes = [\n`;
  if (allRoutesArrayElements.length > 0) {
    indexContent += `  ${allRoutesArrayElements.join(',\n  ')}\n`;
  }
  indexContent += `];\n\nmodule.exports = allRoutes;\n`;

  fs.writeFileSync(routeIndexFile, indexContent);
  console.log(`✅ Routes index file (${routeIndexFile}) berhasil diperbarui/dibuat.`);
} catch (error) {
  console.error(`❌ Gagal membuat/memperbarui ${routeIndexFile}:`, error);
}

console.log(`\n🎉 Resource ${modelName} berhasil dibuat!`);
console.log("-> Jangan lupa untuk menyesuaikan field di model dan migration.");
console.log("-> Jalankan 'npm run db:migrate' setelah menyesuaikan migration.");
console.log(`-> Pastikan controller '${controllerName}' dan model '${modelName}' diimplementasikan dengan benar.`);
console.log(`-> File route '${routeFileName}' dan '${routeIndexFile}' telah dibuat/diperbarui.`);

