const readline = require('readline-sync');

// ====================================================================
// 1. FUNGSI DISPLAY & MODULAR GAME
// ====================================================================

/**
 * Menampilkan papan permainan, status kata, dan daftar kesalahan di terminal.
 */
function display(stages, hiddenWord, clue, guessedLetters, theme, wrongCount){
  console.log('\n\n===========================================');
  console.log(`KATEGORI: ${theme}`);
  console.log('===========================================\n');

  // Mencetak gambar tiang gantung sesuai jumlah kesalahan saat ini
  console.log(stages[wrongCount]);
  console.log('');

  console.log(`Clue: ${clue}`);
  console.log(`Word: ${hiddenWord.join(' ')}`);
  console.log(`Wrong Letters: [ ${guessedLetters.join(',')} ]`);
  console.log('-------------------------------------------');
}

/**
 * Mengambil satu objek kata secara acak berdasarkan kategori yang dipilih.
 */
function randomWord(themesBank, selectedTheme){
  const targetTheme = themesBank.find(theme => theme.themeName === selectedTheme);
  const targetWords = targetTheme.words;
  const randomIndex = Math.floor(Math.random() * targetWords.length);

  return targetWords[randomIndex]; // Mengembalikan objek { word: ..., clue: ... }
}

/**
 * Membuat array berisi garis bawah '_' sepanjang huruf kata rahasia.
 */
function hiddenWord(word){
  const letters = word.split('');
  return Array(letters.length).fill('_');
}

/**
 * Menangani input menu tema dan memastikan angka yang dimasukkan valid (1, 2, atau 3).
 */
function themeValidator(themeMenu){
  while(true){
    const themeInput = readline.question('Pilih salah satu tema: (TEKNOLOGI: 1, HEWAN: 2, GEOGRAFI: 3): ');

    // Validasi jika input kosong
    if (themeInput === ''){
      console.log('Masukkan tema yang dipilih.');
      continue;
    }

    const themeNumber = +themeInput;

    // Validasi jika angka yang dimasukkan salah
    if (themeNumber !== 1 && themeNumber !== 2 && themeNumber !== 3){
      console.log('Pilih tema yang telah disediakan');
      continue;
    }

    // Menerjemahkan angka menjadi teks nama kategori
    let theme;
    for (const key in themeMenu){
      if (themeMenu[key] === themeNumber){
        theme = key;
        break;
      }
    }
    return theme; // Mengembalikan string nama tema (misal: 'HEWAN')
  }
}

/**
 * Menangani input huruf tebakan pemain dan mencegah input kosong/duplikat.
 */
function letterValidator(progress, guessedLetters){
  while (true) {
      const guessedLetter = readline.question('Masukkan huruf tebakan Anda: ').toUpperCase();

      // Validasi wajib diisi dan hanya boleh 1 huruf
      if (guessedLetter.trim() === '' || guessedLetter.length !== 1){
        console.log('Masukkan tepat satu huruf');
        continue;
      }
      
      // Validasi mencegah menebak huruf yang sama berulang kali
      if (progress.includes(guessedLetter) || guessedLetters.includes(guessedLetter)){
        console.log('Huruf sudah pernah ditebak. Silakan coba lagi');
        continue;
      }
      return guessedLetter; // Mengembalikan huruf yang valid
  }
}

/**
 * Mengecek apakah pemain sudah menang (tidak ada lagi '_' di papan).
 */
function checkWin(progress){
  return !progress.includes('_');
}

/**
 * Mengecek apakah pemain sudah kalah (kesalahan mencapai batas gambar maksimal).
 */
function checkLose(wrongCount){
  return wrongCount === 5;
}

// ====================================================================
// 2. DATA UTAMA GAME (BANK KATA & ASCII ART)
// ====================================================================

