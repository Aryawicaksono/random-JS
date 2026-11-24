'use strict';

const rl = require('readline-sync');
const { DefibrillatorDevice, VentilatorDevice } = require('./device');

class Display {
  constructor() {
    this.lineLength = 65;
    this.gutterWidth = 4;
    // FIX: Masukkan karakter spasi ' ' agar pengulangan menghasilkan jarak tepi kiri
    this.gutter = ' '.repeat(this.gutterWidth);
  }

  displayHeader() {
    const header = 'BIOMEDICAL IoT DEVICE INSPECTION SYSTEM';
    const startWidth = Math.trunc((this.lineLength - header.length) / 2);
    
    // FIX: Langsung cetak menggunakan console.log + aplikasikan sistem gutter horizontal
    console.log('='.repeat(this.lineLength));
    console.log(`${' '.repeat(startWidth)}${header}`);
    console.log('='.repeat(this.lineLength));
  }

  displayInspectionStart() {
    // FIX: Gunakan console.log dan pasang gutter di depan teks log
    console.log(`\n${this.gutter}[SYSTEM LOG - INSPECTION UNDERWAY...]`);
  }

  displayAlert(deviceId, alertMessage) {
    // FIX: Gunakan console.log dan pasang gutter di depan teks alert
    console.log(`${this.gutter}⚠️ ALERT: Device ${deviceId} failed inspection!`);
    console.log(`${this.gutter}   Reason: ${alertMessage}`);
  }

  displayAllocationManifest(matchedMap, wardType) {
    // FIX: Tambahkan gutter spasi di depan teks manifes utama
    console.log(`\n${this.gutter}✅ ALLOCATION MANIFEST: [ ${matchedMap.size} ${matchedMap.size === 1 ? 'Device' : 'Devices'} safely deployed to ${wardType} ]`);
    console.log('-'.repeat(this.lineLength));

    // FIX: Tambahkan tanda kurung () pada .values() agar data Map dapat diiterasi
    for (const dev of matchedMap.values()) {
      // FIX: Sesuaikan nama properti lastCalibrationDate (Satu huruf L pada Calibration)
      const dateStr = dev.lastCalibrationDate.toISOString().split('T')[0];
      
      console.log(`${this.gutter}- ID           : ${dev.id}`);
      console.log(`${this.gutter}  Model        : ${dev.modelName}`);
      console.log(`${this.gutter}  Type         : ${dev.type}`);
      console.log(`${this.gutter}  Calibrated   : ${dateStr}`);

      if (dev instanceof DefibrillatorDevice) {
        // FIX: Sesuaikan properti maxEnergyJoules dan chargeTimeSeconds sesuai arsitektur data.js
        console.log(`${this.gutter}  Max Energy   : ${dev.maxEnergyJoules} Joules | Charge Time: ${dev.chargeTimeSeconds} sec`);
      } else if (dev instanceof VentilatorDevice) {
        // FIX: Ubah format cetak agar rapi dan dinamis
        console.log(`${this.gutter}  O2 Levels    : ${dev.oxygenConcentrationPct}% | Turbine: ${dev.isTurbineActive ? 'ACTIVE' : 'OFF'}`);
      }
      console.log('-'.repeat(this.lineLength));
    }
  }

  displayInvalidInput(message) {
    // FIX: Gunakan console.log + gutter pembatas
    console.log(`${this.gutter}❌ INVALID INPUT! ${message}`);
  }

  displayExitLog() {
    // FIX: Gunakan console.log + gutter pembatas
    console.log(`${this.gutter}Thank you for using Biomedical Inspection System. Goodbye!`);
  }

  wardInput() {
    // Prompt input tidak membutuhkan spasi gutter agar kursor ketikan menempel rapi di kiri terminal
    return rl.question('Enter Target Medical Ward (ICU/ISOLATION): ').trim().toUpperCase();
  }

  exitInput() {
    return rl.question('Press Enter to inspect another ward, or type "exit" to quit: ').trim().toUpperCase();
  }
}

module.exports = Display;