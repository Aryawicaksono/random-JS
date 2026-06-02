const rl = require('readline-sync');

/**
 * Representasi dari sebuah Objek Produk (Model).
 * @constructor
 * @param {number} id - ID unik produk, dibuat otomatis berbasis indeks.
 * @param {string} name - Nama produk.
 * @param {number} price - Harga produk per satuan.
 * @param {number} stock - Jumlah stok yang tersedia di toko.
 */
function Product(id, name, price, stock){
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;

    /**
     * Mengurangi stok toko saat barang dimasukkan ke keranjang.
     * @param {number} amount - Jumlah kuantitas yang dibeli.
     */
    this.withdraw = function(amount){
        this.stock -= amount;
    }

    /**
     * Mengembalikan stok toko saat barang dihapus dari keranjang.
     * @param {number} amount - Jumlah kuantitas yang dikembalikan.
     */
    this.restock = function(amount){
        this.stock += amount;
    }
}

/**
 * Pengendali utama data katalog produk toko (Controller).
 * @constructor
 */
function ProductController(){
    /** @type {Product[]} Array penampung seluruh objek produk di toko */
    this.products = [];

    /**
     * Mengubah array data mentah menjadi kumpulan Objek Product asli.
     * @param {Object[]} data - Array berisi objek mentah dari database.
     * @returns {Product[]} Array berisi instans objek Product.
     */
    this.generateProducts = function(data){
        for (let i = 0; i < data.length; i++){
            const item = data[i];
            // ID otomatis menggunakan indeks perulangan 'i' (0, 1, 2, dst)
            const product = new Product(i, item.name, item.price, item.stock);
            this.products.push(product);
        }
        return this.products;
    }

    /**
     * Mencari objek produk di toko berdasarkan ID secara manual (Linear Search).
     * @param {number} id - ID produk yang dicari.
     * @returns {Product|undefined} Mengembalikan objek Product jika ketemu, atau undefined.
     */
    this.findProduct = function(id){
        for (let i = 0; i < this.products.length; i++){
            const product = this.products[i];
            if (product.id === id){
                return product;
            }
        }
        return undefined;
    }
}

// ==========================================
// DATA MENTAH & CONFIGURATION PROGRAM
// ==========================================

/** @type {Object[]} Database mentah katalog produk */
const productsData = [
    {name: 'Kopi Susu', price: 5, stock: 10,},
    {name: 'Roti Bakar', price: 7, stock: 5,},
    {name: 'Keripik Singkong', price: 3, stock: 15,},
    {name: 'Teh Manis', price: 2, stock: 20,},
    {name: 'Mie Goreng', price: 6, stock: 8,}
]

/** @type {Object} Enum pemetaan nomor pilihan menu toko */
const Menu = {
    VIEW_PRODUCTS: 1,
    ADD_TO_CART: 2,
    VIEW_CART_AND_TOTAL: 3,
    REMOVE_FROM_CART: 4,
    EXIT: 5,
}

/**
 * Mencetak daftar menu utama ke layar console.
 */
function logMenu(){
    console.log(`Main Menu:
1. View Products
2. Add to Cart
3. View Cart & Total
4. Remove from Cart
5. Exit`)
}

/**
 * Menghitung frekuensi kemunculan objek produk di dalam keranjang belanja.
 * @param {Product[]} cartArray - Array dinamis penampung item belanjaan.
 * @returns {Object} Objek map dengan format -> { 'Nama Produk': Jumlah Kuantitas }
 */
function occurences(cartArray){
    let occurences = {};

    for (let i = 0; i < cartArray.length; i++){
        // Ambil properti .name dari objek Product agar key berbentuk String teks biasa
        const productName = cartArray[i].name;
        if (productName in occurences){
            occurences[productName]++
        } else {
            occurences[productName] = 1;
        }        
    }
    return occurences;
}

// ==========================================
// INISIALISASI VARIABEL GLOBAL RUNTIME
// ==========================================

const productController = new ProductController();
const products = productController.generateProducts(productsData);

let choice;
let productOccurences;
/** @type {Product[]} Array dinamis untuk menampung produk yang dibeli user */
const cart = [];

// ==========================================
// LOOPING PROGRAM UTAMA (RUNTIME INTERACTIVE)
// ==========================================

