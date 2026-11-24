'use strict';

class CalibrationExpiredError extends Error{
  code;

  constructor(){
    super('Expired Device');
    if ('captureStackTrace' in Error){
      Error.captureStackTrace(this, CalibrationExpiredError);
    }
    this.code = 'EXPIRED_DEVICE';
  }
}

class DefectiveDeviceError extends Error{
  constructor(){
    super('Defective Device');
    if ('captureStackError' in Error){
      Error.captureStackTrace(this, DefectiveDeviceError);
    }
    this.code = 'DEFECTIVE_DEVICE';
  }
}

module.exports = {
  CalibrationExpiredError,
  DefectiveDeviceError
}