var gridLinesColor = "#85694b";
var gridLineWidth = 0.75;
var eqHandleLineWidth = 1.5;
var gridFontStyle = 'normal 11px Arial';

var canvasHeight = 400;
var canvasWidth = 1090;

var playing = false;
var currentlySelectedBand = 'lowpass';
var peakingLength = 1;

var defaultPlaybackVolume = 0.6;
var dbMax = 22;
var minHZscale = 16;
var totalOctavas = 10.5;
var canvas;
var ctx;
var totalSections = 12;

// MAIN EQ VARIABLE
var eq = {
    bandsArray : [],
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
    samples : 1000,
    lastHz : 22E3,
    canvasWidth : 0,
    canvasHeight : 0,
    offsetX : 0,
    offsetY : 0,
    bandOnFocus : 0,
    isDown : ![],
    isTouchdown : ![],
    filtersArray : {},
    eqGain : null,
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

// Bands default parameters
var bands_definitions = {
  highpass : {
    id : 0,
    state : "off",
    color : '211,47,47',
    border : '244,129,129',
    filter_name : "highpass",
    filter_id : 1,
    freq : 30,
    gain : 0,
    q : 0.7,
    sensitivity_freq : 1,
    angle_freq : -139,
    angle_q : -130,
    angle_gain : 0,
    knobs : ["freq"],
    chart : {},
    filter : {}
  },
  lowshelf : {
    id : 1,
    state : 'off',
    color : '194,24,91',
    border : '247,111,163',
    filter_name : "lowshelf",
    filter_id : 5,
    freq : 140,
    gain : 0,
    q : 1,
    sensitivity_freq : 3,
    angle_freq : -139,
    angle_q : -118,
    angle_gain : 0,
    knobs : ['freq', "gain"],
    chart : {},
    filter : {}
  },
  peaking1 : {
    id : 2,
    state : 'off',
    color : '123,31,162',
    border : '199,117,234',
    filter_name : "peaking",
    filter_id : 3,
    freq : 440,
    gain : 0,
    q : 1,
    sensitivity_freq : 4,
    angle_freq : -133,
    angle_q : -124,
    angle_gain : 0,
    knobs : ['freq', "gain", "q"],
    chart : {},
    filter : {}
  },
  peaking2 : {
    id : 3,
    state : 'off',
    color : "25,118,210",
    border : '98,178,252',
    filter_name : 'peaking',
    filter_id : 3,
    freq : 1000,
    gain : 0,
    q : 1,
    sensitivity_freq : 7,
    angle_freq : -125,
    angle_q : -124,
    angle_gain : 140,
    knobs : ['freq', 'gain', "q"],
    chart : {},
    filter : {}
  },
  peaking3 : {
    id : 4,
    state : 'off',
    color : '0,151,167',
    border : "32,215,232",
    filter_name : 'peaking',
    filter_id : 3,
    freq : 3500,
    gain : 0,
    q : 1,
    sensitivity_freq : 10,
    angle_freq : -88,
    angle_q : -124,
    angle_gain : 0,
    knobs : ['freq', 'gain', "q"],
    chart : {},
    filter : {}
  },
  highshelf : {
    id : 5,
    state : 'off',
    color : '95,160,38',
    border : '156,221,99',
    filter_name : 'highshelf',
    filter_id : 6,
    freq : 9000,
    gain : 0,
    q : 1,
    sensitivity_freq : 13,
    angle_freq : -8,
    angle_q : -118,
    angle_gain : 0,
    knobs : ['freq', 'gain'],
    chart : {},
    filter : {}
  },
  lowpass : {
    id : 6,
    state : 'off',
    color : '247,140,69',
    border : '255,184,137',
    filter_name : 'lowpass',
    filter_id : 0,
    freq : 16000,
    gain : 0,
    q : 0.7,
    sensitivity_freq : 16,
    angle_freq : 109,
    angle_q : -140,
    angle_gain : 0,
    knobs : ["freq"],
    chart : {},
    filter : {}
  }
};

// Bootstrap utility function
function isset() {
  var a = arguments,
    l = a.length,
    i = 0,
    undef;
  if (l === 0) {
    throw new Error("Empty isset");
  }
  while (i !== l) {
    if (a[i] === undef || a[i] === null) {
      return false;
    }
    i++;
  }
  return true;
}

function AudioStart() {
  if (typeof gameSourceNode == "undefined") {
    loadEqPlugin();
  }

  if (gameContext.state === 'suspended') {
    gameContext.resume();
  }

  if (playing == false) {
    audioElement.play();
    playing=true;  
  }
}

function AudioStop() {
  if (playing == true) {
    audioElement.pause();
    playing=false;  
  }
}

// set up window.AudioContext
function loadAudioContext() {
  gameContext = new (window["AudioContext"] || window["webkitAudioContext"]);
  gameMasterGain = gameContext.createGain();

  // Load song from html audio element
  audioElement = document.querySelector('#song1');
  console.log(audioElement)
  gameSourceNode = gameContext.createMediaElementSource(audioElement);
  
  gameMasterGain["gain"].setValueAtTime(defaultPlaybackVolume, gameContext["currentTime"]);
}

function connectFilters() {
  // Check if there are filters added already
  if(Object.keys(eq['filtersArray']).length !== 0) {

    gameSourceNode.disconnect()
    gameSourceNode.connect(eq['filtersArray'][0]);

    for (var i = 0; i < eq["bandsArray"]["length"] - 1; i++) {
      // Connect every filter to the next filter
      eq['filtersArray'][i].connect(eq['filtersArray'][i + 1]);
    }
    // Connect last filter to gain
    eq['filtersArray'][eq['bandsArray']["length"] - 1].connect(eq['eqGain']);
  }
  else {
    gameSourceNode.connect(eq['eqGain']);
  }
}

function createFilters(currentTime) {
  var currentTime = gameContext["currentTime"];

  // Go through array of bands
  for (var i = 0; i < eq['bandsArray']["length"]; i++) {
    // set up AudioContext equalizer
    eq['filtersArray'][i] = gameContext.createBiquadFilter();
    eq['filtersArray'][i]['type'] = eq['bandsArray'][i]["state"] == "on" ? eq['bandsArray'][i]['filter_name'] : "allpass";
    eq['filtersArray'][i]['frequency'].setValueAtTime(eq["bandsArray"][i]['freq'], currentTime);
    eq['filtersArray'][i]["Q"].setValueAtTime(eq['bandsArray'][i]["q"], currentTime);
    eq['filtersArray'][i]["gain"].setValueAtTime(eq['bandsArray'][i]["gain"], currentTime);
  }
}

// Create equalizers in AudioContext
function connectAudioNodes() {
  var currentTime = gameContext["currentTime"];

  createFilters();

  gameMasterGain = gameContext.createGain();

  eq['eqGain'] = gameContext.createGain();

  gameMasterGain['gain'].setValueAtTime(1, currentTime);
  eq['eqGain']['gain'].setValueAtTime(1, currentTime);
  
  connectFilters();

  eq['eqGain'].connect(gameMasterGain);

  gameMasterGain.connect(gameContext["destination"]);

  eq['yourAnalyser'] = gameContext.createAnalyser();
  eq['eqGain'].connect(eq['yourAnalyser']);
}

function buildKnobs(bands) {
  $('[bands]').html("");

  $.each(bands, function(key, value) {
    var params = bands_definitions[value["band_id"]];
    var escapedEmail = "";
    var sitesusers = '<div class="empty-knob-panel"></div>';
    var siteName = '<div class="empty-knob-panel"></div>';
    escapedEmail = '<div class="knob-panel" knob="freq" state="inactive" sensitivity="' + params["sensitivity_freq"] + '" y="0" min="20" max="19100" base="' + params['freq'] + '" start="' + params["freq"] + '>" value="' + params['freq'] + '" ondblclick="knobBase(this);" onMouseDown="knobActivate(this, event);">' + '<div class="knob-controller" style="transform: rotate(' + params["angle_freq"] + 'deg)"><i class="fa fa-circle"></i></div>' + '<div class="knob-value" contentEditable="true" onBlur="knobValueBlur(this);" onFocus="knobValueFocus(this);" onKeyDown="knobKeydown(this, event);">' + params['freq'] + "</div>" + '<div class="knob-label">FREQ</div>' + "</div>";

    if (params['knobs']['includes']('gain')) {
      sitesusers = '<div class="knob-panel" knob="gain" state="inactive" sensitivity="0.05" y="0" min="-18" max="18" base="' + params['gain'] + '" start="' + params['gain'] + '" value="' + params['gain'] + '"ondblclick="knobBase(this);"onMouseDown="knobActivate(this, event);">' + '<div class="knob-controller" style="transform: rotate(' + params['angle_gain'] + 'deg)"><i class="fa fa-circle"></i></div>' + '<div class="knob-value" contentEditable="true" onBlur="knobValueBlur(this);" onFocus="knobValueFocus(this);" onKeyDown="knobKeydown(this, event);">' + params['gain'] + '</div>' + '<div class="knob-label">GAIN</div>' + '</div>';
    }

    if (params['knobs']['includes']("q")) {
      siteName = '<div class="knob-panel" knob="q" state="inactive" sensitivity="0.2" y="0" min="0.5" max="3" base="' + params["q"] + '" start="' + params["q"] + '" value="' + params["q"] + '" ondblclick="knobBase(this);" onMouseDown="knobActivate(this, event);">' + '<div class="knob-controller" style="transform: rotate(' + params["angle_q"] + 'deg)"><i class="fa fa-circle"></i></div>' + '<div class="knob-value" contentEditable="true" onBlur="knobValueBlur(this);" onFocus="knobValueFocus(this);" onKeyDown="knobKeydown(this, event);">' + params["q"] + '</div>' + '<div class="knob-label">Q</div>' + '</div>';
    }
    var scrollbarHelpers = '<div band="' + key + '" state="' + value['state'] + '">' + '<div toggle-band onclick="changeBandState(' + key + ');">' + '<div toggle-band-btn style="background: rgb(' + params["color"] + ')"></div>' + '<img toggle-band-img src="../eq-plugin/img/icons/figma-icons/' + params['filter_name'] + '.svg"/>' + "</div>" + '<div class="sliderContainer">' + escapedEmail + sitesusers + siteName + "</div>" + '</div>';
    $('[bands]').append(scrollbarHelpers);
  });
}

function formatHzLabel(val) {;
  return val >= 1E3 ? Math.round(val / 1E3 * 10) / 10 + ' kHz' : Math.round(val * 10) / 10 + ' Hz';
}

function hzToPosition(hzValue) {;
  return Math.log(hzValue / minHZscale) / Math.log(Math.pow(2, totalOctavas)) * 100;
}

function positionToHz(posValue) {
  return Math.round(minHZscale * Math.pow(2, totalOctavas * posValue));
}

function positionToDB(posValue) {
  return dbMax * 2 * (0.5 - posValue);
}

function yOnCanvas(data) {
  return eq["canvasHeight"] / 2 + data / dbMax * 0.5 * eq['canvasHeight'] * -1;
}

function xOnCanvas(value) {
  return value == 0 ? eq['gap'] : eq["canvasWidth"] * (Math.log(value / minHZscale) / Math.log(Math.pow(2, totalOctavas)) * 100) / 100 + eq['gap'];
}

// bandId, for example: transparent
function createFilterFuncs(bands, bandIndex) {;
  var d = bands[bandIndex]['filter'];
  d['LOWPASS'] = 0;
  d["HIGHPASS"] = 1;
  d['BANDPASS'] = 2;
  d['PEAK'] = 3;
  d['NOTCH'] = 4;
  d["LOWSHELF"] = 5;
  d['HIGHSHELF'] = 6;

  d["a0"] = 0;
  d["a1"] = 0;
  d["a2"] = 0;
  d["b0"] = 0;
  d["b1"] = 0;
  d["b2"] = 0;
  d["x1"] = 0;
  d["x2"] = 0;
  d["y1"] = 0;
  d["y2"] = 0;

  d["type"] = bands[bandIndex]['filter_id'];
  d['freq'] = bands[bandIndex]["freq"];
  d['sample_rate'] = eq['rate'];
  d["Q"] = bands[bandIndex]["q"];
  d["gainDB"] = bands[bandIndex]['gain'];

  d["create"] = function() {
    d['configure'](d['type'], d["freq"], d['sample_rate'], d["Q"], d['gainDB']);
  };

  d['reset'] = function() {
    d["x1"] = d["x2"] = d["y1"] = d["y2"] = 0;
  };

  d["frequency"] = function() {
    return d['freq'];
  };

  d['configure'] = function(type, frequency, sampleRate, quality, gainDB) {
    d['functions'] = [d['f_lowpass'], d['f_highpass'], d['f_bandpass'], d['f_peak'], d['f_notch'], d['f_lowshelf'], d['f_highshelf']];
    d['reset']();
    d["Q"] = quality == 0 ? 1e-9 : quality;
    d["type"] = type;
    d['sample_rate'] = sampleRate;
    d["gainDB"] = gainDB;
    d['reconfigure'](frequency);
  };

  d['reconfigure'] = function(frequency) {
  
    d['freq'] = frequency;
    var gainPow = Math.pow(10, d["gainDB"] / 40);
  
    var sampleRatio = 2 * Math["PI"] * frequency / d['sample_rate'];
    var sine = Math.sin(sampleRatio);
    var cosine = Math.cos(sampleRatio);
  
    var quality = sine / (2 * d["Q"]);
    var gainSqrt = Math['sqrt'](gainPow + gainPow);
    d['functions'][d['type']](gainPow, sampleRatio, sine, cosine, quality, gainSqrt);
    d["b0"] /= d["a0"];
    d["b1"] /= d["a0"];
    d["b2"] /= d["a0"];
    d["a1"] /= d["a0"];
    d["a2"] /= d["a0"];
  };

  d["f_bandpass"] = function(gainPow, sampleRatio, sine, cosine, quality, gainSqrt) {
    d["b0"] = quality;
    d["b1"] = 0;
    d["b2"] = -quality;
    d["a0"] = 1 + quality;
    d["a1"] = -2 * cosine;
    d["a2"] = 1 - quality;
  };

  d['f_lowpass'] = function(gainPow, sampleRatio, sine, cosine, quality, gainSqrt) {
    d["b0"] = (1 - cosine) / 2;
    d["b1"] = 1 - cosine;
    d["b2"] = (1 - cosine) / 2;
    d["a0"] = 1 + quality;
    d["a1"] = -2 * cosine;
    d["a2"] = 1 - quality;
  };

  d["f_highpass"] = function(gainPow, sampleRatio, sine, cosine, quality, gainSqrt) {
    d["b0"] = (1 + cosine) / 2;
    d["b1"] = -(1 + cosine);
    d["b2"] = (1 + cosine) / 2;
    d["a0"] = 1 + quality;
    d["a1"] = -2 * cosine;
    d["a2"] = 1 - quality;
  };

  d["f_notch"] = function(gainPow, sampleRatio, sine, cosine, quality, gainSqrt) {
    d["b0"] = 1;
    d["b1"] = -2 * cosine;
    d["b2"] = 1;
    d["a0"] = 1 + quality;
    d["a1"] = -2 * cosine;
    d["a2"] = 1 - quality;
  };

  d["f_peak"] = function(gainPow, sampleRatio, sine, cosine, quality, gainSqrt) {
    d["b0"] = 1 + quality * gainPow;
    d["b1"] = -2 * cosine;
    d["b2"] = 1 - quality * gainPow;
    d["a0"] = 1 + quality / gainPow;
    d["a1"] = -2 * cosine;
    d["a2"] = 1 - quality / gainPow;
  };

  d['f_lowshelf'] = function(gainPow, sampleRatio, sine, cosine, quality, gainSqrt) {
    d["b0"] = gainPow * (gainPow + 1 - (gainPow - 1) * cosine + gainSqrt * sine);
    d["b1"] = 2 * gainPow * (gainPow - 1 - (gainPow + 1) * cosine);
    d["b2"] = gainPow * (gainPow + 1 - (gainPow - 1) * cosine - gainSqrt * sine);
    d["a0"] = gainPow + 1 + (gainPow - 1) * cosine + gainSqrt * sine;
    d["a1"] = -2 * (gainPow - 1 + (gainPow + 1) * cosine);
    d["a2"] = gainPow + 1 + (gainPow - 1) * cosine - gainSqrt * sine;
  };

  d['f_highshelf'] = function(gainPow, sampleRatio, sine, cosine, quality, gainSqrt) {
    d["b0"] = gainPow * (gainPow + 1 + (gainPow - 1) * cosine + gainSqrt * sine);
    d["b1"] = -2 * gainPow * (gainPow - 1 + (gainPow + 1) * cosine);
    d["b2"] = gainPow * (gainPow + 1 + (gainPow - 1) * cosine - gainSqrt * sine);
    d["a0"] = gainPow + 1 - (gainPow - 1) * cosine + gainSqrt * sine;
    d["a1"] = 2 * (gainPow - 1 - (gainPow + 1) * cosine);
    d["a2"] = gainPow + 1 - (gainPow - 1) * cosine - gainSqrt * sine;
  };
 
  d['result'] = function(key) {
    var powResult = Math.pow(Math.sin(2 * Math["PI"] * key / (2 * d['sample_rate'])), 2);
  
    var value = (Math.pow(d["b0"] + d["b1"] + d["b2"], 2) - 4 * (d["b0"] * d["b1"] + 4 * d["b0"] * d["b2"] + d["b1"] * d["b2"]) * powResult + 16 * d["b0"] * d["b2"] * powResult * powResult) / (Math.pow(1 + d["a1"] + d["a2"], 2) - 4 * (d["a1"] + 4 * d["a2"] + d["a1"] * d["a2"]) * powResult + 16 * d["a2"] * powResult * powResult);
    return value = value < 0 ? 0 : value, Math["sqrt"](value);
  };

  d['log_result'] = function(n) {
    var logResult;
    try {
    
      logResult = 20 * Math.log10(d['result'](n));
    } catch (_0x4a1b24) {
    
      logResult = -100;
    }
    return (!isFinite(logResult) || isNaN(logResult)) && (logResult = -100), logResult;
  };

  d['constants'] = function() {
    return [d["a1"], d["a2"], d["b0"], d["b1"], d["b2"]];
  };
  d['filter'] = function(q) {
  
    var result = d["b0"] * q + d["b1"] * d["x1"] + d["b2"] * d["x2"] - d["a1"] * d["y1"] - d["a2"] * d["y2"];
    return d["x2"] = d["x1"], d["x1"] = d["x"], d["y2"] = d["y1"], d["y1"] = result, result;
  };
}

function drawFilterCurve(bands, bandId, paramName) {
  var strokeColors = {
    color : 'rgba(' + bands[bandId]['border'] + ',.6)',
    wrong : 'rgba(237,61,61,.3)',
    correct : 'rgba(55,132,55,.3)',
    perfect : 'rgba(105,175,115,.5)',
    gray : "rgba(200,200,200,.6)",
    transparent : 'rgba(0,0,0,0)'
  };

  var fillColors = {
    color : 'rgba(' + bands[bandId]['color'] + ',.6)',
    wrong : "rgba(252,83,83,.3)",
    correct : "rgba(85,168,85,.3)",
    perfect : 'rgba(105,175,115,.5)',
    gray : 'rgba(150,150,150,.3)',
    transparent : 'rgba(0,0,0,0)'
  };

  var bandChart = bands[bandId]['chart'];
  var lastXPoint = xOnCanvas(eq["lastHz"]);

  bandChart["canvas_ctx"] = ctx;
  bandChart['canvas_ctx'].moveTo(xOnCanvas(0), yOnCanvas(0));

  bandChart["draw"] = function() {
    bandChart['canvas_ctx'].beginPath();
    bandChart['canvas_ctx']['lineWidth'] = 0.5;
    bandChart['canvas_ctx'].setLineDash([]);
    bandChart['canvas_ctx']["strokeStyle"] = strokeColors[paramName];
    bandChart['canvas_ctx']['fillStyle'] = fillColors[paramName];
    bandChart["canvas_ctx"].moveTo(0, yOnCanvas(0));
    var currSample = 1;

    for (; currSample <= eq["samples"]; currSample++) {
      var sampleRate = currSample / eq["samples"];
      var hzFrequency = positionToHz(sampleRate);
      var yCurve = bands[bandId]["filter"]["log_result"](hzFrequency);
      var yPoint = yOnCanvas(yCurve);
      var xPoint = xOnCanvas(hzFrequency);

      bandChart['canvas_ctx'].lineTo(xPoint, yPoint);

      if (xPoint > lastXPoint) {
        bandChart['canvas_ctx'].lineTo(xPoint, yOnCanvas(0));
        break;
      }
    }

    bandChart["canvas_ctx"].closePath();
    bandChart['canvas_ctx'].stroke();
    bandChart['canvas_ctx']['fill']();
  };
}

// paramName, ex : transparent
function eqSetup(bands, paramName) {
  // eq['bandsArray']["push"]({
  //   id : PK,
  //   band_id : peaking,
  //   state : "on",
  //   color : data['color'],
  //   border : data["border"],
  //   filter_name : name,
  //   filter_id : data["filter_id"],
  //   freq : data["freq"],
  //   gain : data['gain'],
  //   q : data["q"],
  //   chart : {},
  //   filter : {},
  //   hint : ![]
  // });
  $.each(bands, function(key, value) {
    if (value["state"] == "on") {
      // initialize mathematical equations for all bands
      console.log(key)
      createFilterFuncs(bands, key);
      value['filter'].create();

      // paramName, for example: 'transparent'
      drawFilterCurve(bands, key, paramName);
      value["chart"].draw();
    }
  });
}


function drawYGrid() {;
  ctx.beginPath();
  ctx['font'] = gridFontStyle;
  ctx["textAlign"] = 'right';

  ctx['fillStyle'] = gridLinesColor;
  ctx['strokeStyle'] = gridLinesColor;
  ctx["lineWidth"] = gridLineWidth;

  ctx['fontWeight'] = 100;
  ctx.setLineDash([]);

  var which = [18, 12, 6, 0, -6, -12, -18];
  $.each(which, function(key, text) {
    ctx.moveTo(xOnCanvas(0), yOnCanvas(text));
    ctx.lineTo(eq["canvasWidth"] - 20, yOnCanvas(text));
    console.log(text)
    ctx.fillText(text, eq['canvasWidth'], yOnCanvas(text) + 3);
  });
  ctx.stroke();
}

function drawXGrid() {
  ctx.beginPath();
  ctx['font'] = gridFontStyle;
  ctx['textAlign'] = 'center';

  ctx["fillStyle"] = gridLinesColor;
  ctx['lineWidth'] = gridLineWidth;
  ctx['strokeStyle'] = gridLinesColor;

  ctx['fontWeight'] = 100;
  ctx.setLineDash([]);

  var which = {
    20 : !![],
    50 : !![],
    100 : !![],
    200 : !![],
    500 : !![],
    1E3 : !![],
    2E3 : !![],
    5E3 : !![],
    1E4 : !![],
    2E4 : !![]
  };
  $.each(which, function(left, key) {
    var orig = eq['canvasWidth'] * hzToPosition(left) / 100 + eq['gap'];
    if (key) {
      ctx.fillText(formatHzLabel(left), orig, eq["canvasHeight"] - 7);
    }
    ctx.moveTo(orig, 20);
    ctx.lineTo(orig, eq['canvasHeight'] - 20);
  });
  ctx.stroke();
}

function redrawGrid() {
  ctx.clearRect(0, 0, eq['canvasWidth'], eq['canvasHeight']);
  drawYGrid();
  drawXGrid();
}

function handleMouseDown(e, clientX, clientY) {;
  e.preventDefault();
  e.stopPropagation();

  var clientX_border = parseInt(clientX - eq['offsetX']);
  var clientY_border = parseInt(clientY - eq['offsetY']);
  var value = -1;

  // check if eq was clicked on some eq band circle
  $.each(eq["bandsArray"], function(key, band_value) {
    if (clientX_border >= band_value["x"] - eq['pointerRadius'] && clientX_border <= band_value["x"] + eq["pointerRadius"] && clientY_border >= band_value["y"] - eq['pointerRadius'] && clientY_border <= band_value["y"] + eq['pointerRadius']) {
      return value = key, ![];
    }
  });

  if (value >= 0) {
    // which band is being dragged
    eq['pointerDrag'] = value;
    // true
    eq["isDown"] = !![];
  }
}

function handleMouseMove(event, clientX, clientY) {
  // return if the mouse was not clicked before dragging
  if (!eq['isDown']) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  var axisX = positionToHz(parseInt(clientX - eq['offsetX']) / eq['canvasWidth']);
  var axisY = positionToDB(parseInt(clientY - eq['offsetY']) / eq['canvasHeight']);

  if (axisX > 20 && axisX < 19500) {
    eq["bandsArray"][eq['pointerDrag']]['freq'] = axisX;
  }

  if (eq["bandsArray"][eq['pointerDrag']]['filter_name'] != 'highpass' && eq['bandsArray'][eq["pointerDrag"]]['filter_name'] != "lowpass" && axisY < 12.5 && axisY > -12.5) {
    eq["bandsArray"][eq['pointerDrag']]["gain"] = axisY;
  }

  updateEQ();
  updateKnobs();
}

function handleMouseUp(event) {;
  event.preventDefault();
  event.stopPropagation();
  eq["isDown"] = ![];
}

function handleMouseWheel(qDiff) {;
  if (qDiff['deltaY'] >= 0) {
    handleQ("up", 0.1);
  } else {
    handleQ('down', 0.1);
  }
}

function handleQ(directionCode, partKeys) {;
  if (!eq['isDown'] || eq['bandsArray'][eq['pointerDrag']]['band_id'] == 'highpass' || eq['bandsArray'][eq["pointerDrag"]]["band_id"] == 'lowpass') {
    return;
  }
  if (directionCode == "up" && eq["bandsArray"][eq["pointerDrag"]]["q"] < 5.9) {
    eq["bandsArray"][eq['pointerDrag']]["q"] += partKeys;
  }
  if (directionCode == "down" && eq['bandsArray'][eq['pointerDrag']]["q"] > 0.2) {
    eq["bandsArray"][eq['pointerDrag']]["q"] -= partKeys;
  }
  updateEQ();
  updateKnobs();
}

// setup mouse click handler functions
function drawGrid() {

  canvas = document.createElement('canvas');

  eq['canvasWidth'] = canvasWidth;
  eq["canvasHeight"] = canvasHeight;

  canvas['width'] = eq['canvasWidth'];
  canvas['height'] = eq['canvasHeight'];

  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, eq['canvasWidth'], eq['canvasHeight']);
  canvas.addEventListener("wheel", handleMouseWheel);

  $(canvas)['mousedown'](function(e) {
    handleMouseDown(e, e['clientX'], e['clientY']);
  });
  $(canvas)['mousemove'](function(e) {
    handleMouseMove(e, e['clientX'], e["clientY"]);
  });
  $(canvas)['mouseup'](function(event) {
    handleMouseUp(event);
  });
  $(canvas)["on"]('touchstart', function(e) {
    handleMouseDown(e, e['originalEvent']['touches'][0]["clientX"], e['originalEvent']['touches'][0]['clientY']);
  });

  $(canvas)["on"]('touchmove', function(event) {
    if (event['originalEvent']['touches']['length'] == 2) {
    
      var value = event['originalEvent']['touches'][1]['clientX'] - event['originalEvent']['touches'][0]["clientX"];
      if (eq["touchTwoFingerStartValue"] == -1) {
      
        eq['touchTwoFingerStartValue'] = value;
      } else {
        if (value <= eq['touchTwoFingerStartValue']) {
          handleQ("up", 0.05);
        } else {
          handleQ("down", 0.05);
        }
      }
    } else {
      handleMouseMove(event, event['originalEvent']['touches'][0]['clientX'], event["originalEvent"]['touches'][0]["clientY"]);
    }
  });

  $(canvas)["on"]('touchend', function(event) {
  
    eq["touchTwoFingerStartValue"] = -1;
    handleMouseUp(event);
  });

  drawYGrid();
  drawXGrid();

  $("#eqCanvas").html(canvas);
  eq["offsetX"] = $(canvas).offset()['left'];
  eq["offsetY"] = $(canvas).offset()['top'];
}

