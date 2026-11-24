const defibrillatorRawData = [
  // Lolos uji (Kalibrasi masih baru, waktu charge cepat)
  { id: 'DFB-01', modelName: 'LifePak 15', lastCalibrationStr: '2025-11-15', maxEnergyJoules: 360, chargeTimeSeconds: 3 },
  // GAGAL UJI: CalibrationExpiredError (Terakhir kalibrasi awal 2025, sudah lewat 1 tahun dari Juli 2026)
  { id: 'DFB-02', modelName: 'Zoll AED Plus', lastCalibrationStr: '2025-02-10', maxEnergyJoules: 200, chargeTimeSeconds: 4 },
  // GAGAL UJI: DefectiveDeviceError (Waktu charge 7 detik, terlalu lama/cacat untuk standar ICU)
  { id: 'DFB-03', modelName: 'Philips HeartStart', lastCalibrationStr: '2026-03-01', maxEnergyJoules: 150, chargeTimeSeconds: 7 }
];

const ventilatorRawData = [
  // Lolos uji (Kalibrasi aman, kadar oksigen tinggi 95%)
  { id: 'VNT-01', modelName: 'Puritan Bennett 980', lastCalibrationStr: '2025-08-20', oxygenConcentrationPct: 95, isTurbineActive: true },
  // GAGAL UJI: DefectiveDeviceError (Kadar oksigen hanya 85%, tidak layak untuk ruang Isolasi)
  { id: 'VNT-02', modelName: 'Hamilton-G5', lastCalibrationStr: '2026-01-10', oxygenConcentrationPct: 85, isTurbineActive: true }
];

module.exports = {
  defibrillatorRawData,
  ventilatorRawData,
}