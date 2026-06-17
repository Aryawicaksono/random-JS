const rl = require('readline-sync');

/**
 * ============================================================================
 * MODEL COMPONENT
 * ============================================================================
 * Mengelola data mentah aplikasi, logika perhitungan internal game, 
 * bank data kata (kamus tema), serta rekam jejak tebakan salah pemain.
 */
function HangedManModel({maxLives, themeBank}){
  // Menyimpan batas maksimal nyawa/kesempatan salah dalam game
  this._maxLives = maxLives;
  
  // Kamus utama yang menampung daftar tema, kata target, dan hint terkait
  this._themesBank = themeBank || {
    "animals": [
      { "word": "CAT", "hint": "A small furry pet that loves to meow." },
      { "word": "DOG", "hint": "A loyal pet that barks and wags its tail." },
      { "word": "FISH", "hint": "An animal that swims underwater." }
    ],
    "fruits": [
      { "word": "APPLE", "hint": "A round, crunchy fruit that can be red or green." },
      { "word": "BANANA", "hint": "A long, sweet fruit that is yellow when ripe." },
      { "word": "MELON", "hint": "A large, round, juicy fruit with sweet flesh." }
    ],
    "colors": [
      { "word": "RED", "hint": "The color of a strawberry or a fire truck." },
      { "word": "BLUE", "hint": "The color of the sky on a clear day." },
      { "word": "GREEN", "hint": "The natural color of fresh grass and leaves." }
    ]
  };
  
  // Array untuk mencatat semua daftar huruf salah yang telah diinput pemain
  this._wrongChars = [];

  /**
   * Mengambil jumlah maksimal nyawa yang dikonfigurasi.
   * @returns {number} Batas kesalahan pemain.
   */
  this.getMaxLives = function() {
    return this._maxLives;
  };

  /**
   * Mengambil kumpulan karakter tebakan salah yang sudah diisi.
   * @returns {string[]} Array huruf-huruf salah.
   */
  this.getWrongChars = function(){
    return this._wrongChars;
  };

  /**
   * Mengambil array visual nyawa (jika diimplementasikan kelak).
   */
  this.getLiveArray = function(){
    return this._LivesArray;
  };

  /**
   * Mengambil data bank tema (kamus kata).
   * @returns {Object} Kumpulan objek tema game.
   */
  this.getThemesBank = function(){
    return this._themesBank;
  };

  /**
   * Memvalidasi apakah string nama tema yang diinput pemain terdaftar di bank tema.
   * @param {string} theme - Nama tema yang diperiksa.
   * @returns {boolean} True jika tema ditemukan.
   */
  this.isThemeValid = function (theme){
    return (theme in this._themesBank);
  };

  /**
   * Menghasilkan indeks angka acak berdasarkan panjang daftar kata pada suatu tema.
   * @param {string} theme - Nama tema target.
   * @returns {number} Indeks integer acak.
   */
  this.generateRandomKey = function(theme){
    return Math.floor(Math.random() * this.getThemesBank()[theme].length);
  };

  /**
   * Mengambil pasangan kata asli beserta petunjuknya menggunakan indeks pengunci.
   * @param {string} theme - Nama tema pilihan.
   * @param {number} key - Indeks pengunci kata yang diacak oleh Controller.
   * @returns {string[]} Array dengan format [kataAsli, hintKata].
   */
  this.getWordAndHint = function(theme, key){
    const targetTheme = this.getThemesBank()[theme];
    const word = targetTheme[key].word;
    const hint = targetTheme[key].hint;
    return [word, hint];
  };

  /**
   * Membuat struktur papan samaran (masking array) berisi karakter underscore.
   * @param {string} word - Kata asli untuk dihitung panjangnya.
   * @returns {string[]} Array baru berisi underscore (contoh: ['_', '_', '_']).
   */
  this.getHiddenWord = function(word){
    const hiddenChars = word.split('');
    return new Array(hiddenChars.length).fill('_');
  };

  /**
   * Logika Pengisian Karakter Benar (Pass by Reference)
   * Memindai kata asli menggunakan perulangan indeks for...in. Jika ada huruf yang cocok,
   * fungsi akan mengubah isi array hiddenWord milik Controller di alamat memori yang sama.
   * @param {string} word - Kata target asli saat ini.
   * @param {string[]} hiddenWord - Referensi array papan samaran aktif milik Controller.
   * @param {string} letter - Huruf tebakan benar yang dimasukkan pemain.
   */
  this.setCorrectLetter = function(word, hiddenWord, letter){
    for (const index in word){
      if (word[index] === letter){
        hiddenWord[index] = letter;
      }
    }
  };

  /**
   * Menyimpan huruf tebakan salah ke dalam memori internal array Model.
   * @param {string} letter - Huruf salah dari pemain.
   */
  this.setWrongLetter = function(letter){
    this.getWrongChars().push(letter);
  };
}