function updateBand(name, s) {
  var knobElem = $(name).attr("knob");

  var j = 0;
  var knobHTML = "";
  if (knobElem == 'freq') {
  
    j = parseInt($(name).attr('value'));
  
    eq['bandsArray'][eq['bandOnFocus']]["freq"] = j;
    knobHTML = j.toFixed(0);
  } else {
    if (knobElem == "gain") {
      j = scaleBetween(s, eq['gainMin'], eq["gainMax"], 0, 100);
      eq['bandsArray'][eq["bandOnFocus"]]['gain'] = j;
      knobHTML = j.toFixed(1);
    } else {
      if (knobElem == "q") {
        j = scaleBetween(s, eq["qMin"], eq["qMax"], 0, 100);
        eq['bandsArray'][eq['bandOnFocus']]["q"] = j;
        knobHTML = j.toFixed(1);
      }
    }
  }
  $(name).find('.knob-value').html(knobHTML);
  updateEQ();
}

function scaleBetween(toTop, index, step, fromTop, type) {
  var number = (step - index) * (toTop - fromTop) / (type - fromTop) + index;
  return Math.round(number * 100) / 100;
}

function updateAllBands() {
  console.log("Updating multiband")
  console.log(eq["filtersArray"])
  var currentTime = gameContext['currentTime'];
  
  $.each(eq['bandsArray'], function(key, params) {
    var newGain = params['state'] == "on" ? params['gain'] : 0;
    var filterType = params['state'] == "on" ? params['filter_name'] : 'allpass';

    eq["filtersArray"][key]['type'] = filterType;
    eq['filtersArray'][key]['frequency'].setValueAtTime(params["freq"], currentTime);
    eq['filtersArray'][key]["Q"].setValueAtTime(params["q"], currentTime);
    eq['filtersArray'][key]['gain'].setValueAtTime(newGain, currentTime);
  });
}

