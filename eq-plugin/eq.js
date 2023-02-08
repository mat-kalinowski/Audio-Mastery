// MAIN EQ VARIABLE
var eq = {
    yourBands : [],
    drawValues : [],
    PI2 : Math["PI"] * 2,
    pointerRadius : 12,
    pointerDrag : -1,
    touchTwoFingerStartValue : -1,
    qMin : 0.5,
    qMax : 3,
    gainMin : -12,
    gainMax : 12,
    gap : 0,
    rate : 96E3,
    samples : 1E3,
    lastHz : 22E3,
    canvasWidth : 0,
    canvasHeight : 0,
    offsetX : 0,
    offsetY : 0,
    bandOnFocus : 0,
    meterUpdate : ![],
    isDown : ![],
    isTouchdown : ![],
    firstLoad : !![],
    bypass : !![],
    yourFilters : {},
    gameYourGain : null,
    yourAnalyser : null,
    freqDataMap : {
      your : [],
      diff : []
    },
    freqRunner : {
      timegap : 10,
      count : 300
    },
    filters : {
      lowpass : 0,
      highpass : 1,
      bandpass : 2,
      peaking : 3,
      notch : 4,
      lowshelf : 5,
      highshelf : 6
    }
};

var full_band_name = {
  LC : 'highpass',
  LS : "lowshelf",
  PK : 'peaking',
  HS : "highshelf",
  HC : 'lowpass'
};

var dbMax = 16;
var minHZscale = 16;
var totalOctavas = 10.5;
var canvas;
var ctx;
var meter;
var result;
var totalSections = 12;
var peakingLength = 1;
  