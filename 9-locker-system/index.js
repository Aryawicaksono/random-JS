"use strict";

/**
 * @requires readline-sync
 */
const rl = require('readline-sync');

/**
 * @enum {number}
 * @readonly
 * @description Frozen configuration object defining the main menu navigation constraints.
 */
const Menu = Object.freeze({
  "LOCKER_STATUS": 1,
  'RENT_LOCKER': 2,
  'RESET_LOCKER': 3,
  'EXIT': 4,
});

/**
 * @class LockerSystemModel
 * @description Model component responsible for handling the persistent state and business logic of the lockers.
 */
class LockerSystemModel {
  /**
   * @param {Object} config - Initial model configurations.
   * @param {number} config.totalLockers - Maximum number of lockers to allocate.
   */
  constructor({ totalLockers }) {
    /** @private {number} */
    this._totalLockers = totalLockers;
    
    /** * @private {Array.<{id: number, status: boolean, qty: number}>} 
     * Stores individual locker states natively in memory.
     */
    this._lockers = Array.from({ length: this._totalLockers }, (_, index) => ({
      id: index,
      status: false,
      qty: 0,
    }));
  }

  /**
   * Retrieves the total number of registered lockers.
   * @returns {number} Total locker capacity.
   */
  getTotalLockers() {
    return this._totalLockers;
  }

  /**
   * Retrieves the persistent lockers state array.
   * @returns {Array.<{id: number, status: boolean, qty: number}>} Reference to the lockers array.
   */
  getLockers() {
    return this._lockers;
  }
}

/**
 * @class LockersStystemView
 * @description View component responsible for rendering string-based UI layouts and feedback messages to the terminal.
 */
class LockersStystemView {
  /**
   * Renders the master navigation layout.
   */
  displayMenu() {
    console.log('Main Menu');
    console.log('1: Check Locker Status');
    console.log('2: Rent/Fill a Locker');
    console.log('3: Empty Locker');
    console.log('4: Exit');
  }

  /**
   * Renders a targeted error if the requested ID falls outside valid index bounds.
   * @param {number} id - The invalid ID supplied by the user.
   */
  showInvalidId(id) {
    console.log(`Locker with id "${id}" is not found! Please enter correct id.`);
  }

  /**
   * Formats and prints the current status metrics of a specific locker.
   * @param {boolean} status - Current occupancy state (true = occupied, false = empty).
   * @param {number} qty - Quantity of items stored.
   */
  showLockerStatus(status, qty) {
    console.log(`Locker status: ${!status ? 'empty' : 'occupied'} (${qty} ${qty === 0 || qty === 1 ? 'item' : 'items'})`);
  }

  /** Prints confirmation when a locker is successfully secured. */
  showSuccesRentLocker() {
    console.log('This locker succesfully occupied');
  }

  /** Prints a rejection alert if a locker is already occupied. */
  showFailedRentLocker() {
    console.log('This locker already occupied.');
  }

  /** Prints a requirement warning if item input parameters evaluate to <= 0. */
  showEmptyQty() {
    console.log('You must fill this locker with item.');
  }

  /** Prints confirmation when a locker state is flushed clean. */
  showSuccessResetLocker() {
    console.log('You successfully empted this locker.');
  }

  /** Prints a failure message if attempting to empty an already vacant locker. */
  showFailedResetLocker() {
    console.log('This Locker is unoccupied.');
  }

  /** Prints a basic validation warning for inputs outside the 1-4 menu scope. */
  showErrorMenu() {
    console.log('Please enter the correct menu.');
  }

  /** Prints an exit indicator when popping out of a local locker loop. */
  showExitMenu() {
    console.log('Exiting current locker...');
  }
}

/**
 * @class PromptView
 * @description Concrete input handling wrapper that sanitizes raw terminal interface interactions.
 */
