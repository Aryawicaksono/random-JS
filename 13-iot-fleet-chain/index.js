'use strict';

const rl = require('readline-sync');

/**
 * @class IoTDevice
 * @desc Base constructor representing a generic IoT device with read-only identifiers.
 * @param {string} id - The unique identifier of the device.
 * @param {string} IMEI - The International Mobile Equipment Identity number.
 * @param {string} type - The specific sub-category type of the device.
 * @param {number} batteryPct - Current battery percentage (0-100).
 */
function IoTDevice(id, IMEI, type, batteryPct){
  Object.defineProperties(this, {
    id: { value: id, enumerable: true, configurable: true},
    IMEI: { value: IMEI, enumerable: true, configurable: true},
  });
  this.type = type;
  this.batteryPct = batteryPct;
}

/**
 * @class VehicleTracker
 * @extends IoTDevice
 * @desc Constructor for standard fleet vehicle trackers.
 * @param {string} id - Device ID.
 * @param {string} IMEI - Device IMEI.
 * @param {string} [type] - Overriding device type, defaults to 'vehicle_tracker'.
 * @param {number} batteryPct - Battery level percentage.
 * @param {number} GPSAccuracyMeters - GPS precision radius in meters.
 */
function VehicleTracker(id, IMEI, type, batteryPct, GPSAccuracyMeters){
  IoTDevice.call(this, id, IMEI, type || 'vehicle_tracker', batteryPct);
  this.GPSAccuracyMeters = GPSAccuracyMeters;
}
// Set up prototype chain inheritance from IoTDevice
VehicleTracker.prototype = Object.create(IoTDevice.prototype, {
  constructor: {value: VehicleTracker, writable: true, configurable: true},
});

/**
 * @class ReeferTracker
 * @extends VehicleTracker
 * @desc Constructor for specialized cold-chain refrigeration container trackers.
 * @param {string} id - Device ID.
 * @param {string} IMEI - Device IMEI.
 * @param {number} batteryPct - Battery level percentage.
 * @param {number} GPSAccuracyMeters - GPS precision radius in meters.
 * @param {number} currentTempC - Current temperature inside the reefer unit in Celsius.
 * @param {string} compressorStatus - Operational state of the cooling compressor (e.g., 'ACTIVE', 'STANDBY').
 */
function ReeferTracker(id, IMEI, batteryPct, GPSAccuracyMeters, currentTempC, compressorStatus){
  VehicleTracker.call(this, id, IMEI, 'reefer_tracker', batteryPct, GPSAccuracyMeters);
  this.currentTempC = currentTempC;
  this.compressorStatus = compressorStatus;
}
// Set up prototype chain inheritance from VehicleTracker
ReeferTracker.prototype = Object.create(VehicleTracker.prototype, {
  constructor: {value: ReeferTracker, writable: true, configurable: true},
});

/**
 * @class IoTModel
 * @desc Component managing state, data populations, and business filtering rules.
 */
function IoTModel(){
  this._devices = new Map(); // Key-value store using Device ID as unique key
}

/**
 * @method getDevices
 * @returns {Map<string, Object>} Map containing all stored IoT devices.
 */
IoTModel.prototype.getDevices = function(){
  return this._devices;
};

/**
 * @method generateVehicleTrackers
 * @desc Hydrates the model by instantiating and saving standard trackers.
 * @param {Array<Object>} stdTrackers - Raw data array of standard trackers.
 */
IoTModel.prototype.generateVehicleTrackers = function(stdTrackers){
  for ( const stdTracker of stdTrackers){
    const tracker = new VehicleTracker(
      stdTracker.id, 
      stdTracker.IMEI, 
      stdTracker.type, 
      stdTracker.batteryPct, 
      stdTracker.GPSAccuracyMeters
    );
    this._devices.set(tracker.id, tracker);
  }
};

/**
 * @method generateReeferTrackers
 * @desc Hydrates the model by instantiating and saving specialized reefer trackers.
 * @param {Array<Object>} rfTrackers - Raw data array of reefer trackers.
 */
IoTModel.prototype.generateReeferTrackers = function(rfTrackers){
  for (const rfTracker of rfTrackers){
    const tracker = new ReeferTracker(
      rfTracker.id, 
      rfTracker.IMEI,
      rfTracker.batteryPct, 
      rfTracker.GPSAccuracyMeters,
      rfTracker.currentTempC,
      rfTracker.compressorStatus
    );
    this._devices.set(tracker.id, tracker);
  }
};

