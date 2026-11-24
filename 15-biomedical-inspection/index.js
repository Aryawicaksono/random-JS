'use strict'

const {DefibrillatorDevice, VentilatorDevice} = require('./device');
const {CalibrationExpiredError, DefectiveDeviceError}= require('./error');
const Display = require('./display');
const {defibrillatorRawData, ventilatorRawData} = require('./data');

const currentDate = new Date('2026-07-09');

class BioMedical{
  constructor(){
    this._devices = new Map();
  }
  generateDevices(){
     for (const data of defibrillatorRawData){
      const dev =  new DefibrillatorDevice(
        data.id, 
        data.modelName, 
        data.lastCalibrationStr, 
        data.maxEnergyJoules, 
        data.chargeTimeSeconds
      )
      this._devices.set(dev.id, dev);
     }

     for ( const data of ventilatorRawData){
      const dev = new VentilatorDevice(
        data.id,
        data.modelName,
        data.lastCalibrationStr,
        data.oxygenConcentrationPct,
        data.isTurbineActive,
      )
      this._devices.set(dev.id, dev);
     }
  }
  getAllDevices(){
    return this._devices;
  }
}

const bioMedical = new BioMedical();
const display = new Display();

bioMedical.generateDevices();

function validateInput(){
  while (true){
    const input = display.wardInput();
    if (input !== 'ICU' && input !== 'ISOLATION'){
      display.displayInvalidInput('INVALID INPUT! Please try again')
      continue;
    }
    return input;
  }
}

function inspectAndAllocateDevices(wardType){
  const allDevices = bioMedical.getAllDevices();
  const approveddevices = new Map();

  display.displayInspectionStart();

  for (const [id, device] of allDevices){
    try{
      const diffInMs = currentDate - device.lastCalibrationStr;
      const diffInDays = diffInMs / (1000 * 24 * 60 *60);

      if (diffInDays > 365){
        throw new CalibrationExpiredError()
      }
      if (wardType === 'ICU' && device instanceof DefibrillatorDevice){
        if (device.chargeTimeInSeconds > 5){
          throw new DefectiveDeviceError();
        }
        approveddevices.set(device.id, device);
      } else if ( wardType === 'ISOLATION' && device instanceof VentilatorDevice){
        if (device.oxygenConcentrationPct < 90){
          throw new DefectiveDeviceError();
        }
        approveddevices.set(device.id, device);
      }
    } catch (err) {
      if (err.code === 'EXPIRED_DEVICE' || err.code === 'DEFECTIVE_DEVICE'){
        display.displayAlert(id, err.message);
      } else {
        throw error;
      }
    }
  }
  return approveddevices;
}

function initialize(){
  while (true){
    display.displayHeader();

    const wardType = validateInput();
    const finalManifest = inspectAndAllocateDevices(wardType);
    display.displayAllocationManifest(finalManifest,wardType);
    console.log('');
    const checkExit = display.exitInput();
    if (checkExit === 'EXIT'){
      display.displayExitLog();
      break;
    }
  }
}

initialize();