function setupEqPlugin() {
  $('.eqCover').removeClass("active");
  eq["bandsArray"] = [];
  
  $("#confirm-settings").attr('active', 'yes');

  connectAudioNodes();

  initKnobs();

  // Add html for knobs in the lower pane
  buildKnobs(eq['bandsArray']);

  drawGrid();
  updateEQ();
 
  // eq['bandsArray']["push"]({
  //   id : PK,
  //   band_id : peaking,
  //   state : "on",
  //   color : data['color'],
  //   border : data["border"],
  //   filter_name : name,
  //   filter_id : data["filter_id"],
  //   freq : data["freq"],
  //   gain : data['gain'],
  //   q : data["q"],
  //   chart : {},
  //   filter : {},
  //   hint : ![]
  // });
  eqSetup(eq['bandsArray'], 'transparent');
}

function drawBandValues(elems) {
  $.each(elems, function(key, params) {
    if (params['state'] == "on") {
      var xPoint = xOnCanvas(params["freq"]);
      var yPoint = yOnCanvas(params["gain"]);
      var frequency = formatHzLabel(params['freq']);
      var dbLabel = Math.round(params['gain'] * 10) / 10 + ' dB';
      var qLabel = Math.round(params["q"] * 10) / 10 + " Q";

      ctx['fillStyle'] = "rgba(220,220,220,1)";
      ctx['font'] = '13px Arial';
      ctx['textAlign'] = 'right';
  
      ctx.fillText(frequency, params['freq'] >= 12E3 ? xPoint - 25 : xPoint + 65, params['gain'] >= 0 ? yPoint - 15 : yPoint + 15);

      if (params['filter_id'] == 3 || params['filter_id'] == 5 || params['filter_id'] == 6) {
        ctx.fillText(dbLabel, params['freq'] >= 12E3 ? xPoint - 25 : xPoint + 65, params['gain'] >= 0 ? yPoint : yPoint + 30);
      }
      if (params['filter_id'] == 3) {
        ctx.fillText(qLabel, params['freq'] >= 12E3 ? xPoint - 25 : xPoint + 65, params['gain'] >= 0 ? yPoint + 15 : yPoint + 45);
      }
    }
  });
}