/**
 * @method filteredList
 * @desc Filters all system devices meeting a threshold battery constraint.
 * @param {number} requireBattery - Minimum required battery percentage.
 * @returns {Map<string, Object>} Filtered subset map of matching devices.
 */
IoTModel.prototype.filteredList = function (requireBattery){
  const devices = this.getDevices();
  const filteredDevices = new Map();
  for (const [id, dev] of devices){
    if( dev.batteryPct >= requireBattery){
      filteredDevices.set(id, dev);
    }
  }
  return filteredDevices;
}

/**
 * @class IoTView
 * @desc Component handling console user interface rendering and formatting.
 */
function IoTView(){}

/**
 * @method displayTitle
 * @desc Prints application banner/header to the terminal console.
 */
IoTView.prototype.displayTitle = function(){
  console.log('=========================================');
  console.log('AUTOMATED IoT FLEET MANAGEMENT SYSTEM');
  console.log('=========================================');
};

/**
 * @method displayMatchedList
 * @desc Renders formatted diagnostic information of matching assigned trackers.
 * @param {Map<string, Object>} matchList - Collection of devices allocating to vehicle.
 * @param {string} inputVehicleType - Selected string identifier of the truck.
 */
IoTView.prototype.displayMatchedList = function(matchList, inputVehicleType){
  console.log(`ONLINE MANIFEST: [ ${matchList.size} IoT Devices is safely allocated to this ${inputVehicleType}]`);
  console.log('----------------------------------------------------');
  for (const data of matchList.values()){
    console.log(`- ID          : ${data.id}`);
    console.log(`  Type        : ${data.type === 'vehicle_tracker' ? 'Vehicle Tracker' : 'Reefer Tracker (Cold Chain)'}`);
    console.log(`  IMEI        : ${data.IMEI}`)
    console.log(`  Battery     : ${data.batteryPct}%`)
    console.log(`  GPS Accuracy: ${data.GPSAccuracyMeters} meters`);
    // Polymorphic display check
    if (data instanceof ReeferTracker){
      console.log(`  Temperature : ${data.currentTempC}°C | Compressor: ${data.compressorStatus}`);
    }
    console.log('----------------------------------------------------');
  }
};

/**
 * @method displayUnmatchedList
 * @desc Prints warning logs when no hardware satisfies criteria parameters.
 */
IoTView.prototype.displayUnmatchedList = function(){
  console.log('UNMATCHING DATA...');
};

/**
 * @method invalidInput
 * @desc Renders customized bad-input alert runtime messages.
 * @param {string} message - Error details explaining validation failure.
 */
IoTView.prototype.invalidInput = function(message){
  console.log(`INVALID INPUT! ${message}`);
};

/**
 * @method displayExitLog
 * @desc Prints graceful standard closure appreciation messaging.
 */
IoTView.prototype.displayExitLog = function(){
  console.log('Thank you for using IoT Fleet System. Goodbye!');
}

/**
 * @class Prompt
 * @desc Interface wrapping sequential Synchronous Command Line input prompt questions.
 */
function Prompt(){}

/**
 * @method inputVehicleType
 * @param {Array<string>} vehicles - Allowed valid option configurations.
 * @returns {string} Untrimmed target vehicle type option inputs.
 */
Prompt.prototype.inputVehicleType = function(vehicles){
  return rl.question(`Enter Fleet Vehicle Type (${vehicles.join('/')}): `);
};

/**
 * @method inputReqBattery
 * @returns {number} Numeric conversion result value parsed from user string.
 */
Prompt.prototype.inputReqBattery = function(){
  return Number(rl.question('Enter Minimum Required Battery (%): '));
};

/**
 * @method exitInput
 * @returns {string} Normalized uppercase clean exit directive intent strings.
 */
Prompt.prototype.exitInput = function(){
  return rl.question('Press Enter to check another vehicle, or type "exit" to quit: ').trim().toUpperCase();
};

/**
 * @class IoTController
 * @desc Main Orchestrator unifying Views, Prompts, and underlying Device Domain Models.
 */
function IoTController(){
  this._model = new IoTModel();
  this._view = new IoTView();
  this._prompt = new Prompt();
  this._model.generateVehicleTrackers(standardTrackers);
  this._model.generateReeferTrackers(reeferTrackers);
}

/**
 * @method validateTypeVehicleInput
 * @desc Runs validation loops demanding clean valid options corresponding to fleet lists.
 * @returns {string} Sanitized underscore-spaced validated fleet options ('DRY_VAN'|'REEFER_TRUCK').
 */
