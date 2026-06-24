/**
 * MODEL: Manages account data and authentication states for the ATM system.
 * This component is solely responsible for data manipulation and business rules,
 * without any knowledge of how the data is presented to the user interface (CLI).
 */
class AtmModel {
  /**
   * Initializes the mock database of user accounts and the initial login state.
   */
  constructor(){
    /**
     * Array of existing customer bank accounts (mock database in memory).
     * @type {Array<{id: number, name: string, pin: number, balance: number}>}
     * @private
     */
    this._accounts = [
      { id: 1, name: 'Arfan', pin: 1234, balance: 100000 },
      { id: 2, name: 'Athaillah', pin: 2341, balance: 25000 },
      { id: 3, name: 'Faaz', pin: 2345, balance: 50000 }
    ];

    /**
     * Stores the reference of the currently authenticated customer account.
     * Set to `null` if no user is logged in.
     * @type {Object|null}
     * @private
     */
    this._currentLoginAccount = null;
  }

  /**
   * Retrieves all registered accounts within the ATM system.
   * @returns {Array<Object>} List of all customer account objects.
   */
  getAccounts(){
    return this._accounts;
  }

  /**
   * Authenticates a user based on the provided ID and PIN.
   * If a match is found, the account reference is locked into `_currentLoginAccount`.
   * @param {number} idInput - Unique account ID requested from the View.
   * @param {number} pinInput - Secure PIN code requested from the View.
   * @returns {boolean} `true` if authentication succeeds, `false` otherwise.
   */
  auth(idInput, pinInput){
    // Searches for an account where both ID and PIN match the inputs
    const account = this.getAccounts().find(
      account => account.id === idInput && account.pin === pinInput
    );

    if (account){
      this._currentLoginAccount = account; // Lock the active session account
      return true;
    }
    return false;
  }

  /**
   * Gets the name of the currently logged-in account holder.
   * @returns {string|null} The account owner's name, or `null` if not authenticated.
   */
  getCurrentName(){
    return this._currentLoginAccount ? this._currentLoginAccount.name : null;
  }

  /**
   * Gets the current balance of the authenticated account.
   * @returns {number} The numeric balance value, or `0` if no active session exists.
   */
  getBalance(){
    return this._currentLoginAccount ? this._currentLoginAccount.balance : 0;
  }

  /**
   * Processes a cash deposit into the currently authenticated account.
   * @param {number} amount - The amount of money to deposit (validated as > 0 by Controller).
   */
  deposit(amount){
    if (this._currentLoginAccount){
      this._currentLoginAccount.balance += amount;
    }
  }

  /**
   * Processes a cash withdrawal from the currently authenticated account.
   * @param {number} amount - The amount of money to withdraw (funds availability checked by Controller).
   */
  withdraw(amount){
    if (this._currentLoginAccount){
      this._currentLoginAccount.balance -= amount;
    }
  }

  /**
   * Terminates the current active session by resetting the logged-in account back to null.
   */
  logout(){
    this._currentLoginAccount = null;
  }
}

/**
 * Exports the AtmModel class to make it accessible to the Controller file via require().
 */
module.exports = AtmModel;