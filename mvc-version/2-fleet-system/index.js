"use strict";

const rl = require('readline-sync');

/**
 * @enum {number}
 * @readonly
 * @description Enumeration for the fleet management system menu options.
 */
const Menu = Object.freeze({
  CHECK_VEHICLE_STATUS: 1,
  DISPATCH_VEHICLE: 2,
  RETURN_VEHICLE: 3,
  REFUEL_VEHICLE: 4,
  EXIT: 5,
});

/**
 * @class Vehicle
 * @description Base parent class representing a generic vehicle in the fleet.
 * Uses property descriptors to create immutable identification properties.
 */
class Vehicle{
  /**
   * @param {string} id - The unique registration identifier of the vehicle.
   * @param {string} type - The category classification of the vehicle (e.g., 'Car', 'Truck').
   */
  constructor(id, type){
    Object.defineProperties(this, {
      /** @type {string} Read-only unique vehicle ID */
      id: {
        value: id,
        enumerable: true,
        configurable: true,
      },
      /** @type {string} Read-only vehicle type classification */
      type: {
        value: type,
        enumerable: true,
        configurable: true,
      }
    })
    /** @type {number} Fuel level percentage, initialized at 100% */
    this.fuel = 100;
    /** @type {boolean} Availability status tracker (true if available, false if on duty) */
    this.isAvailable = true;
  }
}

/**
 * @class Car
 * @extends Vehicle
 * @description Specific child class representing a passenger car.
 */
class Car extends Vehicle{
  /**
   * @param {string} id - The unique registration identifier of the car.
   * @param {number} capacity - Passenger seating capacity count.
   */
  constructor(id, capacity){
    super(id, 'Car')
    /** @type {number} Maximum passenger load capacity */
    this.passengerCapacity = capacity;
  }
}

/**
 * @class Truck
 * @extends Vehicle
 * @description Specific child class representing a cargo delivery truck.
 */
class Truck extends Vehicle{
  /**
   * @param {string} id - The unique registration identifier of the truck.
   * @param {number} capacity - Total cargo weight limit capacity in Kilograms.
   */
  constructor(id, capacity){
    super(id, 'Truck')
    /** @type {number} Maximum weight capacity in Kilograms (Kg) */
    this.cargoCapacity = capacity;
  }
}

/**
 * @class FleetModel
 * @description Data management layer that handles cluster mapping structures and basic querying logic.
 */
class FleetModel{
  constructor(){
    /** @private {Map<string, (Car|Truck)>} Key-value storage mapping Vehicle IDs to their respective Object records */
    this._vehicles = new Map();
  }
  
  /**
   * Hydrates the internal dataset collection with new Car instances.
   * @param {Array<{id: string, passengerCapacity: number}>} cars - Raw array mapping vehicle raw options.
   */
  generateCars(cars){
    for (const carData of cars){
      const car = new Car(carData.id, carData.passengerCapacity);
      this._vehicles.set(car.id, car)
    } 
  }
  
  /**
   * Hydrates the internal dataset collection with new Truck instances.
   * @param {Array<{id: string, cargoCapacity: number}>} trucks - Raw array mapping truck configuration profiles.
   */
  generateTrucks(trucks){
    for (const truckData of trucks){
      const truck = new Truck(truckData.id, truckData.cargoCapacity);
      this._vehicles.set(truck.id, truck);
    }
  }
  
  /**
   * Retrieves a vehicle instance record tied to a specific lookup index key.
   * @param {string} id - The unique tracking identification string.
   * @returns {(Car|Truck|undefined)} The targeted instance object state, or undefined if unmatched.
   */
  getVehicle(id){
    return this._vehicles.get(id);
  };
  
  /**
   * Verifies registration listings context constraints.
   * @param {string} id - The targeted registration lookup parameter.
   * @returns {boolean} True if the identifier maps natively inside the collection storage.
   */
  hasVehicle(id){
    return this._vehicles.has(id);
  };
  