/**
 * ============================================================================
 * VIEW COMPONENT (VISUAL TERMINAL)
 * ============================================================================
 * Bertanggung jawab memformat layout teks, menggambar grafik ASCII art tiang hangman,
 * serta mencetak seluruh data permainan ke layar console terminal.
 */
function HangedManView({maxLives}){
  // Frame visual ASCII art tiang gantungan dari kondisi utuh hingga orang tergantung penuh
  this._hangedManArray = [
    [' +----+',' |    |', '      |', '      |', '      |', '      |','=========='].join('\n'), // 0: Kosong
    [' +----+',' |    |', ' o    |', '      |', '      |', '      |','=========='].join('\n'), // 1: Kepala
    [' +----+',' |    |', ' o    |', ' |    |', '      |', '      |','=========='].join('\n'), // 2: Badan
    [' +----+',' |    |', ' o    |', '/|    |', '      |', '      |','=========='].join('\n'), // 3: Tangan Kiri
    [' +----+',' |    |', ' o    |', '/|\\   |', '      |', '      |','=========='].join('\n'), // 4: Tangan Kanan
    [' +----+',' |    |', ' o    |', '/|\\   |', '/     |', '      |','=========='].join('\n'), // 5: Kaki Kiri
    [' +----+',' |    |', ' o    |', '/|\\   |', '/ \\   |', '      |','=========='].join('\n'), // 6: Kaki Kanan (Penuh)
  ];
  this._maxLives = maxLives;

  /**
   * Menggambar ASCII art tiang gantungan secara proporsional.
   * Menggunakan algoritma Skala Rasio Matematika untuk memetakan jumlah kesalahan ('chance')
   * terhadap batas nyawa dinamis ('maxLives') ke indeks frame gambar yang tersedia.
   */
  this.showHangedMan = function(chance, maxLives){
    const totalFrames = this._hangedManArray.length;
    const index = chance === 0 ? 0 : Math.floor((chance / maxLives) * (totalFrames - 1)); 
    console.log(this._hangedManArray[index]);
  };

  this.showTitle = function(){
    console.log('             WELCOME TO HANGEDMAN                 ');
  };

  this.showHiddenWord = function(hiddenWord){
    console.log(`WORD: ${hiddenWord.join(' ')}`);
  };

  this.showHint = function(hint){
    console.log(`HINT: ${hint}`);
  };

  this.showLives = function(chances, maxLives){
    console.log(`CHANCES: ${chances}/${maxLives}`);
  };

  this.showWrongChar = function(charArray){
    console.log(`WRONG LETTER: [ ${charArray.join(', ')} ]`);
  };

  this.showDoubleSeparator = function(){
    console.log('==================================================');
  };  

  this.showSeparator = function(){
    console.log('------------------------------------------------');
  };

  this.displayHeader = function(){
    this.showDoubleSeparator();
    this.showTitle();
    this.showDoubleSeparator();
    console.log('');
  };

  /**
   * Menggabungkan seluruh fungsi visual individu menjadi satu kesatuan antarmuka game.
   */
  this.displayGame = function(chance, maxLives, hint, hiddenWord, charArray){
    this.showHangedMan(chance, maxLives);
    console.log('');
    this.showHiddenWord(hiddenWord);
    console.log('');
    this.showHint(hint);
    this.showSeparator();
    this.showLives(chance, maxLives);
    this.showWrongChar(charArray);
    this.showDoubleSeparator();
  };
}

/**
 * ============================================================================
 * PROMPT VIEW COMPONENT (INPUT INTERACTION)
 * ============================================================================
 * Mengurus segala interaksi pengetikan input pengguna melalui readline-sync
 * serta menyajikan teks feedback berupa notifikasi validasi dan pesan akhir game.
 */
