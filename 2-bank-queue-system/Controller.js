const BankQueueModel = require('./Model');
const BankQueueView = require('./View');

/**
 * @description Objek Enum untuk memetakan opsi menu yang memiliki posisi statis/pasti.
 * Properti `EXIT` akan ditambahkan secara dinamis ke dalam objek ini saat aplikasi berjalan.
 * @enum {number}
 */
const Menu ={
  /** Menu untuk mengambil tiket antrean nasabah baru */
  TAKE_TICKET: 1,
};

/**
 * @class BankQueueController
 * @description Komponen Controller dalam arsitektur MVC. Berfungsi sebagai otak sistem (engine)
 * yang mengatur alur eksekusi, memvalidasi input, serta menjembatani interaksi 
 * antara komponen data (Model) dan komponen visual terminal (View).
 */
class BankQueueController{
  /**
   * @constructor
   * @param {number} totalTellers - Jumlah meja teller aktif yang akan dibuka di dalam sistem.
   */
  constructor(totalTellers){
    /**
     * Instansiasi komponen BankQueueModel.
     * @type {BankQueueModel}
     * @private
     */
    this._model = new BankQueueModel(totalTellers);

    /**
     * Instansiasi komponen BankQueueView.
     * @type {BankQueueView}
     * @private
     */
    this._view = new BankQueueView(totalTellers);

    /**
     * Menyimpan informasi kapasitas meja teller aktif untuk kebutuhan kalkulasi logika dinamis.
     * @type {number}
     * @private
     */
    this._totalTellers = totalTellers;
  }

  /**
   * @method getModel
   * @description Mengambil referensi dari objek BankQueueModel yang sedang dikelola.
   * @returns {BankQueueModel} Instansiasi objek data Model.
   */
  getModel(){
    return this._model;
  }

  /**
   * @method getView
   * @description Mengambil referensi dari objek BankQueueView yang sedang dikelola.
   * @returns {BankQueueView} Instansiasi objek visual View.
   */
  getView(){
    return this._view;
  }

  /**
   * @method isValidChoice
   * @description Melakukan validasi terhadap angka pilihan menu yang diinput oleh pengguna.
   * Menyaring input agar tidak berupa huruf (NaN) atau angka di luar rentang menu yang tersedia.
   * @param {number} choice - Angka pilihan menu hasil tangkapan terminal dari pengguna.
   * @returns {boolean} `true` jika pilihan masuk dalam rentang menu sah, atau `false` jika ilegal.
   */
  isValidChoice(choice){
    const exitOptions = this._totalTellers + 2;

    if (isNaN(choice)){
      return false; 
    }
    if (choice < 1 || choice > exitOptions){
      return false;
    }
    return true;
  }

  /**
   * @method initializeApp
   * @description Menjalankan dan mengontrol siklus hidup utama (Life Cycle) aplikasi antrean bank.
   * Mengelola loop menu, melakukan penguncian input yang salah (loop lock via while-true), 
   * serta memproses pembagian data nasabah ke meja teller berdasarkan kalkulasi menu dinamis.
   */
  initializeApp(){
    const statusTellers = this.getModel().generateTellerStatus();
    const exitOptions = this._totalTellers + 2;

    // Menyuntikkan nilai batas opsi menu keluar secara dinamis ke dalam Enum Menu
    Menu.EXIT = exitOptions;

    let choice;
    do{
      const persons = this.getModel().getQueue();
      
      this.getView().displayDashBoard(statusTellers, persons);
      this.getView().displayMenu();

      // Loop Lock: Mengunci pengguna agar tetap berada di prompt input jika memasukkan pilihan yang salah
      while(true){
        choice = this.getView().displayChoice();
        if (!this.isValidChoice(choice)){
          this.getView().displayError(`Enter the correct input(1 -${exitOptions})!`);
          continue; // Kembali memicu prompt input tanpa merender ulang papan dashboard atas
        }
        break; // Keluar dari loop lock setelah mendapatkan input yang valid
      }

      // Memproses aksi berdasarkan pilihan menu yang telah lolos validasi
      switch(choice){
        case Menu.TAKE_TICKET:
          const nameInput = this.getView().readPatientName();
          this.getModel().setQueue(nameInput);

          const lastPerson = persons[persons.length - 1];
          this.getView().displaySucess(`Ticket ${lastPerson.ticket} issued for ${lastPerson.name}`);
          this.getView().displayWait();
          break;
          
        case Menu.EXIT:
          // Pembendungan khusus pilihan EXIT agar tidak merembes masuk ke dalam blok default
          break;
          
        default:
          // Perhitungan nomor teller secara otomatis (Pilihan Menu dikurangi 1)
          const tellerNumber = choice - 1;

          if (this.getModel().isQueueEmpty()){
            this.getView().displayError('Waiting room is empty!');
          } else {
            const nextPatient = persons[0]; // Intip nasabah di barisan terdepan (FIFO)
            this.getModel().calledByTeller(); // Potong elemen indeks pertama (.shift()) di Model
            statusTellers[tellerNumber] = nextPatient; // Perbarui data nasabah pada meja teller terkait

            this.getView().displaySucess(`Teller ${tellerNumber} is now serving ${nextPatient.ticket} (${nextPatient.name})`);
          }
          this.getView().displayWait();
          break;
      }

    } while( choice !== Menu.EXIT);

    this.getView().displaySucess("Thank you! Exiting system...");
  }
}

module.exports = BankQueueController;