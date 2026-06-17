const AtmModel = require('./Model');
const AtmView = require('./View');

/**
 * Menu constants to prevent magic numbers throughout the application workflow.
 * @enum {number}
 */
const Menu = {
  DEPOSIT: 1,
  WITHDRAW: 2,
  LOGOUT: 3,
}

/**
 * CONTROLLER: Coordinates interactions between the AtmModel and the AtmView.
 * This component handles the application business workflow, monitors user inputs 
 * coming from the View, updates states inside the Model, and controls state progression.
 */
class AtmController{
  /**
   * Instantiates the core Model and View components for the ATM operational cycle.
   */
  constructor(){
    this._model = new AtmModel();
    this._view = new AtmView();
  }

  /**
   * Starts the primary system lifetime execution loop.
   * Runs an outer infinite routine handling authentication gateways,
   * switching seamlessly into an inner transaction loop once authentication clears.
   */
  startAtm(){
    while (true){
      // 1. Prompt and intercept credentials from the login user interface screen
      const credential = this._view.displayLoginScreen();
      
      // 2. Transmit the input payload directly to the data Model layer for validation
      const isAuthSuccess = this._model.auth(credential.id, credential.pin)

      // 3. Evaluate state verification status flag
      if (!isAuthSuccess){
        this._view.displayError('Invalid ID and PIN. Please try again.')
        this._view.wait();
        continue; // Terminate current lifecycle thread iteration to restart the authentication screen
      }

      // 4. Authenticated state reached successfully
      this._view.displaySucess('Login Successful!');
      this._view.wait();

      let choice;
      
      // INNER LIFETIME OPERATION LOOP: Manages secure user session transactions
      do {
        // Always query active runtime values freshly updated from the data Model
        const name = this._model.getCurrentName();
        const balance = this._model.getBalance();

        // Prompt user dashboard layout and update context tracking state variable
        choice = this._view.displayMenu(name, balance);
        let amount;
        
        switch (choice){
          case Menu.DEPOSIT:
            amount = this._view.readAmount('deposit');
            
            // Execute state input boundary rule assertions
            if (amount <= 0){
              this._view.displayError('The amount must more than 0');
            } else {
              this._model.deposit(amount);
              this._view.displaySucess(`You have deposit ${amount}`)
              this._view.wait(); // Freezes display terminal to allow data updates visibility
            }
            break;

          case Menu.WITHDRAW:
            amount = this._view.readAmount('withdraw');
            
            // Execute multi-tier validation gates across input thresholds and current model balance balances
            if (amount <= 0){
              this._view.displayError('The amount maust greater than 0')
            } else if (amount > this._model.getBalance()){
              this._view.displayError('Your balance is not enough to withdraw! Please try again');
            } else {
              this._model.withdraw(amount);
              this._view.displaySucess(`You have withdraw ${amount}`);
              this._view.wait(); // Freezes display terminal to allow data updates visibility
            }
            break;
        }
      } while (choice !== Menu.LOGOUT) // Breaks operation tree execution once session logout code is input
        
        // 5. Terminate current tracking references and safely close session data channels
        this._model.logout();
        this._view.displaySucess('Logged out successfully.')
        this._view.wait();
    }
  }
}

/**
 * Exports the structural system operational Controller component for index script linkage points.
 */
module.exports = AtmController;