const themesBank = [
  {
    themeName: "TEKNOLOGI",
    words: [
      { word: "GAWAI", clue: "Perangkat elektronik atau ponsel pintar yang kita gunakan sehari-hari." },
      { word: "INTERNET", clue: "Jaringan global yang menghubungkan seluruh komputer dan hp di dunia." },
      { word: "NIRKABEL", clue: "Teknologi tanpa kabel untuk mengirim data atau menyambungkan perangkat elektronik." },
      { word: "TELEVISI", clue: "Media elektronik yang digunakan untuk menonton berita, film, atau Youtube di rumah." },
      { word: "KOMPUTER", clue: "Perangkat elektronik pintar untuk bekerja, mengolah data, atau belajar." }
    ]
  },
  {
    themeName: "HEWAN",
    words: [
      { word: "LUMBALUMBA", clue: "Mamalia laut yang sangat cerdas dan bernapas dengan paru-paru." },
      { word: "BUNGLON", clue: "Reptil yang bisa mengubah warna kulitnya untuk berkamuflase." },
      { word: "CITAH", clue: "Hewan darat tercepat di dunia dalam berlari jarak pendek." },
      { word: "PINGUIN", clue: "Burung laut yang tidak bisa terbang, tetapi sangat ahli berenang." },
      { word: "KANGURU", clue: "Hewan berkantung khas Australia yang bergerak dengan cara melompat." }
    ]
  },
  {
    themeName: "MAKANAN",
    words: [
      { word: "RENDANG", clue: "Makanan khas Minangkabau dari daging dan kaya rempah." },
      { word: "ESKRIM", clue: "Camilan beku berbahan dasar susu yang rasanya manis dan lembut." },
      { word: "MARTABAK", clue: "Camilan malam populer yang punya versi manis dan telur." },
      { word: "BAKSO", clue: "Makanan berbentuk bulat dari daging giling yang disajikan dengan kuah kaldu hangat." },
      { word: "KROASAN", clue: "Kue pastri asal Prancis berbentuk bulan sabit yang berlapis-lapis." }
    ]
  },
  {
    themeName: "GEOGRAFI",
    words: [
      { word: "INDONESIA", clue: "Negara kepulauan terbesar di dunia yang dilintasi garis khatulistiwa." },
      { word: "PEGUNUNGAN", clue: "Kumpulan atau barisan gunung yang membentang luas di suatu wilayah." },
      { word: "GURUN", clue: "Padang luas yang sangat kering dan didominasi oleh pasir atau batuan." },
      { word: "SAMUDRA", clue: "Lautan yang sangat luas dan memisahkan benua-benua di bumi." },
      { word: "JEPANG", clue: "Negara Asia Timur yang dikenal dengan julukan Negeri Matahari Terbit." }
    ]
  }
];

const stages = [
  '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========', // 0 Kesalahan
  '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========', // 1 Kesalahan (Kepala)
  '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========', // 2 Kesalahan (Badan)
  '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========', // 3 Kesalahan (Tangan Kiri)
  '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========', // 4 Kesalahan (Tangan Kanan)
  '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========', // 5 Kesalahan (Kaki Lengkap / Kalah)
];

const themeMenu = {
  TEKNOLOGI: 1,
  HEWAN: 2,
  GEOGRAFI: 3
};

// ====================================================================
// 3. ALUR UTAMA GAME (GAME LOOP ENGINE)
// ====================================================================

while (true) {
  // Reset data permainan setiap ronde baru dimulai
  let wrongCount = 0;
  let guessedLetters = [];
  let isWin = false;
  let isLose = false;

  // Dapatkan nama kategori yang valid lewat fungsi validator
  const theme = themeValidator(themeMenu);
  console.log('');

  // Cari kata rahasia dan siapkan papan sensor garis bawah
  const selectedData = randomWord(themesBank, theme);
  const secretWord = selectedData.word;
  const clue = selectedData.clue;
  let progress = hiddenWord(secretWord);

  // Perulangan proses tebak huruf per satu kata
  do {
    display(stages, progress, clue, guessedLetters, theme, wrongCount);

    // Ambil huruf tebakan yang sudah tervalidasi bersih
    const currentGuess = letterValidator(progress, guessedLetters);

    // Proses pengecekan huruf ke kata rahasia
    if (secretWord.includes(currentGuess)){
      for (let i = 0; i < secretWord.length; i++){
        if (secretWord[i] === currentGuess){
          progress[i] = currentGuess; // Membuka sensor '_' jika benar
        }
      }
      console.log('Tebakan Anda BENAR!');
    } else {
      guessedLetters.push(currentGuess); // Masuk daftar huruf salah jika keliru
      wrongCount++;
      console.log('Tebakan Anda SALAH!');
    }

    // Pantau status menang atau kalah di akhir giliran
    isWin = checkWin(progress);
    isLose = checkLose(wrongCount);

  } while (!isWin && !isLose); // Loop do-while patah jika isWin atau isLose bernilai true
  
  // Tampilkan kondisi papan terakhir sesaat setelah game berakhir
  display(stages, progress, clue, guessedLetters, theme, wrongCount);
  console.log('');
  
  // Berikan pengumuman hasil akhir ronde
  if (isWin){
    console.log('Selamat! Anda berhasil menebak kata dengan benar. 🎉');
  } else {
    console.log(`GAME OVER! Anda kalah, kata yang benar adalah: ${secretWord} 😢`);
  }

  // Menahan layar terminal agar tidak langsung ter-reset otomatis sebelum dibaca pemain
  readline.question('\nTekan [ENTER] untuk melanjutkan ke ronde berikutnya...');
}