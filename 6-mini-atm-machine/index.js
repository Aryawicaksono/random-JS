const AtmController = require('./Controller');

/**
 * APPLICATION ENTRY POINT (index.js)
 * This script initializes the system bootstrap lifecycle by instantiating 
 * the main Controller component and starting the terminal CLI application loop.
 */

// 1. Instantiate the central execution manager engine
const controller = new AtmController();

// 2. Fire up the ATM runtime lifecycle environment
controller.startAtm();