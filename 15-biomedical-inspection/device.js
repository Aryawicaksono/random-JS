// =========================================================================
// Di dalam file device.js
// =========================================================================

class MedicalDevice {
  // Pastikan urutannya: id, type, modelName, lastCalibrationStr
  constructor(id, type, modelName, lastCalibrationStr) {
    Object.defineProperties(this, {
      id: { value: id, enumerable: true, configurable: true },
      type: { value: type, enumerable: true, configurable: true }
    });
    this.modelName = modelName;
    
    // ✨ JANTUNG PERBAIKAN: Mengubah string menjadi Date object nyata
    this.lastCalibrationDate = new Date(lastCalibrationStr); 
  }
}

class DefibrillatorDevice extends MedicalDevice {
  // Urutan saat dipanggil super() harus pas mengirim ke induknya
  constructor(id, modelName, lastCalibrationStr, maxEnergyJoules, chargeTimeSeconds) {
    // Defibrillator otomatis mengirim type 'defibrillator' ke MedicalDevice
    super(id, 'defibrillator', modelName, lastCalibrationStr); 
    
    this.maxEnergyJoules = maxEnergyJoules;
    this.chargeTimeSeconds = chargeTimeSeconds;
  }
}

class VentilatorDevice extends MedicalDevice {
  constructor(id, modelName, lastCalibrationStr, oxygenConcentrationPct, isTurbineActive) {
    // Ventilator otomatis mengirim type 'ventilator' ke MedicalDevice
    super(id, 'ventilator', modelName, lastCalibrationStr);
    
    this.oxygenConcentrationPct = oxygenConcentrationPct;
    this.isTurbineActive = isTurbineActive;
  }
}

module.exports = { DefibrillatorDevice, VentilatorDevice };