'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('items', [
      {
        nama_item: 'Intel Core i7-13700K',
        deskripsi: 'Processor Intel Core i7 generasi ke-13 dengan 16 core dan 24 thread',
        harga: 6500000.00,
        stok: 25,
        kategori: 'Processor',
        gambar_url: 'https://example.com/images/intel-i7-13700k.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'AMD Ryzen 7 7700X',
        deskripsi: 'Processor AMD Ryzen 7 dengan arsitektur Zen 4',
        harga: 5800000.00,
        stok: 30,
        kategori: 'Processor',
        gambar_url: 'https://example.com/images/amd-ryzen7-7700x.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'NVIDIA GeForce RTX 4070',
        deskripsi: 'VGA Card NVIDIA RTX 4070 12GB GDDR6X',
        harga: 9500000.00,
        stok: 15,
        kategori: 'VGA Card',
        gambar_url: 'https://example.com/images/rtx-4070.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'AMD Radeon RX 7600 XT',
        deskripsi: 'VGA Card AMD Radeon RX 7600 XT 16GB',
        harga: 8200000.00,
        stok: 20,
        kategori: 'VGA Card',
        gambar_url: 'https://example.com/images/rx-7600xt.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'Corsair Vengeance LPX 32GB DDR4',
        deskripsi: 'RAM DDR4 32GB (2x16GB) 3200MHz',
        harga: 1800000.00,
        stok: 40,
        kategori: 'Memory',
        gambar_url: 'https://example.com/images/corsair-vengeance-32gb.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'G.Skill Trident Z5 DDR5 32GB',
        deskripsi: 'RAM DDR5 32GB (2x16GB) 6000MHz',
        harga: 3200000.00,
        stok: 25,
        kategori: 'Memory',
        gambar_url: 'https://example.com/images/gskill-trident-z5-32gb.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'Samsung 980 PRO 1TB NVMe SSD',
        deskripsi: 'SSD NVMe M.2 1TB dengan kecepatan baca hingga 7000 MB/s',
        harga: 1500000.00,
        stok: 35,
        kategori: 'Storage',
        gambar_url: 'https://example.com/images/samsung-980pro-1tb.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'WD Black SN850X 2TB NVMe SSD',
        deskripsi: 'SSD NVMe M.2 2TB untuk gaming dan content creation',
        harga: 2800000.00,
        stok: 20,
        kategori: 'Storage',
        gambar_url: 'https://example.com/images/wd-black-sn850x-2tb.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'ASUS ROG Strix Z790-E Gaming',
        deskripsi: 'Motherboard Intel Z790 dengan WiFi 6E dan DDR5 support',
        harga: 4200000.00,
        stok: 18,
        kategori: 'Motherboard',
        gambar_url: 'https://example.com/images/asus-rog-z790e.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'MSI MAG B650 Tomahawk WiFi',
        deskripsi: 'Motherboard AMD B650 dengan WiFi 6 dan PCIe 5.0',
        harga: 3200000.00,
        stok: 22,
        kategori: 'Motherboard',
        gambar_url: 'https://example.com/images/msi-mag-b650-tomahawk.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'Corsair RM850x 850W 80+ Gold',
        deskripsi: 'Power Supply Unit 850W modular dengan sertifikasi 80+ Gold',
        harga: 2100000.00,
        stok: 30,
        kategori: 'Power Supply',
        gambar_url: 'https://example.com/images/corsair-rm850x.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama_item: 'NZXT Kraken X73 360mm AIO',
        deskripsi: 'All-in-One liquid cooler dengan radiator 360mm',
        harga: 3500000.00,
        stok: 15,
        kategori: 'Cooling',
        gambar_url: 'https://example.com/images/nzxt-kraken-x73.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
