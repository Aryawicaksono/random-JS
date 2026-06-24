const readline = require('readline-sync');

/**
 * @class BankQueueView
 * @description Komponen View dalam arsitektur MVC yang bertanggung jawab penuh atas 
 * representasi visual di terminal (CLI), pencetakan menu dinamis, serta penangkapan input pengguna.
 */
class BankQueueView{
  /**
   * @constructor
   * @param {number} totalTellers - Jumlah meja teller aktif untuk menghitung batasan opsi visual menu.
   */
  constructor(totalTellers){
    /**
     * Menyimpan informasi jumlah total teller untuk keperluan kalkulasi visual menu dinamis.
     * @type {number}
     * @private
     */
    this._totalTellers = totalTellers;
  }

  /**
   * @method displayDashBoard
   * @description Menggambar papan informasi utama (Dashboard) ke layar terminal.
   * Menampilkan status live dari setiap meja teller dan daftar antrean di ruang tunggu.
   * @param {Object} objectTellers - Data status seluruh teller (Key-Value pasangan nomor teller dan objek nasabah).
   * @param {Array<Object>} arrayQueue - Array berisi kumpulan objek nasabah yang sedang mengantre di ruang tunggu.
   */
  displayDashBoard(objectTellers, arrayQueue){
    console.log('====================================');
    console.log('        BANK QUEUE DASHBOARD        ');
    console.log('====================================');
    for (const key in objectTellers){
      const currentService = objectTellers[key];
      const result = currentService === null
        ? 'NONE'
        : `${currentService.ticket} (${currentService.name})`
      console.log(`[ TELLER ${key} ] Serving: ${result}`);
    }
    console.log('------------------------------------');
    const persons = arrayQueue.map(person => `${person.ticket} (${person.name})`).join(', ');

    const waitingList = arrayQueue.length === 0 
      ? 'Empty (0 people waiting)'
      : persons;

    console.log(`Waiting Room: ${waitingList}`);
    console.log('====================================');
  }

  /**
   * @method displayMenu
   * @description Mencetak daftar pilihan menu utama ke terminal. 
   * Jumlah opsi pilihan "Teller Call Next" otomatis menyesuaikan kapasitas properti `_totalTellers`.
   */
  displayMenu(){
    console.log('\n1. Take Queue Ticket');
    for (let i = 1; i <= this._totalTellers; i++){
      console.log(`${i + 1}. Teller ${i} Call Next`)
    }
    console.log(`${this._totalTellers + 2}. EXIT`);
    console.log('------------------------------------');
  }

  /**
   * @method displayChoice
   * @description Menampilkan prompt interaktif untuk menangkap angka pilihan menu dari pengguna.
   * @returns {number} Hasil input pengguna yang dikonversi langsung menjadi tipe data Angka (Number).
   */
  displayChoice(){
    return Number(readline.question(`Enter your choice (1-${this._totalTellers + 2}): `));
  }

  /**
   * @method readPatientName
   * @description Menampilkan prompt interaktif untuk menangkap input string nama nasabah baru.
   * Hasil tangkapan string otomatis diubah menjadi format huruf besar (Uppercase).
   * @returns {string} String nama nasabah dalam format huruf kapital.
   */
  readPatientName(){
    return readline.question('Enter your name: ').toUpperCase();
  }

  /**
   * @method displaySucess
   * @description Mencetak blok pesan pemberitahuan sukses dengan aksen visual uniform ke terminal.
   * @param {string} message - Teks pesan keberhasilan yang ingin disampaikan kepada pengguna.
   */
  displaySucess(message){
    console.log(`\n=== SUCCESS: ${message} ===`);
  }

  /**
   * @method displayError
   * @description Mencetak blok pesan pemberitahuan kesalahan/gagal dengan aksen visual uniform ke terminal.
   * @param {string} message - Teks pesan kesalahan atau peringatan kegagalan sistem.
   */
  displayError(message){
        console.log(`\n=== ERROR: ${message} ===`);
  }

  /**
   * @method displayWait
   * @description Menahan alur eksekusi aplikasi di terminal hingga pengguna menekan tombol [ENTER].
   * Berfungsi mengamankan visibilitas teks konfirmasi agar tidak langsung terhapus oleh loop berikutnya.
   */
  displayWait(){
    readline.question('Press [ENTER] to continue... ')
  }
}

module.exports = BankQueueView;