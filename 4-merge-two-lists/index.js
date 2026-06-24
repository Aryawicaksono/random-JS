/**
 * PROGRAM PENGGABUNG DAN PENGURUTAN DERET ANGKA (MERGE & COUNTING SORT)
 * Program ini menerima dua input deret angka dari pengguna, menggabungkannya,
 * mengurutkannya dari terkecil ke terbesar secara manual, lalu mencetaknya kembali.
 */

const rl = require('readline-sync');

/**
 * Mengonversi string input dari pengguna menjadi array berisi angka-angka murni.
 * @param {string} str - String input yang berisi angka dipisahkan spasi (contoh: "4 1 3").
 * @returns {number[]} Array satu dimensi yang menampung angka hasil konversi.
 */
function parseNumbers(str){
    const strs = str.split(' ');
    const numbers = [];

    for (let i = 0; i < strs.length; i++){
        // Menggunakan operator unary plus (+) untuk mengubah string teks menjadi tipe data Number
        numbers.push(+strs[i]);
    }

    return numbers;
}

/**
 * Menggabungkan dua buah array menjadi satu buah array baru.
 * @param {number[]} arr1 - Array pertama yang akan digabungkan.
 * @param {number[]} arr2 - Array kedua yang akan digabungkan.
 * @returns {number[]} Array baru hasil gabungan elemen arr1 dan arr2 secara berurutan.
 */
function merge(arr1, arr2){
    const merged = [];

    // Menyalin semua elemen dari array pertama
    for (let i = 0; i < arr1.length; i++){
        merged.push(arr1[i]);
    }
    
    // Menyalin semua elemen dari array kedua dilanjutkan di belakangnya
    for (let i = 0; i < arr2.length; i++){
        merged.push(arr2[i]);
    }

    return merged;
}

/**
 * Menghitung frekuensi atau jumlah kemunculan setiap angka ke dalam sebuah objek peta (Map).
 * @param {number[]} values - Kumpulan angka acak yang akan dihitung frekuensinya.
 * @returns {Object.<string, number>} Objek dengan KEY berupa angka dan VALUE berupa jumlah kemunculannya.
 * @example input: [3, 1, 3] -> hasil: { "1": 1, "3": 2 }
 */
function buildOccurences(values){
    const occurences = {};

    for (let i = 0; i < values.length; i++){
        const number = values[i];

        // Memeriksa apakah angka sudah pernah dicatat di dalam objek
        if (number in occurences){
            occurences[number]++; // Jika sudah ada, tambahkan hitungan kemunculannya
        } else {
            occurences[number] = 1; // Jika belum ada, inisialisasi dengan nilai 1
        }
    }

    return occurences;
}

/**
 * Mengurutkan array angka secara manual menggunakan metode Counting Sort.
 * Memanfaatkan sifat bawaan objek JavaScript yang otomatis mengurutkan KEY jika berupa angka bulat.
 * @param {number[]} values - Array angka acak hasil gabungan.
 * @returns {number[]} Array baru yang elemen-elemennya sudah terurut dari terkecil ke terbesar.
 */
function sort(values){
    const sorted = [];
    // Membuat peta frekuensi (otomatis terurut berdasarkan KEY di dalam objek)
    const occurences = buildOccurences(values);

    // Membongkar kembali isi objek menjadi array terurut
    for (number in occurences){
        // Loop berjalan sebanyak jumlah kemunculan angka tersebut (nilai VALUE pada objek)
        for (let i = 0; i < occurences[number]; i++){
            // Catatan: Karena 'number' aslinya adalah KEY bertipe String, 
            // kamu bisa mengubahnya menjadi murni angka dengan menulis '+number' jika dibutuhkan.
            sorted.push(number); 
        }
    }

    return sorted;
}

/**
 * Menggabungkan elemen-elemen array menjadi satu baris String teks utuh dengan karakter pemisah.
 * @param {number[]} values - Array angka yang sudah terurut rapi.
 * @param {string} separator - Karakter teks pemisah (misal: spasi ' ' atau koma ',').
 * @returns {string} Baris teks string murni yang siap dicetak ke terminal.
 */
function join(values, separator){
    // Pengaman: Jika array kosong, langsung kembalikan string kosong
    if (values.length === 0){
        return ''
    }

    // Mengambil elemen pertama (indeks 0) sebagai modal awal string
    let joined = values[0];

    // Loop wajib dimulai dari indeks ke-1 agar elemen pertama tidak terduplikasi (double)
    for (let i = 1; i < values.length; i++){
        joined += `${separator}${values[i]}`;
    }
    return joined;
}

// =================================================================
// ALUR UTAMA EKSEKUSI PROGRAM
// =================================================================

// 1. Meminta pengguna menginput dua deret angka terpisah via terminal
const list1 = parseNumbers(rl.question('Enter list1: '));
const list2 = parseNumbers(rl.question('Enter list2: '));

// 2. Menggabungkan kedua list tersebut menjadi satu kesatuan array acak
const merged = merge(list1, list2);

// 3. Mengurutkan array gabungan tersebut menggunakan metode Counting Sort manual
const sorted = sort(merged);

// 4. Mencetak hasil akhir dengan mengubah array terurut menjadi string murni lewat fungsi join
console.log(`The merged list is ${join(sorted, ' ')}`);