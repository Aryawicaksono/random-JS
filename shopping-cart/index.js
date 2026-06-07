const rl = require('readline-sync');

/**
 * Representasi dari sebuah Objek Produk (Model).
 * @constructor
 * @param {number} id - ID unik produk (berbasis indeks).
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
     * Mengurangi stok master toko saat barang dimasukkan ke keranjang belanja.
     * @param {number} amount - Jumlah kuantitas yang dibeli.
     */
    this.withdraw = function(amount){
        this.stock -= amount;
    }

    /**
     * Mengembalikan stok master toko saat barang dihapus dari keranjang belanja.
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
    /** @type {Product[]} Array penampung seluruh instans objek produk di toko */
    this.products = [];

    /**
     * Mengubah urutan array data mentah menjadi kumpulan Objek Product asli.
     * @param {Object[]} data - Array berisi objek mentah dari database.
     * @returns {Product[]} Array berisi instans objek Product.
     */
    this.generateProducts = function(data){
        for (let i = 0; i < data.length; i++){
            const item = data[i];
            const product = new Product(i, item.name, item.price, item.stock);
            this.products.push(product);
        }
        return this.products;
    }

    /**
     * Mencari objek produk berdasarkan ID menggunakan metode Linear Search.
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
// DATA MENTAH & KONFIGURASI PROGRAM
// ==========================================

/** @type {Object[]} Database mentah katalog produk */
const productsData = [
    {name: 'Kopi Susu', price: 5, stock: 10,},
    {name: 'Roti Bakar', price: 7, stock: 5,},
    {name: 'Keripik Singkong', price: 3, stock: 15,},
    {name: 'Teh Manis', price: 2, stock: 20,},
    {name: 'Mie Goreng', price: 6, stock: 8,}
]

/** @type {Object} Enum untuk pemetaan nomor pilihan menu toko */
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
 * Menghitung frekuensi kemunculan produk di dalam keranjang belanja berdasarkan ID.
 * @param {Product[]} cartArray - Array dinamis penampung item belanjaan.
 * @returns {Object} Objek map dengan format -> { 'ID_Produk': Jumlah_Kuantitas }
 */
function occurences(cartArray){
    let occurences = {};

    for (let i = 0; i < cartArray.length; i++){
        const productId = cartArray[i].id;
        if (productId in occurences){
            occurences[productId]++
        } else {
            occurences[productId] = 1;
        }        
    }
    return occurences;
}

// ==========================================
// INISIALISASI VARIABEL RUNTIME
// ==========================================

const productController = new ProductController();
const products = productController.generateProducts(productsData);

let choice;
let productOccurences;

/** @type {Product[]} Array tempat menampung objek produk yang dibeli user */
const cart = [];

// ==========================================
// LOOPING PROGRAM UTAMA (RUNTIME INTERACTIVE)
// ==========================================

do {
    console.log('');
    logMenu();
    
    // Operator + digunakan untuk mengubah input String langsung menjadi tipe data Number
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
            
            // VALIDASI: Mencegah crash jika ID produk tidak ditemukan di toko
            if (!product) {
                console.log('Product ID not found! Please check the product list again.\n');
                continue; // Langsung lompat kembali ke awal loop do-while
            }
            
            const withdrawal = +rl.question('Enter quantity: ');
            
            // VALIDASI: Memastikan permintaan beli tidak melebihi stok yang ada
            if (withdrawal > product.stock){
                console.log(`You cannot add ${product.name} to the Cart! The stock of ${product.name} currently ${product.stock}`);
            } else {
                product.withdraw(withdrawal); // Kurangi stok di katalog master toko
                for (let i = 0; i < withdrawal; i++){
                    cart.push(product); // Masukkan objek produk utuh ke keranjang belanja sesuai kuantitas
                }
                console.log(`Success adding ${product.name} to cart!`);
            }
            break;

        case Menu.VIEW_CART_AND_TOTAL:
            let total = 0; // Wajib di-reset 0 di tingkat lokal agar tidak terjadi akumulasi ganda

            // Dapatkan peta kuantitas belanjaan saat ini berbasis ID produk
            productOccurences = occurences(cart);

            console.log('--- Your Cart ---');

            for (const productId in productOccurences){
                const qty = productOccurences[productId];
                
                // Konversi productId ke Number dengan tanda + karena loop for...in mengembalikan key berbentuk String
                const currentProduct = productController.findProduct(+productId);
                
                if (currentProduct){
                    const subtotal = currentProduct.price * qty;
                    total += subtotal;

                    console.log(`${currentProduct.name} x ${qty} | subtotal : $${subtotal}`);
                    console.log('-----------------'); 
                }
            }
            console.log(`TOTAL TO PAY: $${total}`);
            break;

        case Menu.REMOVE_FROM_CART:
            const removeId = +rl.question('Enter Product ID to remove: ');
            const targetProduct = productController.findProduct(removeId);

            // VALIDASI: Memastikan ID barang yang ingin dihapus memang valid ada di toko
            if (!targetProduct){
                console.log('Product Id is not found!');
                break;
            }

            // Manfaatkan fungsi occurences untuk mengambil jumlah total item di dalam keranjang
            productOccurences = occurences(cart);
            const qtyInCart = productOccurences[removeId] || 0; // Beri nilai fallback 0 jika undefined

            // VALIDASI: Memastikan barang tersebut memang pernah dimasukkan ke dalam keranjang belanja
            if (qtyInCart === 0){
                console.log(`The product "${targetProduct.name}" is not in your cart.`);
                break;
            }

            // REVERSE LOOP LOGIC FOR SPLICE: 
            // Loop berjalan mundur (dari belakang ke depan) untuk menghindari bug 
            // pergeseran indeks elemen sisi kanan saat fungsi .splice() dieksekusi.
            for (let i = cart.length - 1; i >= 0; i--){
                if (cart[i].id === removeId){
                    cart.splice(i, 1); // Hapus tepat 1 elemen pada indeks tersebut
                }
            }

            targetProduct.restock(qtyInCart); // Kembalikan seluruh kuantitas kupon belanja ke stok katalog toko
            console.log(`Success removing all "${targetProduct.name}" from cart. Stock restored by ${qtyInCart}.`);
            break;
            
    }

} while (choice !== Menu.EXIT) // Loop akan terus berputar selama pengguna tidak memilih angka 5 (Exit)

console.log('\nThank you for using our Shopping Cart System!');