IoTController.prototype.validateTypeVehicleInput = function(){
  while(true){
    const vehicleTypeInput = this._prompt.inputVehicleType(vehicles).trim().toUpperCase().replaceAll(' ', '_');
    if (vehicleTypeInput !== 'DRY_VAN' && vehicleTypeInput !== 'REEFER_TRUCK'){
      this._view.invalidInput('Please enter corrected vehicle type.');
      continue;
    }
    return vehicleTypeInput;
  }
}

/**
 * @method validateBatteryReqInput
 * @desc Asserts logical boundaries preventing values exceeding scale capacities or industry norms.
 * @param {string} vehicleTypeInput - Selected type specifying safe custom threshold minimum constraints.
 * @returns {number} Validated acceptable battery capacity benchmarks.
 */
IoTController.prototype.validateBatteryReqInput = function(vehicleTypeInput){
  while(true){
    const batteryReqInput = this._prompt.inputReqBattery();
    if (isNaN(batteryReqInput) || batteryReqInput <= 0 || batteryReqInput > 100){
      this._view.invalidInput('Please Enter correct input.' );
      continue;
    };
    if (vehicleTypeInput === 'DRY_VAN'){
      if (batteryReqInput < 40){
        this._view.invalidInput(`This ${vehicleTypeInput} minimum battery cannot less than 40%`);
        continue;
      }
    }
    if (vehicleTypeInput === 'REEFER_TRUCK'){
      if (batteryReqInput < 50){
        this._view.invalidInput(`This ${vehicleTypeInput} minimum battery cannot less than 50%`);
        continue;
      }
    }
    return batteryReqInput;
  }
};

/**
 * @method matchingList
 * @desc Coordinates assignment compatibility filters based on logistics constraints.
 * @param {string} vehicleTypeInput - Targeted deployment platform truck type identifier.
 * @param {number} batteryreq - Calculated power limitation benchmark bounds.
 * @returns {Map<string, Object>} Assigned devices mapped specifically matching operational scope.
 */
IoTController.prototype.matchingList = function(vehicleTypeInput, batteryreq){
  const filteredList = this._model.filteredList(batteryreq);
  const matchedList = new Map();
  for (const [id, data] of filteredList){
    if (vehicleTypeInput === 'DRY_VAN'){
      matchedList.set(id, data); // Dry vans can allocate standard or reefer hardware
    } else if (vehicleTypeInput === 'REEFER_TRUCK' && data instanceof ReeferTracker){
      matchedList.set(id, data); // Reefer trucks strictly dictate cold chain telemetry hardware
    }
  }
  return matchedList;
};

/**
 * @method isExit
 * @desc Evaluations whether system execution should break or re-loop.
 * @returns {boolean} True if termination keyword is validated.
 */
IoTController.prototype.isExit = function(){
  let isExit = false;
  const exitInput = this._prompt.exitInput();
  if (exitInput === 'EXIT'){
    isExit = true;
  }
  return isExit;
}

/**
 * @method startSytem
 * @desc Initializes application entry event loops processing continuous user commands.
 */
IoTController.prototype.startSytem = function(){
  while(true){
    this._view.displayTitle();
    const vehicleTypeInput = this.validateTypeVehicleInput();
    const reqBatteryInput = this.validateBatteryReqInput(vehicleTypeInput);
    const matchedList = this.matchingList(vehicleTypeInput, reqBatteryInput);
    if (matchedList.size === 0){
      this._view.displayUnmatchedList();
    } else {
      this._view.displayMatchedList(matchedList, vehicleTypeInput);
    }
    const isExit = this.isExit();
    if (isExit){
      this._view.displayExitLog();
      break;
    }
  }
}

// Global Static Deployment Definitions & Hardcoded Seed Data Arrays
const vehicles = ['DRY_VAN', 'REEFER_TRUCK'];
const standardTrackers = [
  { id: 'TRK-01', IMEI: '860123-01', batteryPct: 85, GPSAccuracyMeters: 2 },
  { id: 'TRK-02', IMEI: '860123-02', batteryPct: 42, GPSAccuracyMeters: 5 }
];

const reeferTrackers = [
  { id: 'REF-01', IMEI: '860999-01', batteryPct: 90, GPSAccuracyMeters: 1, currentTempC: -18.5, compressorStatus: 'ACTIVE' },
  { id: 'REF-02', IMEI: '860999-02', batteryPct: 45, GPSAccuracyMeters: 3, currentTempC: 4.0, compressorStatus: 'STANDBY' }
];

// Initialize and start the application orchestrator controller
const controller = new IoTController();
controller.startSytem();