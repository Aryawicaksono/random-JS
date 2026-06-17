const ParkingSystemModel = require('./Model');
const ParkingSystemView = require('./View');

const Menu = {
  'PARK_CAR': 1,
  'REMOVE_CAR': 2,
  'LIVE_STATUS': 3,
  'EXIT': 4,
};
const SLOTS = 5;

class ParkingSystemController{
  constructor(){
    this._model = new ParkingSystemModel(SLOTS);
    this._view = new ParkingSystemView();
  }
  initializeSystem(){
    const parkingSlots = this._model.getParkingSlots()
    this._view.displayHeader();
    this._view.displayParkingSlots(parkingSlots);
    let choice;
    do{
      choice = this._view.mainMenu();
      switch(choice){
        case Menu.PARK_CAR:
          let slotInput;
          while (true){
            console.log('');
            this._view.menuHeadLine('PARK CAR');
            slotInput = this._view.askSlotNumber(SLOTS)
          
            if (isNaN(slotInput) || slotInput < 1 || slotInput > SLOTS){
              this._view.errorMessage('Please insert the correct slot.')
              continue;
            } 
          
            if (this._model.occupiedSlot(slotInput - 1)){
              this._view.errorMessage(`Slot ${slotInput} already occupied!`);
              continue;
            }
            break; 
        }
          const slotIndex = slotInput - 1;
          const plateInput = this._view.readLicensePlate();
          this._model.parkingCar(slotIndex, plateInput);
          this._view.successMessage(`Car [${plateInput}] successfully parked at Slot ${slotInput}`)
          this._view.waiting();
          break;
        case Menu.REMOVE_CAR:
          this._view.menuHeadLine('REMOVE CAR');
          const carInput = this._view.readLicensePlate();
          const carExists = this._model.getParkingSlots().includes(carInput);
          if (!carExists){
            this._view.errorMessage(`Car with license plate "${carInput}" is not found inside`);
          } else {
            this._model.leavingCar(carInput);
            this._view.successMessage(`Car "${carInput}" has successfully leave the parking lot`)
            this._view.waiting()
          }
          break;
          case Menu.LIVE_STATUS:
            this._view.menuHeadLine('LIVE STATUS')
            this._view.displayParkingSlots(parkingSlots);
            break;
            case Menu.EXIT:
              break;
          default:
            this._view.errorMessage('Please press the correct input');
      }
    } while (choice !== Menu.EXIT)
      console.log('');
      this._view.successMessage('You succesfully logout.')
      this._view.waiting();
  }
}

module.exports = ParkingSystemController;