do {
    console.log('');
    logMenu();
    // Konversi langsung input string menjadi Number menggunakan operator +
    choice = +rl.question('Enter choice: ');

    switch (choice){
        case Menu.VIEW_PRODUCTS:
            console.log('\n--- Product List ---');
            for (const product of products){
                console.log(`ID: ${product.id} | ${product.name} | Price: $${product.price} | Stock: ${product.stock}`);
            }
            break;

        case Menu.ADD_TO_CART:
            const productId = +rl.question('Enter Product ID to add: ');
            const product = productController.findProduct(productId);
            
            // CEGATAN VALIDASI: Mencegah error crash jika product bernilai undefined
            if (!product) {
                console.log('Product ID not found! Please check the product list again.\n');
                continue; // Lompat langsung ke awal loop do-while
            }
            
            const withdrawal = +rl.question('Enter quantity: ');
            
            // Validasi kecukupan stok toko sebelum dimasukkan ke cart
            if (withdrawal > product.stock){
                console.log(`You cannot add ${product.name} to the Cart! The stock of ${product.name} currently ${product.stock}`);
            } else {
                product.withdraw(withdrawal); // Kurangi stok master di toko
                for (let i = 0; i < withdrawal; i++){
                    cart.push(product); // Push objek produk utuh berulang kali sesuai qty
                }
                console.log(`Success adding ${product.name} to cart!`);
            }
            break;

        case Menu.VIEW_CART_AND_TOTAL:
            let total = 0; // Wajib di-reset 0 di lingkup lokal agar tidak akumulasi ganda

            // Petakan isi cart menjadi objek frekuensi { 'Kopi Susu': 2 }
            productOccurences = occurences(cart);

            console.log('--- Your Cart ---');

            // Iterasi menggunakan key (productName) dari objek frekuensi
            for (const productName in productOccurences){
                const qty = productOccurences[productName];
                let productPrice = 0;
                
                // PENCARIAN HARGA SILANG MANUAL: Mencocokkan nama untuk mengambil properti .price
                for (let i = 0; i < products.length; i++){
                    if (products[i].name === productName){
                        productPrice = products[i].price;
                        break; // Hentikan loop pencarian harga jika sudah ketemu
                    }
                }
                const subtotal = productPrice * qty;
                total += subtotal; // Akumulasikan ke total harga belanjaan

                console.log(`${productName} x ${qty} | subtotal : $${subtotal}`);
                console.log('-----------------'); // Dicetak per item sesuai preferensi visual pembatas kartu
            }
            console.log(`TOTAL TO PAY: $${total}`);
            break;

        case Menu.REMOVE_FROM_CART:
            const removeId = +rl.question('Enter Product ID to remove: ');
            const targetProduct = productController.findProduct(removeId);

            // Validasi eksistensi id produk yang ingin dihapus
            if (!targetProduct){
                console.log('Product Id is not found!');
                break;
            }

            let countInCart = 0;
            // Scan cart dari depan ke belakang hanya untuk menghitung total kuantitas barang tersebut di cart
            for (let i = 0; i < cart.length; i++){
                if (cart[i].id === removeId){
                    countInCart++
                }
            }

            // Jika barang memang tidak pernah ada di dalam keranjang belanja
            if (countInCart === 0){
                console.log(`The product "${targetProduct.name}" is not in your cart.`);
                break;
            }

            // REVERSE LOOP LOGIC FOR SPLICE: 
            // Loop berjalan mundur (dari belakang ke depan) untuk menghindari bug 
            // pergeseran indeks elemen sebelah kanan saat .splice() dijalankan.
            for (let i = cart.length - 1; i >= 0; i--){
                if (cart[i].id === removeId){
                    cart.splice(i, 1); // Hapus tepat 1 elemen pada indeks tersebut
                }
            }

            targetProduct.restock(countInCart); // Kembalikan total kuantitas barang yang dihapus ke stok master toko
            console.log(`Success removing all "${targetProduct.name}" from cart. Stock restored by ${countInCart}.`);
            break;
            
    }

} while (choice !== Menu.EXIT) // Loop akan terus berjalan selama user tidak memilih angka 5 (Exit)

console.log('\nThank you for using our Shopping Cart System!');