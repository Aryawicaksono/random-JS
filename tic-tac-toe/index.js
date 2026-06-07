/**
 * SISTEM GAME TIC-TAC-TOE (BERBASIS CLI)
 * Aturan Main:
 * - Menggunakan papan matriks 2D berukuran 3x3.
 * - Giliran dinamis antara pemain 'X' dan 'O'.
 * - Validasi input ketat untuk koordinat indeks 0, 1, atau 2.
 */

const readline = require('readline-sync');

/**
 * Memformat isi sel untuk visualisasi papan.
 * Mengubah string kosong menjadi karakter spasi agar tabel tidak bergeser.
 * @param {string} board - Karakter di sel ('X', 'O', atau '')
 * @returns {string} Karakter siap cetak
 */
function format(board){
  if(board){
    return board;
  }
  return ' ';
}

/**
 * Mencetak struktur visual papan permainan ke layar terminal.
 * @param {Array<Array<string>>} board - Matriks papan permainan
 */
function displayBoard(board){
  console.log(`=================
|| ${format(board[0][0])} || ${format(board[0][1])} || ${format(board[0][2])} ||
=================
|| ${format(board[1][0])} || ${format(board[1][1])} || ${format(board[1][2])} ||
=================
|| ${format(board[2][0])} || ${format(board[2][1])} || ${format(board[2][2])} ||
=================`)
}

/**
 * Melakukan validasi input angka indeks (0, 1, atau 2).
 * Memiliki proteksi berlapis terhadap input kosong, spasi, dan karakter non-indeks.
 * @param {string} cell - Jenis koordinat ('row' atau 'column')
 * @param {string} player - Simbol pemain aktif ('X' atau 'O')
 * @returns {number} Angka indeks yang sudah valid
 */
function inputValidator(cell, player){
  while(true){
    const rawInput = readline.question(`Enter a ${cell} (0, 1, or 2) for player ${player}: `);

    // Mencegah input kosong atau hanya berisi spasi kosong (.trim())
    if(rawInput.trim() === ''){
      console.log('You must give an input (either 0, 1, or 2)');
      continue;
    }

    const input = +rawInput

    // Logika penyaringan terbalik: tangkap semua input yang salah
    if (input !== 0 && input !== 1 && input !== 2){
      console.log(' Your input must either 0, 1, or 2.');
      continue;
    }
    
    return input; // Mengembalikan angka yang sudah tervalidasi aman
  }
}

/**
 * Memproses pengambilan koordinat baris dan kolom dari pemain.
 * Memastikan koordinat yang dituju belum pernah diisi sebelumnya.
 * @param {Array<Array<string>>} board - Matriks papan permainan
 * @param {string} player - Simbol pemain aktif
 */
function playerInput(board, player){
  while(true){
    const row = inputValidator('row', player);
    const col = inputValidator('column', player);

    // Validasi tumpang tindih kotak
    if (board[row][col] !== ''){
      console.log('This cell already filled. Please try another.');
      continue;
    }
    
    board[row][col] = player;
    break;
  }
}

/**
 * Memeriksa semua kondisi kemenangan (Horizontal, Vertikal, Diagonal).
 * Menggunakan optimasi 1 kali looping dengan kalkulasi rumus matriks dinamis.
 * @param {Array<Array<string>>} board - Matriks papan permainan
 * @param {string} player - Simbol pemain yang diperiksa
 * @returns {boolean} True jika menang, False jika tidak
 */
function checkWin(board, player){
  let majorDiagonal = true; // Flag lintasan kiri atas ke kanan bawah [i][i]
  let minorDiagonal = true; // Flag lintasan kanan atas ke kiri bawah [i][2-i]
  const rowsAndCol = 3;

  for (let i = 0; i < rowsAndCol; i++){
    // Pengecekan baris vertikal (Kolom ke-i)
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player){
      return true;
    }
    
    // Pengecekan baris horizontal (Baris ke-i)
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player){
      return true;
    }
    
    // Evaluasi estafet untuk Diagonal Utama
    if (board[i][i] !== player){
      majorDiagonal = false;
    }
    
    // Evaluasi estafet untuk Diagonal Samping menggunakan rumus: (3 - 1) - i
    if (board[i][(rowsAndCol - 1) - i] !== player){
      minorDiagonal = false;
    }
  }
  
  // Jika salah satu lintasan diagonal utuh milik player, maka menang
  if (majorDiagonal || minorDiagonal){
    return true;
  }
  
  return false;
}

/**
 * Memeriksa kondisi seri (Draw).
 * Game dinyatakan seri jika semua elemen array 2D sudah terisi penuh.
 * @param {Array<Array<string>>} board - Matriks papan permainan
 * @returns {boolean} True jika papan penuh, False jika ada sel kosong
 */
function checkDraw(board){
  return board.every(rows => rows.every(cell => cell !== ''));
}

// ====================================================================
// ALUR UTAMA EKSEKUSI PERMAINAN (GAME ENGINE LOOP)
// ====================================================================

const board = [
  ['','',''],
  ['','',''],
  ['','','']
]

let currentPlayer = 'X'; 
let isWin = false;       
let isDraw = false;      

do {
  displayBoard(board);
  playerInput(board, currentPlayer);
  console.log('');

  // Perbarui status permainan setelah input berhasil dimasukkan
  isWin = checkWin(board, currentPlayer);
  isDraw = checkDraw(board);

  // Ganti giliran jika permainan belum berakhir
  if (!isWin && !isDraw){
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
  }

} while (!isWin && !isDraw) // Berhenti ketika ada yang menang atau papan penuh

displayBoard(board); // Tampilkan kondisi papan akhir permainan

// Pengumuman hasil akhir pertandingan
if (isWin){
  console.log(`\nPlayer ${currentPlayer} won`);
} else if(isDraw){
  console.log('\nThe game is draw');
}