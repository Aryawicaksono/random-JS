class ParkingSystemModel{
  constructor(slot){
    this._parkingSlots = new Array(slot).fill(null);
  }
  getParkingSlots = function(){
    return this._parkingSlots;
  };
  parkingCar = function(slotNumber, licensePlate){
    this._parkingSlots[slotNumber] = licensePlate;
  };
  leavingCar = function(licensePlate){
    const id =this._parkingSlots.findIndex(car => car === licensePlate);
    this._parkingSlots[id] = null;
  }
  occupiedSlot = function(slot){
    return this.getParkingSlots()[slot] !== null;
  }
}

module.exports = ParkingSystemModel;