  /**
   * Custom Symbol.iterator implementation.
   * Permits clean loops natively via for...of across the instance core context registry.
   * @returns {{next: function(): IteratorResult<(Car|Truck)>}} A standard valid iterable interface reference.
   */
  [Symbol.iterator](){
    const vehicleVal = this._vehicle.values();
    return {
      next(){
        return vehicleVal.next();
      }
    }
  };  
}

/**
 * @class FleetView
 * @description Standard output presentation module handling textual terminal rendering.
 */
class FleetView{
  /**
   * Renders the master menu navigation directions block to stdout streams.
   */
  displayMenu(){
    console.log('Main Menu');
    console.log('1. Check Vehicle Status');
    console.log('2. Dispatch Vehicle');
    console.log('3. Returning Vehicle');
    console.log('4. Refuel Vehicle');
    console.log('5. Exit');
  };
  
  /**
   * Renders specialized instance data fields following custom conditional type polymorphism filters.
   * @param {(Car|Truck)} vehicle - The structural context node subject target processed for logging.
   */
  displayVehicleDetails(vehicle){
    console.log(`Vehicle ID: ${vehicle.id}`);
    console.log(`Type: ${vehicle.type}`);
    console.log(`Status: ${vehicle.isAvailable ? 'Available' : 'On Duty'}`);
    console.log(`Fuel: ${vehicle.fuel}%`);

    if (vehicle instanceof Car) {
      console.log(`Passenger Capacity: ${vehicle.passengerCapacity} ${vehicle.passengerCapacity === 1 ? 'Person' : 'People'}`);
    } else if (vehicle instanceof Truck) {
      console.log(`Cargo Capacity: ${vehicle.cargoCapacity} Kg`);
    }
  }
  
  /**
   * Prints registration query failure logs.
   * @param {string} id - Unregistered context token processed from workflows.
   */
  displayInvalidId(id){
    console.log(`Vehicle with id ${id} has not found.`);
  };
  
  /**
   * Logs entry processing anomalies regarding command inputs outside numerical boundaries.
   * @param {number} choice - Out-of-bounds parameter option evaluated from streams.
   */
  displayInvalidChoice(choice){
    console.log('Please enter the correct menu!');
  };
  
  /**
   * Displays log verifications for clean dispatch workflows.
   * @param {string} id - Authenticated instance identity token target.
   */
  displaySuccessDispatchVehicle(id){
    console.log(`Vehicle "${id}" successfully dispatched for delivery!`)
  };
  
  /**
   * Renders operational blocks caused by validation parameter failures or resource bounds constraints.
   * @param {string} id - Active instance code reference.
   * @param {string} reason - Text log tracking exception causes.
   */
  displayFailDispatchVehicle(id, reason){
    console.log(`Vehicle "${id}" failed to be dispatched!\nReason: ${reason}`);
  };
  
  /**
   * Prints gate check-in success logs for units returning to base arrays.
   * @param {string} id - Validated identity registration track key.
   */
  displaySuccessReturningVehicle(id){
    console.log(`Vehicle "${id}" successfuly returned!`)
  };
  
  /**
   * Displays check-in exceptions for units already residing within inactive inventories.
   * @param {string} id - Redundant identifier target.
   */
  displayFailreturningVehicle(id){
    console.log(`Vehicle "${id}" is not dispatched!`)
  };
  
  /**
   * Confirms replenishment success operations.
   * @param {string} id - Restored target identification tag.
   */
  displaySuccessRefuel(id){
    console.log(`Vehicle "${id}" successfully refueled`);
  };
  
  /**
   * Rejects runtime resource operations if subject limits maintain absolute capacities.
   * @param {string} id - Identity key mapping to fully fueled elements.
   */
  displayFailrefuel(id){
    console.log(`Vehicle "${id}" fuel is full.`)
  };
}

/**
 * @class PromptView
 * @description Specialized stream handler targeting console parameter intake formatting operations.
 */
