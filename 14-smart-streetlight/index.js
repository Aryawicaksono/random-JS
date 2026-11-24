'use strict';

const rl = require('readline-sync');

class StreetLight {
  constructor(id, type, location, lumensPerWatt){
    Object.defineProperties(this, {
      id: {value: id, enumerable: true, configurable: true},
      type: {value: type, enumerable: true, configurable: true},
    });
    this.location = location;
    this.lumensPerWatt = lumensPerWatt;
  }
}

class ResidentialLights extends StreetLight{ 
  constructor(id, location, lumensPerWatt, autoDimming){
    super(id, 'residential', location, lumensPerWatt);
    this.autoDimming = autoDimming;
  }
}
 class HighwayLights extends StreetLight{
  constructor(id, location, lumensPerWatt,solarPanelCapacityWatts){
    super(id, 'highway', location, lumensPerWatt);
    this.solarPanelCapacityWatts = solarPanelCapacityWatts;
  }
 }

 class StreetLightModel{
  constructor(){
    this._streetLights = new Map();
  }
  getStreetLights(){
    return this._streetLights;
  }
  generateResidentialLights(residentialLights){
    for (const resLight of residentialLights){
      const light = new ResidentialLights(resLight.id, resLight.location, resLight.lumensPerWatt, resLight.autoDimming);
      this._streetLights.set( light.id, light);
    }
  }
  generateHighwayLights(highwayLights){
    for (const hiLight of highwayLights){
      const light = new HighwayLights(hiLight.id, hiLight.location,hiLight.lumensPerWatt, hiLight.solarPanelCapacityWatts);
      this._streetLights.set(light.id, light);
    }
  }
  filterStreetLights(minLumensPerWatt){
    const filteredStreetLights = new Map();
    const streetLights = this.getStreetLights();

    for (const [id, light] of streetLights){
      if (light.lumensPerWatt >= minLumensPerWatt){
        filteredStreetLights.set(id, light)
      }
    }
    return filteredStreetLights;
  }
 }

class StreetLightView{
  displayHeader(){
    console.log('=========================================');
    console.log('   SMART CITY STREETLIGHT IoT SYSTEM');
    console.log('=========================================');
  }
  displayMatchedStreetLight(matchedStreetLights){
    console.log('ACTIVE MANIFEST: ' +
      `[ ${matchedStreetLights.size} ${matchedStreetLights.size > 1 ? 'Lights' : 'Light'}` + 
      ' successfully assigned to this zone ]');
    console.log('-----------------------------------------------------');
    for (const light of matchedStreetLights.values()){
      console.log(`- ID          : ${light.id}`);
      console.log(`  Type        : ${light.type}`);
      console.log(`  Location    : ${light.location}`);
      console.log(`  Efficiency  : ${light.lumensPerWatt} Lm/W`);
      if (light instanceof ResidentialLights){
        console.log(`  Auto Dimming: ${light.autoDimming ? 'YES' : 'NO'}`);
      } else if (light instanceof HighwayLights){
        console.log(`  Solar Panel : ${light.solarPanelCapacityWatts === 0 ? 'NO SOLAR PANEL' : light.solarPanelCapacityWatts} Watts`);
      }
    }
  }
  displayUnmatchedStreetLight(){
    console.log('NO MATCH DATA.')
  }
  displayInvalidInput(message){
    console.log(`INVALID INPUT! ${message}`);
  }
  displayExitLog(){
    console.log('Thank you for using Smart City System. Goodbye!');
  }
}

class Prompt{
  inputZoneType(zones){
    return rl.question(`Enter Maintenance Zone Type (${zones.join('/')}): `).trim().toUpperCase().replaceAll(' ', '_');
  }
  inputMinLumensPerWatt(){
    return Number(rl.question('Enter Minimum Lumens Per Watt Efficiency (Lm/W): '));
  }
  inputExit(){
    return rl.question('Press Enter to connect another zone, or type "exit" to quit: ').trim().toUpperCase();
  }
}

class StreetLightController{
  constructor(){
    this._model = new StreetLightModel();
    this._view = new StreetLightView();
    this._prompt = new Prompt();
    this._model.generateResidentialLights(residentialLights)
    this._model.generateHighwayLights(highwayLights);
  }
  validateZoneInput(){
    while(true){
      const zoneInput = this._prompt.inputZoneType(zones);
      if (zoneInput !== 'RESIDENTIAL_ZONE' && zoneInput !== 'HIGHWAY_ZONE') {
        this._view.displayInvalidInput('Please enter correct input.');
        continue;
      }
      return zoneInput;
    }
  }
  validateMinLumensPerWattInput(zoneInput){
    while (true){
      const minLumensPerWattInput = this._prompt.inputMinLumensPerWatt();
      if (isNaN(minLumensPerWattInput) || minLumensPerWattInput <= 0 || minLumensPerWattInput > 250 ){
        this._view.displayInvalidInput('Please enter correct input as number and more than 0.');
        continue;
      }
      if (zoneInput === 'RESIDENTIAL_ZONE'){
        if (minLumensPerWattInput < 70){
          this._view.displayInvalidInput(`Minimum Lumens/Watt ise exceeded ${zoneInput} capacity.`);
          continue;
        }
      }
      if (zoneInput === 'HIGHWAY_ZONE'){
        if (minLumensPerWattInput < 100){
          this._view.displayInvalidInput(`Minimum Lumens/Watt ise exceeded ${zoneInput} capacity.`)
          continue;
        }
      }
      return minLumensPerWattInput;
    }
  }
  matchingFilteredStreetLights(zoneInput, minLumensPerWattInput){
    const filteredList = this._model.filterStreetLights(minLumensPerWattInput);
    const matchedList = new Map();
    for (const [id, light] of filteredList){
      if (zoneInput === 'RESIDENTIAL_ZONE' && light instanceof ResidentialLights){
        matchedList.set(id, light);
      } else if (zoneInput === 'HIGHWAY_ZONE' && light instanceof HighwayLights){
        matchedList.set(id, light)
      }
    }
    return matchedList;
  }
  exitingSystem(){
    let isExit = false;
    const exitInput = this._prompt.inputExit();
    if (exitInput === 'EXIT'){
      isExit = true;
    }
    return isExit;
  }
  initialize(){
    while(true){
      this._view.displayHeader();
      const zoneTypeInput = this.validateZoneInput();
      const minLumensPerWattInput = this.validateMinLumensPerWattInput(zoneTypeInput);
      console.log('');
      const matchedList = this.matchingFilteredStreetLights(zoneTypeInput, minLumensPerWattInput);
      if (matchedList.size === 0){
        this._view.displayUnmatchedStreetLight();
      } else {
        this._view.displayMatchedStreetLight(matchedList);
      }
      const isExit = this.exitingSystem();
      if (isExit){
        this._view.displayExitLog();
        break;
      }
    }
  }
}

const zones = ['RESIDENTIAL_ZONE', 'HIGHWAY_ZONE'];
const residentialLights = [
  { id: 'LGT-01', location: 'Jl. Anggrek Blok C', lumensPerWatt: 90, autoDimming: true },
  { id: 'LGT-02', location: 'Gang Melati 2', lumensPerWatt: 75, autoDimming: false }
];

const highwayLights = [
  { id: 'HWY-01', location: 'Tol JORR KM 14', lumensPerWatt: 140, solarPanelCapacityWatts: 120 },
  { id: 'HWY-02', location: 'Ring Road Utara Kav 9', lumensPerWatt: 110, solarPanelCapacityWatts: 0 }
];
const controller = new StreetLightController();
controller.initialize();