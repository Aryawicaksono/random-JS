const wordBank = [
  { word: "REBOISASI", clue: "Penanaman kembali hutan yang gundul." },
  { word: "STALAKTIT", clue: "Endapan batu kapur yang menggantung di atap gua." },
  { word: "KHATULISTIWA", clue: "Garis khayal yang membelah bumi menjadi dua bagian sama besar." },
  { word: "KAMUFLASE", clue: "Penyamaran hewan untuk mengelabui musuhnya." },
  { word: "SAMUDRA", clue: "Lautan yang sangat luas." },
  { word: "KORAL", clue: "Karang di laut yang sering jadi tempat tinggal ikan." },
  { word: "TSUNAMI", clue: "Gelombang laut raksasa akibat gempa bawah laut." },
  { word: "MANGROVE", clue: "Hutan bakau yang menahan abrasi pantai." },
  { word: "EROSI", clue: "Pengikisan tanah oleh air atau angin." },
  { word: "ATMOSFER", clue: "Lapisan gas yang menyelimuti planet bumi." },
  { word: "RENDANG", clue: "Olahan daging khas Minang yang dinobatkan sebagai salah satu makanan terenak di dunia." },
  { word: "KETOPRAK", clue: "Kuliner Jakarta berisi ketupat, tahu, bihun, tauge, dan siraman bumbu kacang." },
  { word: "FERMENTASI", clue: "Proses biologi dalam pembuatan tempe, tape, atau keju." },
  { word: "REMPAH", clue: "Bagian tumbuhan beraroma yang digunakan sebagai penguat rasa masakan." },
  { word: "KOLAK", clue: "Takjil manis berkuah santan dan gula aren, biasanya berisi pisang atau ubi." },
  { word: "TERASI", clue: "Bumbu masak hasil awetan udang atau ikan rebon yang berbau tajam." },
  { word: "KUDAPAN", clue: "Istilah formal/baku untuk makanan kecil atau camilan." },
  { word: "SANGRAI", clue: "Teknik menggoreng tanpa menggunakan minyak atau air." },
  { word: "KERUPUK", clue: "Makanan pelengkap yang renyah dan wajib ada di lomba 17 Agustus." },
  { word: "LUMPIA", clue: "Jajanan gulung khas Semarang dengan isian rebung dan ayam." },
  { word: "ALGORITMA", clue: "Urutan langkah logis untuk menyelesaikan suatu masalah komputer." },
  { word: "NANO", clue: "Satuan ukuran yang sangat kecil (sepermiliar meter)." },
  { word: "SATELIT", clue: "Benda langit buatan manusia yang mengorbit bumi untuk komunikasi." },
  { word: "FOTOSINTESIS", clue: "Proses tumbuhan memasak makanannya sendiri dengan bantuan cahaya matahari." },
  { word: "GRAVITASI", clue: "Gaya tarik-menarik yang menarik benda ke pusat bumi." },
  { word: "EVOLUSI", clue: "Perubahan makhluk hidup secara perlahan dalam jangka waktu yang sangat lama." },
  { word: "ASTRONOT", clue: "Sebutan untuk orang yang pergi ke luar angkasa." },
  { word: "DIAGNOSIS", clue: "Penentuan jenis penyakit berdasarkan gejala yang ada." },
  { word: "NUKLIR", clue: "Energi super besar yang dihasilkan dari pembelahan inti atom." },
  { word: "ROBOTIKA", clue: "Cabang teknologi yang berkaitan dengan desain dan pembuatan robot." },
  { word: "SWALAYAN", clue: "Toko tempat pembeli mengambil barang dagangannya sendiri." },
  { word: "MIMIKRI", clue: "Kemampuan bunglon mengubah warna kulitnya sesuai tempat." },
  { word: "SAYEMBARA", clue: "Perlombaan yang memperebutkan hadiah (sering ada di cerita kerajaan)." },
  { word: "PANCASILA", clue: "Lima dasar negara Republik Indonesia." },
  { word: "WIRAUSAHA", clue: "Orang yang pandai atau berbakat mengenali produk baru dan mengatur permodalannya." },
  { word: "SEMPURNA", clue: "Utuh dan tidak ada cacatnya sedikit pun." },
  { word: "NURANI", clue: "Lubuk hati yang paling dalam (sering dikaitkan dengan kebaikan)." },
  { word: "MUSEUM", clue: "Gedung tempat menyimpan benda-benda bersejarah." },
  { word: "FILOSOFI", clue: "Pengetahuan atau penyelidikan dengan akal budi mengenai hakikat segala yang ada." },
  { word: "SAJAK", clue: "Gubahan sastra yang berbentuk puisi dengan rima yang teratur." }
]
const stage =[

]

const stages = [
  '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
    '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========='
]

module.exports = {
wordBank,
stages
}