function PromptView(){
  /**
   * Meminta input string nama tema dari user.
   */
  this.themeInput = function(themeBank){
    const themes = [];
    for (const key in themeBank){
      themes.push(key);
    }
    return rl.question(`Enter themes (${themes.join(', ')}): `).toLowerCase();
  };

  /**
   * Meminta input satu huruf tebakan, otomatis dibersihkan dan dijadikan huruf besar.
   */
  this.charInput = function(){
    return rl.question('Enter your guess letter: ').trim().toUpperCase();
  };

  this.invalidThemeInput = function(){
    console.log('Please input the correct theme!');
  };

  this.invalidCharInput = function(){
    console.log('This is not a character! Please try again.');
  };

  this.repeatedCharInput = function(){
    console.log('This character already used! Please try again');
  };

  this.showPlayerWon = function(){
    console.log('CONGRATULATIONS! You have guessed perfectly');
  };

  this.showPlayerLose = function(word){
    console.log(`GAME OVER! the correct word is "${word}".`);
  };
}

/**
 * ============================================================================
 * CONTROLLER COMPONENT (GAME ENGINE)
 * ============================================================================
 * Bertindak sebagai otak permainan. Menghubungkan Model dan View, mengontrol
 * jalannya loop permainan, serta memvalidasi alur sebelum data diolah/ditampilkan.
 */
