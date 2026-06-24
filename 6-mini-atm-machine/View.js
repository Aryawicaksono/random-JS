const rl = require('readline-sync');

/**
 * VIEW: Handles user interactions, terminal inputs, and outputs.
 * This component is solely responsible for rendering text to the console
 * and capturing raw input from the user via readline-sync.
 */
class AtmView{
  /**
   * Displays the initial greeting and captures authentication credentials.
   * @returns {{id: number, pin: number}} Object containing the raw numeric ID and PIN.
   */
  displayLoginScreen(){
    console.log('\n==== WELCOME TO MINI ATM ====');
    const id = Number(rl.question('Input your ID: '));
    const pin = Number(rl.question('Input your PIN: '))
    return {id, pin};
  }

  /**
   * Displays the main dashboard menu along with current account statistics.
   * @param {string} name - The name of the authenticated customer.
   * @param {number} balance - The current balance of the authenticated customer.
   * @returns {number} The numeric menu choice selected by the user.
   */
  displayMenu(name, balance){
    console.log('\n'+ '-'.repeat(30));
    console.log(`Hello, ${name}`);
    console.log(`Current Balance: ${balance}`);
    console.log('\n'+ '-'.repeat(30));
    console.log('1. Deposit');
    console.log('2. Withdraw');  
    console.log('3. Logout');  
    return  Number(rl.question('Enter your choice: '));
  }

  /**
   * Prompts the user to input a monetary value for transactions.
   * @param {string} transactionType - The type of transaction (e.g., 'deposit' or 'withdraw').
   * @returns {number} The validated numeric amount entered by the user.
   */
  readAmount(transactionType){
    return Number(rl.question(`Enter amount of your ${transactionType}: `));
  }

  /**
   * Renders a success feedback banner to the console.
   * @param {string} message - The success description text.
   */
  displaySucess(message){
    console.log(`\n=== SUCESS: ${message} ===`);
  }

  /**
   * Renders an error or validation failure alert to the console.
   * @param {string} message - The error description text.
   */
  displayError(message){
    console.log(`\n=== ERROR: ${message} ===`);
  }

  /**
   * Halts terminal execution to allow the user to read status updates before clearing/re-rendering.
   */
  wait(){
    rl.question('Press [ENTER} to continue');
  }
}

/**
 * Exports the AtmView class to make it available to the Controller via require().
 */
module.exports = AtmView;