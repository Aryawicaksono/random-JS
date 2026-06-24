/**
 * @class BankQueueModel
 * @description Komponen Model dalam arsitektur MVC yang berfungsi untuk mengelola 
 * seluruh data antrean nasabah (Waiting Room) serta melacak status operasional meja Teller.
 */
class BankQueueModel{
  /**
   * @constructor
   * @param {number} totalTellers - Jumlah meja teller aktif yang akan dibuka di dalam sistem.
   */
  constructor(totalTellers){
    /**
     * Ruang tunggu utama tempat menampung antrean nasabah menggunakan konsep FIFO (First In First Out).
     * @type {Array<Object>}
     * @private
     */
    this._queue = [];

    /**
     * Menyimpan total kapasitas meja teller yang aktif.
     * @type {number}
     * @private
     */
    this._totaltellers = totalTellers;

    /**
     * Nomor urut tiket otomatis yang akan terus meningkat dimulai dari angka 1.
     * @type {number}
     * @private
     */
    this._ticketNumber = 1;

    /**
     * Objek Key-Value untuk memetakan nasabah yang sedang dilayani di setiap meja teller.
     * @type {Object}
     * @private
     */
    this._tellerStatus = {}
  }

  /**
   * @method getTotalTellers
   * @description Mengambil informasi jumlah total teller yang terdaftar di dalam sistem.
   * @returns {number} Jumlah total meja teller.
   */
  getTotalTellers(){
    return this._totaltellers;
  }

  /**
   * @method generateTellerStatus
   * @description Membangun struktur awal objek status teller secara dinamis.
   * Semua meja teller diinisialisasi dengan nilai `null` (artinya sedang kosong/idle).
   * @returns {Object} Objek referensi `_tellerStatus` yang sudah berhasil dipetakan.
   */
  generateTellerStatus(){
    for (let i = 1; i <= this.getTotalTellers(); i++){
      this._tellerStatus[i] = null;
    }
    return this._tellerStatus;
  }

  /**
   * @method getQueue
   * @description Mengambil seluruh daftar antrean nasabah yang saat ini berada di ruang tunggu.
   * @returns {Array<Object>} Array berisi objek nasabah yang masih mengantre.
   */
  getQueue(){
    return this._queue;
  }

  /**
   * @method setQueue
   * @description Membuat tiket baru, membungkus data nasabah ke dalam objek, 
   * lalu memasukkannya ke dalam barisan antrean paling belakang.
   * @param {string} name - Nama nasabah yang mengambil tiket antrean.
   * @returns {Object} Objek data nasabah yang baru saja dibuat `{ ticket, name }`.
   */
  setQueue(name){
    const person = {ticket: `A-${this._ticketNumber}`, name: name};
    this._queue.push(person);
    this._ticketNumber++;
    return person;
  }

  /**
   * @method calledByTeller
   * @description Memanggil dan mengeluarkan nasabah yang berada di barisan paling depan (Indeks 0).
   * @returns {Object|undefined} Objek nasabah yang dipanggil, atau `undefined` jika antrean kosong.
   */
  calledByTeller(){
    return this._queue.shift();
  }

  /**
   * @method checkIdPerson
   * @description Mencari posisi indeks nasabah di dalam array antrean berdasarkan kode tiketnya.
   * @param {string} ticket - Kode unik tiket nasabah (misal: 'A-1').
   * @returns {number} Posisi indeks nasabah (0 hingga n-1), atau `-1` jika tidak ditemukan.
   */
  checkIdPerson(ticket){
    return this._queue.findIndex(person => person.ticket === ticket);
  }

  /**
   * @method abortQueue
   * @description Menghapus/mengeluarkan nasabah dari ruang tunggu berdasarkan posisi indeksnya.
   * @param {number} id - Posisi indeks nasabah di dalam array `_queue`.
   */
  abortQueue(id){
    this._queue.splice(id, 1);
  }

  /**
   * @method isQueueEmpty
   * @description Memeriksa apakah ruang tunggu saat ini sedang kosong tanpa ada antrean nasabah.
   * @returns {boolean} `true` jika antrean kosong, atau `false` jika masih ada nasabah mengantre.
   */
  isQueueEmpty(){
    return this.getQueue().length === 0;
  }
}

module.exports = BankQueueModel;