function HangedManController(config){
  // Mengonfigurasi parameter awal controller sesuai masukan konfigurasi objek instansiasi
  this._maxLives = config.maxLives;
  this._themesBank = config.themeBank;
  
  // Instansiasi seluruh komponen pendukung MVC internal game
  this._Model = new HangedManModel({maxLives: this._maxLives, themeBank: this._themesBank});
  this._View = new HangedManView({maxLives: this._maxLives});
  this._PromptView = new PromptView();

  this.getModel = function(){
    return this._Model;
  };

  this.getView = function(){
    return this._View;
  };

  this.getPromptView = function(){
    return this._PromptView;
  };

  /**
   * Mengecek kemenangan: Jika tidak ada lagi karakter underscore '_' tersisa di papan, pemain menang.
   * @param {string[]} hiddenWord - Array progres tebakan pemain saat ini.
   * @returns {boolean} True jika semua huruf berhasil ditebak.
   */
  this.isPlayerWon = function(hiddenWord){
    return hiddenWord.every(char => char !== '_');
  };

  /**
   * Mengecek kekalahan: Jika angka kesalahan (chance) menyentuh batas nyawa dinamis, pemain kalah.
   * @param {number} chance - Jumlah kesalahan saat ini.
   * @returns {boolean} True jika kesempatan habis.
   */
  this.isPlayerLose = function(chance){
    return chance === this._maxLives;
  };

  /**
   * Perulangan validasi input tema. Mengunci layar sampai user memasukkan nama tema yang valid.
   * @returns {string} Nama tema yang valid dan bersih.
   */
  this.validateThemeInput = function(){
    const themes = this.getModel().getThemesBank();
    while (true){
      const theme = this.getPromptView().themeInput(themes);
      if (!this.getModel().isThemeValid(theme)){
        this.getPromptView().invalidThemeInput();
        console.log('');
        continue;
      }
      return theme;
    }
  };

  /**
   * Perulangan validasi tebakan karakter. Menyaring input agar wajib berupa 1 huruf
   * dan mendeteksi apakah karakter tersebut sudah pernah dipakai (baik di array benar maupun salah).
   * @param {string[]} hiddenWords - Array progres tebakan benar aktif.
   * @param {string[]} wrongChars - Array rekam jejak tebakan salah aktif.
   * @returns {string} Satu karakter huruf baru yang valid.
   */
  this.validateCharInput = function(hiddenWords, wrongChars){
    while(true){
      const charInput = this.getPromptView().charInput();
      
      // Saringan 1: Wajib berupa satu karakter tunggal
      if (charInput.length !== 1){
        this.getPromptView().invalidCharInput();
        continue;
      }
      
      // Saringan 2: Deteksi duplikasi input (mencegah spam tebakan berulang)
      if (hiddenWords.includes(charInput) || wrongChars.includes(charInput)){
        this.getPromptView().repeatedCharInput();
        continue;
      }
      
      return charInput;
    }
  };

  /**
   * Alur Utama (Core Loop) Permainan Hanged Man.
   * Mengatur inisialisasi awal permainan, siklus hidup looping input tebakan, 
   * pembaruan layar, hingga eksekusi akhir penentuan menang atau kalah.
   */
  this.initializeGame = function(){
    // Langkah 1: Tahap penentuan tema dan pemilihan kata target acak secara terkunci (State-locked)
    const theme = this.validateThemeInput();
    const key = this.getModel().generateRandomKey(theme);

    console.log('');

    // Mengambil kata dasar dan petunjuk, lalu memproduksi papan samaran awal di level Controller
    const [word, hint] = this.getModel().getWordAndHint(theme, key);
    const hiddenWord = this.getModel().getHiddenWord(word);
    let chance = 0; // Penghitung angka kesalahan (nyawa terpakai)
    
    // Langkah 2: Siklus Loop Utama Game (Gameplay Core Loop)
    while (true){
      const maxLive = this._maxLives;
      const wrongChars = this.getModel().getWrongChars();
      
      // Menggambar kondisi visual game terkini sebelum meminta input tebakan baru
      this.getView().displayHeader();
      this.getView().displayGame(chance, maxLive, hint, hiddenWord, wrongChars);
      
      // Meminta input huruf yang dijamin valid dari penyaringan internal Controller
      const charInput = this.validateCharInput(hiddenWord, wrongChars);
      
      // Percabangan Logika Game: Memeriksa akurasi huruf tebakan terhadap kata target
      if (word.includes(charInput)) {
        // Jika BENAR: Mengubah isi elemen array hiddenWord secara langsung (Pass by Reference)
        this.getModel().setCorrectLetter(word, hiddenWord, charInput);
      } else {
        // Jika SALAH: Menyimpan huruf salah ke dalam Model dan meningkatkan poin kesalahan
        this.getModel().setWrongLetter(charInput);
        chance++;
      }
      
      // Evaluasi Kondisi Berhenti (Exit Condition): Keluar dari loop jika kondisi akhir tercapai
      if (this.isPlayerWon(hiddenWord) || this.isPlayerLose(chance)){
        // Mencetak status visual penutup yang selaras dengan data akhir sesaat sebelum loop patah
        this.getView().displayHeader();
        this.getView().displayGame(chance, maxLive, hint, hiddenWord, wrongChars);
        break;
      }
    }
    
    // Langkah 3: Cetakan Terakhir Layar & Tampilan Pesan Hasil Akhir (Game Over/Win)
    this.getView().displayHeader();
    this.getView().displayGame(chance, this._maxLives, hint, hiddenWord, this.getModel().getWrongChars());
    console.log('');
    
    // Memberikan output konklusi akhir kepada pemain berdasarkan evaluasi status ter-update
    if (this.isPlayerWon(hiddenWord)){
      this.getPromptView().showPlayerWon();
    } else if (this.isPlayerLose(chance)){
      this.getPromptView().showPlayerLose(word);
    }
  };
}
// ThemeBank yang baru untuk mengecek apakah ovveride default theme bank.
const customThemeBank = {
  "science": [
    {
      "word": "ATOM",
      "hint": "The basic building block of all matter."
    },
    {
      "word": "CELL",
      "hint": "The smallest structural and functional unit of an organism."
    },
    {
      "word": "GRAVITY",
      "hint": "The invisible force that pulls objects toward each other."
    }
  ],
  "tech": [
    {
      "word": "COGNITIVE",
      "hint": "A type of computing that simulates human thought processes."
    },
    {
      "word": "CLOUD",
      "hint": "On-demand availability of computer system resources over the internet."
    },
    {
      "word": "ROBOT",
      "hint": "A machine capable of carrying out a complex series of actions automatically."
    }
  ],
  "history": [
    {
      "word": "ROMA",
      "hint": "An ancient empire known for its emperors, gladiators, and colosseum."
    },
    {
      "word": "MUMMY",
      "hint": "A dead body preserved using an ancient Egyptian embalming method."
    },
    {
      "word": "WAR",
      "hint": "A state of armed conflict between different nations or states."
    }
  ]
};
/**
 * ============================================================================
 * APPLICATION EXECUTION ENTRY POINT
 * ============================================================================
 * Melakukan konfigurasi instansiasi awal permainan dengan maxLives dinamis (X nyawa).
 */
const controller = new HangedManController({
  maxLives: 4, 
  themeBank: customThemeBank,
});
controller.initializeGame();