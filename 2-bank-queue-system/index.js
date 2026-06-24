const BankQueueController = require('./Controller');

/**
 * @constant {number} TOTAL_TELLERS
 * @description Menentukan jumlah kapasitas operasional meja teller aktif di dalam bank.
 * Nilai ini bersifat dinamis; Anda dapat menggantinya menjadi angka berapa pun (misal: 3, 5, 10)
 * dan seluruh sistem menu serta dashboard akan otomatis menyesuaikan diri.
 */
const TOTAL_TELLERS = 2

/**
 * @constant {BankQueueController} controller
 * @description Instansiasi arsitektur utama aplikasi dengan menyuntikkan jumlah teller aktif ke dalam Controller.
 */
const controller = new BankQueueController(TOTAL_TELLERS);

/**
 * @description Menyalakan mesin sistem antrean bank (Bank Queue Management System).
 * Fungsi ini memicu alur kerja program dimulai dari tampilan dashboard live perdana di terminal.
 */
controller.initializeApp()