class PromptView {
  /**
   * Prompts for a Locker ID and type-casts it into a primitive Number.
   * @returns {number} Evaluated locker ID.
   */
  inputId() {
    return Number(rl.question('Enter Locker ID: '));
  }

  /**
   * Prompts for a navigation decision and type-casts it into a primitive Number.
   * @returns {number} Chosen menu key.
   */
  inputMenu() {
    return Number(rl.question('Enter a choice: '));
  }

  /**
   * Prompts for item batch metrics and type-casts it into a primitive Number.
   * @returns {number} Quantity of items to process.
   */
  inputQty() {
    return Number(rl.question('Enter the number of items to store: '));
  }
}

/**
 * @class LockerSystemController
 * @description Orchestrator component serving as the absolute link binding state data (Model) to interface outputs (View).
 */
class LockerSystemController {
  /**
   * @param {Object} config - Orchestration setup metadata.
   * @param {number} config.totalLockers - Total locker slots to initiate inside the sub-model.
   */
  constructor(config) {
    /** @private {number} */
    this._totalLockers = config.totalLockers;
    /** @private {LockerSystemModel} */
    this._model = new LockerSystemModel({ totalLockers: this._totalLockers });
    /** @private {LockersStystemView} */
    this._view = new LockersStystemView();
    /** @private {PromptView} */
    this._promptView = new PromptView();
  }

  /** @returns {LockerSystemModel} */
  getModel() { return this._model; }

  /** @returns {LockersStystemView} */
  getView() { return this._view; }

  /** @returns {PromptView} */
  getPrompt() { return this._promptView; }

  /**
   * Executes a strict input validation loop for Locker IDs.
   * Rejects NaN values, negative numbers, or elements exceeding total capacity constraints.
   * @returns {number} A validated, index-safe locker ID.
   */
  validateInputId() {
    while (true) {
      const inputId = this.getPrompt().inputId();
      if (isNaN(inputId) || inputId < 0 || inputId >= this.getModel().getTotalLockers()) {
        this.getView().showInvalidId(inputId);
        console.log('');
        continue;
      }
      return inputId;
    }
  }

  /**
   * Executes a strict storage metrics input validation loop.
   * Prevents transaction completion with empty value or negative payloads.
   * @returns {number} A validated item quantity count (> 0).
   */
  validateInputQty() {
    while (true) {
      const inputQty = this.getPrompt().inputQty();
      if (inputQty <= 0) {
        this.getView().showEmptyQty();
        continue;
      }
      return inputQty;
    }
  }

  /**
   * Launches the main Infinite Master Execution Loop of the terminal application.
   * Integrates the continuous flow of target ID selections and operational routing loops.
   */
  initializeSystem() {
    while (true) {
      const lockers = this.getModel().getLockers();
      const inputId = this.validateInputId();
      const locker = lockers[inputId];

      let choice;
      do {
        this.getView().displayMenu();
        choice = this.getPrompt().inputMenu();

        switch (choice) {
          case Menu.LOCKER_STATUS:
            this.getView().showLockerStatus(locker.status, locker.qty);
            break;
          case Menu.RENT_LOCKER:
            if (!locker.status) {
              locker.status = true;
              locker.qty = this.validateInputQty();
              this.getView().showSuccesRentLocker();
            } else {
              this.getView().showFailedRentLocker();
            }
            break;
          case Menu.RESET_LOCKER:
            if (locker.status) {
              locker.status = false;
              locker.qty = 0;
              this.getView().showSuccessResetLocker();
            } else {
              this.getView().showFailedResetLocker();
            }
            break;
          case Menu.EXIT:
            this.getView().showExitMenu();
            break;
          default:
            this.getView().showErrorMenu();
        }
        console.log('');
      } while (choice !== Menu.EXIT);
    }
  }
}

// ==========================================
// 🚀 INITIATE RUNTIME PIPELINE
// ==========================================
const controller = new LockerSystemController({ totalLockers: 4 });
controller.initializeSystem();