function drawEqHandles(elems) {;
  $.each(elems, function(key, values) {
    // Handles are transparent by default
    var fillColor = 'rgba(0,0,0,0)';
    var strokeColor = 'rgba(0,0,0,0)';

    // Add color if they are not bypassed
    if (values["state"] == "on") {
      fillColor = 'rgba(' + values['color'] + ',1)';
      strokeColor = 'rgba(' + values['border'] + ',1)';
    }

    values["x"] = xOnCanvas(values['freq']);
    values["y"] = yOnCanvas(values['gain']);

    ctx.beginPath();
    ctx.arc(xOnCanvas(values['freq']), yOnCanvas(values['gain']), eq["pointerRadius"], 0, eq['PI2']);
    ctx.closePath();

    ctx["fillStyle"] = fillColor;
    ctx.fill();

    ctx['lineWidth'] = eqHandleLineWidth;
    ctx['strokeStyle'] = strokeColor;
    ctx.stroke();
  });
}

function updateEQ() {
  var currentTime = gameContext['currentTime'];
  gameMasterGain['gain'].setValueAtTime(1, currentTime);

  $('[eq]').attr('bypass', 'off').attr('original', 'off');
  eq["eqGain"]['gain'].setValueAtTime(1, currentTime);

  updateAllBands();
  redrawGrid();
  eqSetup(eq['bandsArray'], 'color');

  // Draw draggable EQ pointers
  drawEqHandles(eq['bandsArray']);
  drawBandValues(eq['bandsArray']);
}