class PromptView{
  /**
   * Gathers raw registry identification parameter input strings.
   * @returns {string} Text record parameter mapped directly from standard input query flows.
   */
  vehicleIdInput(){
    return rl.question('Enter Vehicle ID (e.g., C01, T01): ');
  }
  
  /**
   * Captures chosen menu routing indices and outputs numerical primitive transformations.
   * @returns {number} Standard parsed value mapping option configurations.
   */
  choiceInput(){
    return Number(rl.question('Enter a choice: '));
  };
}

/**
 * @class FleetController
 * @description System core pipeline orchestrator linking models to visual layouts and managing iterative states.
 */
class FleetController{
  /**
   * @param {Array<{id: string, passengerCapacity: number}>} carsData - Master array configuration template dataset for Cars.
   * @param {Array<{id: string, cargoCapacity: number}>} trucksdata - Master array configuration template dataset for Trucks.
   */
  constructor(carsData, trucksdata){
    /** @private {FleetModel} */
    this._model = new FleetModel();
    /** @private {FleetView} */
    this._view = new FleetView();
    /** @private {PromptView} */
    this._promptView = new PromptView();

    this._model.generateCars(carsData);
    this._model.generateTrucks(trucksdata);
  }
  
  /**
   * Loops application stream inputs until search tags evaluate successfully inside dataset limits.
   * @returns {string} Validated reference locator string.
   */
  validateInputId(){
    while(true){
      const inputId = this._promptView.vehicleIdInput();
      if (!this._model.hasVehicle(inputId)){
        this._view.displayInvalidId(inputId);
        continue;
      }
      return inputId;
    }
  }
  
  /**
   * Initializes persistent system processing runtime instances.
   * Handles multi-level flow mapping across operational control branches.
   */
  initialize(){
    while(true){
      const inputId = this.validateInputId();
      const vehicle = this._model.getVehicle(inputId);
      let choice;
      do{
        console.log('');
        this._view.displayMenu();
        choice = this._promptView.choiceInput();

        switch (choice){
          case Menu.CHECK_VEHICLE_STATUS:
            this._view.displayVehicleDetails(vehicle);
            break;
          case Menu.DISPATCH_VEHICLE:
            if (!vehicle.isAvailable){
              this._view.displayFailDispatchVehicle(vehicle.id, 'Vehicle is currently on Duty.');
            } else if (vehicle.fuel < 20){
              this._view.displayFailDispatchVehicle(vehicle.id, 'Not enough fuel (less than 20%)');
            } else {
              vehicle.isAvailable = false;
              vehicle.fuel -= 20;
              this._view.displaySuccessDispatchVehicle(vehicle.id);
            }
            break;
          case Menu.RETURN_VEHICLE:
            if (vehicle.isAvailable){
              this._view.displayFailreturningVehicle(vehicle.id);
            } else {
              vehicle.isAvailable = true;
              vehicle.fuel = Math.max(0, vehicle.fuel - 15);
              this._view.displaySuccessReturningVehicle(vehicle.id);
            }
            break;
          case Menu.REFUEL_VEHICLE:
            if (vehicle.fuel === 100){
              this._view.displayFailrefuel(vehicle.id);
            } else {
              vehicle.fuel = 100;
              this._view.displaySuccessRefuel(vehicle.id);
            }
            break;
          case Menu.EXIT:
            console.log('Returning to vehicle selection...');
            break;
          default:
            this._view.displayInvalidChoice(choice);
        }
        console.log('');
      } while (choice !== Menu.EXIT)
    }
  }
}

// Data Array Sets Definitions
const cars = [
  {id: 'C-01', passengerCapacity: 4,}, 
  {id: 'C-02', passengerCapacity: 8,}, 
  {id: 'C-03', passengerCapacity: 2,}
];
const trucks = [
  {id: 'T-01', cargoCapacity: 5000,},
  {id: 'T-02', cargoCapacity: 10_000,},
  {id: 'T-03', cargoCapacity: 15_000,}
]

// Pipeline Instantiation and Execution Trigger Block
const controller = new FleetController(cars, trucks);
controller.initialize();