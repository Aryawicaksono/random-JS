const rl = require('readline-sync');

class ParkingSystemView{ 
  displayHeader(){
    console.log('\n==============================');
    console.log('     SMART PARKING SYSTEM     ');
    console.log('==============================');
  }
  displayParkingSlots(slotsArray){
    for (let i = 0; i < slotsArray.length; i++){
      console.log(`Slot ${i + 1}: [ ${slotsArray[i] !== null? slotsArray[i] : 'EMPTY'} ]`)
    }
    console.log('------------------------------')
  }
  mainMenu(){
    console.log('\n1. Park Car');
    console.log('2. Remove Car');
    console.log('3. Live Status');
    console.log('4. Exit');
    return Number(rl.question('Enter your choice (1-4): '));
  }
  menuHeadLine(menu){
    console.log(`\n== ${menu} ==`);
  }
  askSlotNumber(maxSlot){
    return Number(rl.question(`Enter Slot Number ( 1 -${maxSlot}): `));
  }
  readLicensePlate(){
    const plate = rl.question('Enter car license plate: ').toUpperCase();
    console.log('');
    return plate;
  }
  errorMessage(message){
    console.log(`ERROR: ${message}`);
  }
  successMessage(message){
    console.log(`SUCESS! ${message}`);
  }
  waiting(){
    rl.question('Press [ENTER] to continue... ');
  }
}

module.exports = ParkingSystemView;