function changeBandState(value) {
  console.log("bandOnFocus")
  console.log(value)
  console.log("bandOnFocus")
  console.log(eq['bandsArray'])

  eq['bandOnFocus'] = value;
  if (eq['bandsArray'][eq["bandOnFocus"]]["state"] == 'off') {
    $('[band="' + eq['bandOnFocus'] + '"]').attr('state', "on");
    eq["bandsArray"][eq['bandOnFocus']]['state'] = "on";
  } else {
    $('[band="' + eq['bandOnFocus'] + '"]').attr('state', 'off');
    eq['bandsArray'][eq['bandOnFocus']]["state"] = 'off';
  }

  updateAllBands();
  updateEQ();
}

function waitForStatus() {
  triggerInterval = setInterval(function() {
    try {
      // Audio files are loaded
      if (typeof gameSourceNode !== "undefined") {
        clearInterval(triggerInterval);
        setupEqPlugin();
      }
    } catch (previousState) {
      console["error"](previousState);
    }
  }, 300);
}

function loadEqPlugin() {
  $(".eqCover").removeClass("active");
  $("#eqLoader").addClass("active");

  // Load AudioContext 
  loadAudioContext();

  setTimeout(function() {
    waitForStatus();
  }, 800);
}

// Add new band of given type
function SelectBand(bandName, source) {
  $(".selected", "#bandsAdd").children().attr("src",`../eq-plugin/img/icons/figma-icons/${currentlySelectedBand}.svg`);
  $(".selected", "#bandsAdd").removeClass("selected");

  $(source).addClass("selected")
  $(source).children().attr("src",`../eq-plugin/img/icons/figma-icons/${bandName}-active.svg`);

  currentlySelectedBand = bandName
}


