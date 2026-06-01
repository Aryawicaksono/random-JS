/**
 * SISTEM SIMULASI ATM - OOP & MVC PATTERN
 * Aplikasi ini mensimulasikan mesin ATM menggunakan pendekatan Object-Oriented Programming (OOP)
 * dan pemisahan logika kontrol data (Model-Controller-View).
 */

const rl = require('readline-sync');

// =================================================================
// 1. MODEL COMPONENT (Struktur & Operasi Data Akun Tunggal)
// =================================================================

/**
 * Konstruktor blueprint untuk membuat objek Akun Nasabah tunggal.
 * @param {number} id - ID unik untuk akun nasabah.
 * @param {number} balance - Jumlah saldo awal akun.
 */
function Account(id, balance){
    this.id = id;
    this.balance = balance;

    /**
     * Mengurangi saldo akun saat nasabah melakukan penarikan uang.
     * @param {number} amount - Nominal uang yang ditarik.
     */
    this.withdraw = function(amount){
        this.balance -= amount;
    }

    /**
     * Menambah saldo akun saat nasabah melakukan penyetoran uang.
     * @param {number} amount - Nominal uang yang disetor.
     */
    this.deposit = function(amount){
        this.balance += amount;
    }
}

// =================================================================
// 2. CONTROLLER COMPONENT (Manajemen Kumpulan Data Seluruh Akun)
// =================================================================

/**
 * Kontroler yang bertugas mengelola basis data (database) internal seluruh akun.
 */
function AccountController(){
    // Array untuk menampung seluruh objek database 'Account'
    this.accounts = [];

    /**
     * Membuat akun simulasi secara massal di awal program.
     * @param {number} count - Jumlah akun dummy yang ingin dibuat.
     * @returns {Account[]} Array berisi daftar seluruh akun yang berhasil dibuat.
     */
    this.generateAccount = function(count){
        for (let i = 0; i < count; i++){
            // Setiap akun diinisialisasi dengan ID berupa urutan 'i' dan saldo default 100
            const account = new Account(i, 100);
            this.accounts.push(account);
        }
        return this.accounts;
    }

    /**
     * Mencari objek akun spesifik di dalam array database berdasarkan ID yang diminta.
     * @param {number} id - ID akun target yang dicari.
     * @returns {Account|undefined} Mengembalikan objek Account jika ditemukan, atau undefined jika tidak ada.
     */
    this.findInitialAccount = function(id){
        for (let i = 0; i < this.accounts.length; i++){
            const account = this.accounts[i];

            // Membandingkan properti .id milik objek akun dengan parameter id input
            if (account.id === id){
                return account; // Akun ditemukan, langsung kirim keluar objeknya
            } 
        }
        return undefined; // Loop selesai dan tidak ada ID yang cocok
    }
}

// =================================================================
// 3. ENUM PATTERN & INTERFACE HELPER (Definisi Menu Konstanta)
// =================================================================

/**
 * Konstanta pilihan menu untuk menghindari angka gaib (magic numbers) 
 * pada logika Switch-Case agar kode lebih deskriptif.
 */
const Menu = {
    CHECK_BALANCE: 1,
    WITHDRAW: 2,
    DEPOSIT: 3,
    EXIT: 4,
}

/**
 * Fungsi pembantu untuk mencetak teks menu utama ke layar terminal.
 */
function logMenu(){
    console.log(`Main menu
1: check balance
2: withdraw
3: deposit
4: exit`);
}

// =================================================================
// 4. VIEW / ALUR EKSEKUSI PROGRAM UTAMA
// =================================================================

// Membuat instance kontroler baru dan menginstruksikannya membuat 10 akun awal (ID: 0 - 9)
const accounts = new AccountController();
accounts.generateAccount(10);

// --- LOOP TINGKAT 1: Validasi Akses (Mesin Standby Meminta ID) ---
while(true){
    const idAccount = +rl.question('Enter an id: ');
    const account = accounts.findInitialAccount(idAccount);

    // Jika akun kosong/undefined (ID salah), lompat kembali ke atas untuk meminta ID ulang
    if (!account){
        continue;
    }

    console.log('');

    let choice;

    // --- LOOP TINGKAT 2: Menu Transaksi Akun Nasabah ---
    // Menggunakan do-while agar menu minimal wajib ditampilkan sekali setelah login sukses
    do {
        logMenu();
        choice = +rl.question('Enter a choice: ');

        switch(choice){
            case Menu.CHECK_BALANCE:
                console.log(`The balance is ${account.balance}`);
                break;
            case Menu.WITHDRAW:
                const withdrawalAmount = +rl.question('Enter an amount to withdraw: ');
                account.withdraw(withdrawalAmount);
                break;
            case Menu.DEPOSIT:
                const depositAmount = +rl.question('Enter an amount to deposit: ');
                account.deposit(depositAmount);
                break;
        }
        console.log('');
    } while (choice !== Menu.EXIT)  // Loop transaksi terus berputar selama pengguna TIDAK memilih opsi 4 (EXIT)
}