// Pass filterCode - short code LC, HS etc...
function addEqBand() { 
  var bandName =  currentlySelectedBand;

  // iterate over prototypes scenario array, for example:
  // "LC-N-N" : {
  //   deviation : 1800,
  //   options : {
  //     1 : [{
  //       filter_name : "LC",
  //       freq : [150, 1400],
  //       q : [0.7, 0.7],
  //       gain : [0, 0]
  //     }]
  //   }
  // },

  // We can have few peaking bands
  var fullBandName = bandName == 'peaking' ? 'peaking' + peakingLength : bandName;
  var data = bands_definitions[bandName];

  // GET BANDS DEFINITIONS, FOR EXAMPLE:
  // var bands_definitions = {
  //   highpass : {
  //     id : 0,
  //     state : "off",
  //     color : '211,47,47',
  //     border : '244,129,129',
  //     filter_name : "highpass",
  //     filter_id : 1,
  //     freq : 30,
  //     gain : 0,
  //     q : 0.7,
  //     sensitivity_freq : 1,
  //     angle_freq : -139,
  //     angle_q : -130,
  //     angle_gain : 0,
  //     knobs : ["freq"],
  //     chart : {},
  //     filter : {}
  //   },
  var data = bands_definitions[fullBandName];

  // Clear bands for user to modify
  eq['bandsArray']["push"]({
    id: data['id'],
    band_id : fullBandName,
    state : "on",
    color : data['color'],
    border : data["border"],
    filter_name : bandName,
    filter_id : data["filter_id"],
    freq : data["freq"],
    gain : data['gain'],
    q : data["q"],
    chart : {},
    filter : {},
    hint : ![]
  });

  if (bandName == "peaking") {
    peakingLength++;
  }

  createFilters();
  connectFilters();

  buildKnobs(eq['bandsArray']);
  updateEQ();
}
