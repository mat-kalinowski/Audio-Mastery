'use strict';

// MAIN EQ VARIABLE
var eq = {
  yourBands : [],
  originalBands : [],
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
  lastMeterEvent : 0,
  bandOnFocus : 0,
  meterUpdate : ![],
  isDown : ![],
  isTouchdown : ![],
  firstLoad : !![],
  bypass : !![],
  yourFilters : {},
  originalFilters : {},
  gameYourGain : null,
  gameOriginalGain : null,
  originalAnalyser : null,
  yourAnalyser : null,
  freqDataMap : {
    original : [],
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

var dbMax = 16;
var minHZscale = 16;
var totalOctavas = 10.5;
var canvas;
var ctx;
var meter;
var result;
var totalSections = 12;
var perfectPercent = 75;
var percentAccuracy = 40;
var deviation = 1800;
var peakingLength = 1;

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
    freq : 1E3,
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
    freq : 9E3,
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
    freq : 16E3,
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

function yOnCanvas(data) {;
  return eq["canvasHeight"] / 2 + data / dbMax * 0.5 * eq['canvasHeight'] * -1;
}

function xOnCanvas(value) {;
  return value == 0 ? eq['gap'] : eq["canvasWidth"] * (Math['log'](value / minHZscale) / Math['log'](Math['pow'](2, totalOctavas)) * 100) / 100 + eq['gap'];
}

function drawYGrid() {;
  ctx['beginPath']();
  ctx['font'] = 'normal 11px Arial';
  ctx['fillStyle'] = '#999';
  ctx["textAlign"] = 'right';

  ctx['fontWeight'] = 100;
  ctx['setLineDash']([]);
  ctx['strokeStyle'] = '#777';

  ctx["lineWidth"] = 0.5;
  var which = [18, 12, 6, 0, -6, -12, -18];
  $['each'](which, function(canCreateDiscussions, text) {
    ctx["moveTo"](xOnCanvas(0), yOnCanvas(text));
    ctx['lineTo'](eq["canvasWidth"] - 20, yOnCanvas(text));
    ctx['fillText'](text, eq['canvasWidth'], yOnCanvas(text) + 3);
  });
  ctx["stroke"]();
}

function drawXGrid() {
  ctx["beginPath"]();
  ctx['font'] = 'normal 11px Arial';
  ctx["fillStyle"] = mobile ? '#111' : "#999";
  ctx['textAlign'] = 'center';

  ctx['fontWeight'] = 100;
  ctx['setLineDash']([]);
  ctx['strokeStyle'] = "#333";

  ctx['lineWidth'] = 0.5;
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
  $['each'](which, function(left, canCreateDiscussions) {
    var orig = eq['canvasWidth'] * hzToPosition(left) / 100 + eq['gap'];
    if (canCreateDiscussions) {
      ctx['fillText'](formatHzLabel(left), orig, eq["canvasHeight"] - 7);
    }
    ctx['moveTo'](orig, 20);
    ctx['lineTo'](orig, eq['canvasHeight'] - 20);
  });
  ctx['stroke']();
}

// eq['yourBands']["push"]({
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
//
// DRAWING ACTUAL EQ CURVE
function drawFilter(bands, bandId, paramName) {
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
  bandChart['canvas_ctx']['moveTo'](xOnCanvas(0), yOnCanvas(0));

  bandChart["draw"] = function() {
    bandChart['canvas_ctx']['beginPath']();
    bandChart['canvas_ctx']['lineWidth'] = 0.5;
    bandChart['canvas_ctx']["setLineDash"]([]);
    bandChart['canvas_ctx']["strokeStyle"] = strokeColors[paramName];
    bandChart['canvas_ctx']['fillStyle'] = fillColors[paramName];
    bandChart["canvas_ctx"]['moveTo'](0, yOnCanvas(0));
    var currSample = 1;

    for (; currSample <= eq["samples"]; currSample++) {
      var sampleRate = currSample / eq["samples"];
      var hzFrequency = positionToHz(sampleRate);
      var yCurve = bands[bandId]["filter"]["log_result"](hzFrequency);
      var yPoint = yOnCanvas(yCurve);
      var xPoint = xOnCanvas(hzFrequency);

      bandChart['canvas_ctx']['lineTo'](xPoint, yPoint);

      if (xPoint > lastXPoint) {
        bandChart['canvas_ctx']['lineTo'](xPoint, yOnCanvas(0));
        break;
      }
    }

    bandChart["canvas_ctx"]['closePath']();
    bandChart['canvas_ctx']['stroke']();
    bandChart['canvas_ctx']['fill']();
  };
}

// bandId, for example: transparent
function initFilter(bands, bandIndex) {;
  // ex: d = bands['PK']['filter']
  console.log(bandIndex)
  console.log(bandIndex)

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

  d['configure'] = function(y, a, fromModel, kw, mapping_val) {
    d['functions'] = [d['f_lowpass'], d['f_highpass'], d['f_bandpass'], d['f_peak'], d['f_notch'], d['f_lowshelf'], d['f_highshelf']];
    d['reset']();
    d["Q"] = kw == 0 ? 1e-9 : kw;
    d["type"] = y;
    d['sample_rate'] = fromModel;
    d["gainDB"] = mapping_val;
    d['reconfigure'](a);
  };

  d['reconfigure'] = function(fromModel) {
  
    d['freq'] = fromModel;
    var precision = Math['pow'](10, d["gainDB"] / 40);
  
    var value = 2 * Math["PI"] * fromModel / d['sample_rate'];
    var items = Math["sin"](value);
    var minyMin = Math["cos"](value);
  
    var expectedPageCount = items / (2 * d["Q"]);
    var GET_AUTH_URL_TIMEOUT = Math['sqrt'](precision + precision);
    d['functions'][d['type']](precision, value, items, minyMin, expectedPageCount, GET_AUTH_URL_TIMEOUT);
    d["b0"] /= d["a0"];
    d["b1"] /= d["a0"];
    d["b2"] /= d["a0"];
    d["a1"] /= d["a0"];
    d["a2"] /= d["a0"];
  };

  d["f_bandpass"] = function(canCreateDiscussions, isSlidingUp, dontForceConstraints, green, diff, forceExecution) {
    d["b0"] = diff;
    d["b1"] = 0;
    d["b2"] = -diff;
    d["a0"] = 1 + diff;
    d["a1"] = -2 * green;
    d["a2"] = 1 - diff;
  };

  d['f_lowpass'] = function(canCreateDiscussions, isSlidingUp, dontForceConstraints, diff, i, forceExecution) {
    d["b0"] = (1 - diff) / 2;
    d["b1"] = 1 - diff;
    d["b2"] = (1 - diff) / 2;
    d["a0"] = 1 + i;
    d["a1"] = -2 * diff;
    d["a2"] = 1 - i;
  };

  d["f_highpass"] = function(canCreateDiscussions, isSlidingUp, dontForceConstraints, green, diff, forceExecution) {
    d["b0"] = (1 + green) / 2;
    d["b1"] = -(1 + green);
    d["b2"] = (1 + green) / 2;
    d["a0"] = 1 + diff;
    d["a1"] = -2 * green;
    d["a2"] = 1 - diff;
  };

  d["f_notch"] = function(canCreateDiscussions, isSlidingUp, dontForceConstraints, green, diff, forceExecution) {
    d["b0"] = 1;
    d["b1"] = -2 * green;
    d["b2"] = 1;
    d["a0"] = 1 + diff;
    d["a1"] = -2 * green;
    d["a2"] = 1 - diff;
  };

  d["f_peak"] = function(daysInterval, dontForceConstraints, forceExecution, green, mmCoreSecondsDay, mmCoreSecondsYear) {
    d["b0"] = 1 + mmCoreSecondsDay * daysInterval;
    d["b1"] = -2 * green;
    d["b2"] = 1 - mmCoreSecondsDay * daysInterval;
    d["a0"] = 1 + mmCoreSecondsDay / daysInterval;
    d["a1"] = -2 * green;
    d["a2"] = 1 - mmCoreSecondsDay / daysInterval;
  };

  d['f_lowshelf'] = function(lumB, isSlidingUp, daysInterval, sin, mmCoreSecondsYear, mmCoreSecondsDay) {
    d["b0"] = lumB * (lumB + 1 - (lumB - 1) * sin + mmCoreSecondsDay * daysInterval);
    d["b1"] = 2 * lumB * (lumB - 1 - (lumB + 1) * sin);
    d["b2"] = lumB * (lumB + 1 - (lumB - 1) * sin - mmCoreSecondsDay * daysInterval);
    d["a0"] = lumB + 1 + (lumB - 1) * sin + mmCoreSecondsDay * daysInterval;
    d["a1"] = -2 * (lumB - 1 + (lumB + 1) * sin);
    d["a2"] = lumB + 1 + (lumB - 1) * sin - mmCoreSecondsDay * daysInterval;
  };

  d['f_highshelf'] = function(lumB, isSlidingUp, daysInterval, sin, mmCoreSecondsYear, mmCoreSecondsDay) {
    d["b0"] = lumB * (lumB + 1 + (lumB - 1) * sin + mmCoreSecondsDay * daysInterval);
    d["b1"] = -2 * lumB * (lumB - 1 + (lumB + 1) * sin);
    d["b2"] = lumB * (lumB + 1 + (lumB - 1) * sin - mmCoreSecondsDay * daysInterval);
    d["a0"] = lumB + 1 - (lumB - 1) * sin + mmCoreSecondsDay * daysInterval;
    d["a1"] = 2 * (lumB - 1 - (lumB + 1) * sin);
    d["a2"] = lumB + 1 - (lumB - 1) * sin - mmCoreSecondsDay * daysInterval;
  };
 
  d['result'] = function(canCreateDiscussions) {
    var _0x3ac9ce = Math["pow"](Math['sin'](2 * Math["PI"] * canCreateDiscussions / (2 * d['sample_rate'])), 2);
  
    var value = (Math['pow'](d["b0"] + d["b1"] + d["b2"], 2) - 4 * (d["b0"] * d["b1"] + 4 * d["b0"] * d["b2"] + d["b1"] * d["b2"]) * _0x3ac9ce + 16 * d["b0"] * d["b2"] * _0x3ac9ce * _0x3ac9ce) / (Math['pow'](1 + d["a1"] + d["a2"], 2) - 4 * (d["a1"] + 4 * d["a2"] + d["a1"] * d["a2"]) * _0x3ac9ce + 16 * d["a2"] * _0x3ac9ce * _0x3ac9ce);
    return value = value < 0 ? 0 : value, Math["sqrt"](value);
  };

  d['log_result'] = function(n) {
    var newFlex;
    try {
    
      newFlex = 20 * Math["log10"](d['result'](n));
    } catch (_0x4a1b24) {
    
      newFlex = -100;
    }
    return (!isFinite(newFlex) || isNaN(newFlex)) && (newFlex = -100), newFlex;
  };

  d['constants'] = function() {
    return [d["a1"], d["a2"], d["b0"], d["b1"], d["b2"]];
  };
  d['filter'] = function(q) {
  
    var newMouse = d["b0"] * q + d["b1"] * d["x1"] + d["b2"] * d["x2"] - d["a1"] * d["y1"] - d["a2"] * d["y2"];
    return d["x2"] = d["x1"], d["x1"] = d["x"], d["y2"] = d["y1"], d["y1"] = newMouse, newMouse;
  };
}

// paramName, ex : transparent
function eqSetup(bands, paramName) {
  // eq['yourBands']["push"]({
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
  $['each'](bands, function(key, value) {
    if (value["state"] == "on") {
      // initialize mathematical equations for given band
      console.log(key)
      initFilter(bands, key);
      value['filter']['create']();

      // paramName, for example: 'transparent'
      drawFilter(bands, key, paramName);
      value["chart"]['draw']();
    }
  });
}

function redrawGrid() {
  ctx["clearRect"](0, 0, eq['canvasWidth'], eq['canvasHeight']);
  drawYGrid();
  drawXGrid();
}

// setup mouse click handler functions
function drawGrid() {
  canvas = document['createElement']('canvas');
  eq['canvasWidth'] = $('#main-canvas')['width']();
  eq["canvasHeight"] = $('#main-canvas')['height']();
  canvas['width'] = eq['canvasWidth'];
  canvas['height'] = eq['canvasHeight'];

  ctx = canvas['getContext']("2d");
  ctx['clearRect'](0, 0, eq['canvasWidth'], eq['canvasHeight']);
  canvas['addEventListener']("wheel", handleMouseWheel);

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

  $("#main-canvas")['html'](canvas);
  eq["offsetX"] = $(canvas)['offset']()['left'];
  eq["offsetY"] = $(canvas)['offset']()['top'];
}

function drawZeroLine() {;
  var orig = xOnCanvas(eq["lastHz"]);
  ctx['beginPath']();

  ctx['lineWidth'] = 1;
  ctx['setLineDash']([]);
  ctx["strokeStyle"] = '#000';
  ctx['moveTo'](0, yOnCanvas(0));
  ctx['lineTo'](orig, yOnCanvas(0));
  ctx['closePath']();
  ctx["stroke"]();
}

function drawMidLine(url, key) {;
  var a1 = xOnCanvas(eq['lastHz']);
  var params = {
    color : 'rgba(255,255,0,.8)',
    wrong : 'rgba(237,61,61,.3)',
    correct : 'rgba(55,132,55,.3)',
    perfect : 'rgba(105,175,115,.5)',
    gray : 'rgba(200,200,200,.5)',
    transparent : 'rgba(0,0,0,0)'
  };
  ctx["beginPath"]();

  ctx['lineWidth'] = 3;
  ctx['setLineDash']([]);
  ctx['strokeStyle'] = params[key];

  var area_sum = 1;
  for (; area_sum <= eq['samples']; area_sum++) {
  
    var re_pba_css = area_sum / eq['samples'];
    var d = positionToHz(re_pba_css);
  
    var x = 0;
    $['each'](url, function(canCreateDiscussions, settings) {
      if (settings['state'] == "on") {
        x = x + settings["filter"]["log_result"](d);
      }
    });
    var x1 = yOnCanvas(x);
    var x0 = xOnCanvas(d);
    ctx["lineTo"](x0, x1);
    if (x0 > a1) {
      break;
    }
  }
  ctx["stroke"]();
}

// draw main mid screen line
function drawMidBypass() {;
  var orig = xOnCanvas(eq["lastHz"]);
  ctx["beginPath"]();

  ctx['lineWidth'] = 3;
  ctx['strokeStyle'] = "#666";
  ctx['moveTo'](0, yOnCanvas(0));
  ctx['lineTo'](orig, yOnCanvas(0));
  ctx['closePath']();
  ctx["stroke"]();
}

function drawMidLineGap() {;
  var a1 = xOnCanvas(eq['lastHz']);
  ctx['beginPath']();

  ctx['lineWidth'] = 3;
  ctx['setLineDash']([5, 3]);
  ctx['strokeStyle'] = 'rgba(70,119,115,.8)';

  var area_sum = 1;
  for (; area_sum <= eq["samples"]; area_sum++) {
  
    var re_pba_css = area_sum / eq['samples'];
    var d = positionToHz(re_pba_css);
  
    var b = 0;
  
    var r = 0;
    $['each'](eq['yourBands'], function(canCreateDiscussions, data) {
      if (data["state"] == "on") {
        r = r + data["filter"]['log_result'](d);
      }
    });
    $['each'](eq['originalBands'], function(canCreateDiscussions, data) {
      if (data["state"] == "on") {
        b = b + data['filter']['log_result'](d);
      }
    });
  
    var i = b - r;
    var y = yOnCanvas(i);
    var x0 = xOnCanvas(d);
    ctx["lineTo"](x0, y);
    if (x0 > a1) {
      break;
    }
  }
  ctx['stroke']();
}

function drawBandValues(elems) {;
  var hints = {
    0 : "HC",
    1 : "LC",
    2 : "Bandpass",
    3 : "PK",
    4 : 'Notch',
    5 : "LS",
    6 : "HS"
  };
  $['each'](elems, function(canCreateDiscussions, params) {
    if (params['state'] == "on") {
      var _0x416b05 = xOnCanvas(params["freq"]);
      var _0x30c0cd = yOnCanvas(params["gain"]);
      var orig = formatHzLabel(params['freq']);
      var plotWidth = Math["round"](params['gain'] * 10) / 10 + ' dB';
      var left = Math["round"](params["q"] * 10) / 10 + " Q";
      var currentElement = hints[params['filter_id']];
      ctx['fillStyle'] = "rgba(220,220,220,1)";
      ctx['font'] = '14px Arial';
      ctx['textAlign'] = 'right';
      ctx['fillText'](orig, params['freq'] >= 12E3 ? _0x416b05 - 25 : _0x416b05 + 65, params['gain'] >= 0 ? _0x30c0cd - 15 : _0x30c0cd + 15);
      if (params['filter_id'] == 3 || params['filter_id'] == 5 || params['filter_id'] == 6) {
        ctx['fillText'](plotWidth, params['freq'] >= 12E3 ? _0x416b05 - 25 : _0x416b05 + 65, params['gain'] >= 0 ? _0x30c0cd : _0x30c0cd + 30);
      }
      if (params['filter_id'] == 3) {
        ctx['fillText'](left, params['freq'] >= 12E3 ? _0x416b05 - 25 : _0x416b05 + 65, params['gain'] >= 0 ? _0x30c0cd + 15 : _0x30c0cd + 45);
      }
    }
  });
}

function SwitchEQ() {
  var artistTrack = gameContext['currentTime'];
  gameMasterGain['gain']['setValueAtTime'](1, artistTrack);
  $('#question')['hide']();

  $('.bypass-btn')['attr']("bypass", 'off');
  $('.compare-btn')["attr"]('side', "right");
  $('[eq]')["attr"]('bypass', 'off')["attr"]('original', 'off');
  eq["gameYourGain"]['gain']['setValueAtTime'](1, artistTrack);

  updateMultiband();
  redrawGrid();
  eqSetup(eq['yourBands'], 'color');
  drawZeroLine();
  drawMidLine(eq['yourBands'], 'color');
  drawPointers(eq['yourBands']);
  drawBandValues(eq['yourBands']);
}


function scaleBetween(toTop, index, step, fromTop, type) {;
  var number = (step - index) * (toTop - fromTop) / (type - fromTop) + index;
  return Math['round'](number * 100) / 100;
}

function toggleBand(value) {
  console.log("bandOnFocus")
  console.log(value)
  console.log("bandOnFocus")
  console.log(eq['yourBands'])

  eq['bandOnFocus'] = value;
  if (eq['yourBands'][eq["bandOnFocus"]]["state"] == 'off') {
    $('[band="' + eq['bandOnFocus'] + '"]')["attr"]('state', "on");
    eq["yourBands"][eq['bandOnFocus']]['state'] = "on";
  } else {
    $('[band="' + eq['bandOnFocus'] + '"]')["attr"]('state', 'off');
    eq['yourBands'][eq['bandOnFocus']]["state"] = 'off';
  }
  updateMultiband();
  SwitchEQ('yours');
}

function updateMultiband() {
  console.log("Updating multiband")
  console.log(eq["yourFilters"])
  var artistTrack = gameContext['currentTime'];
  $["each"](eq['yourBands'], function(key, params) {
    var GET_AUTH_URL_TIMEOUT = params['state'] == "on" ? params['gain'] : 0;
    var _0xe4408e = params['state'] == "on" ? params['filter_name'] : 'allpass';
    eq["yourFilters"][key]['type'] = _0xe4408e;
    eq['yourFilters'][key]['frequency']['setValueAtTime'](params["freq"], artistTrack);
    eq['yourFilters'][key]["Q"]['setValueAtTime'](params["q"], artistTrack);
    eq['yourFilters'][key]['gain']['setValueAtTime'](GET_AUTH_URL_TIMEOUT, artistTrack);
  });
}

function createFilters() {
  var currentTime = gameContext["currentTime"];

    // Go through array of bands
    for (var i = 0; i < eq['yourBands']["length"]; i++) {
      // set up AudioContext equalizer
      eq['yourFilters'][i] = gameContext['createBiquadFilter']();
      eq['yourFilters'][i]['type'] = eq['yourBands'][i]["state"] == "on" ? eq['yourBands'][i]['filter_name'] : "allpass";
      eq['yourFilters'][i]['frequency']['setValueAtTime'](eq["yourBands"][i]['freq'], currentTime);
      eq['yourFilters'][i]["Q"]["setValueAtTime"](eq['yourBands'][i]["q"], currentTime);
      eq['yourFilters'][i]["gain"]['setValueAtTime'](eq['yourBands'][i]["gain"], currentTime);
    }
  
}

function connectFilters() {
  // Check if there are filters added already
  if(Object.keys(eq['yourFilters']).length !== 0) {

    gameSourceNode['disconnect']()
    // Connect first filter to audio Node
    gameSourceNode['connect'](eq['yourFilters'][0]);
    for (var i = 0; i < eq["yourBands"]["length"] - 1; i++) {
      // Connect every filter to the next filter
      eq['yourFilters'][i]["connect"](eq['yourFilters'][i + 1]);
    }
    // Connect last filter to your gain
    eq['yourFilters'][eq['yourBands']["length"] - 1]['connect'](eq['gameYourGain']);
  }
  else {
    gameSourceNode["connect"](eq['gameYourGain']);
  }
}

// gameSourceNode -> filters... -> gameYourGain -> gameMasterGain -> destination

// Create equalizers in AudioContext
function buildSoundMap() {
  var attr2index = getLoopValues();
  var currentTime = gameContext["currentTime"];

  createFilters();

  gameMasterGain = gameContext["createGain"]();

  eq['gameYourGain'] = gameContext['createGain']();

  gameMasterGain['gain']['setValueAtTime'](1, currentTime);
  eq['gameYourGain']['gain']["setValueAtTime"](1, currentTime);
  
  connectFilters();

  eq['gameYourGain']['connect'](gameMasterGain);

  gameMasterGain['connect'](gameContext["destination"]);

  gameSourceNode['loop'] = !![];
  gameSourceNode['loopStart'] = attr2index['start'];
  gameSourceNode['loopEnd'] = attr2index['end'];

  eq['yourAnalyser'] = gameContext['createAnalyser']();
  eq['gameYourGain']["connect"](eq['yourAnalyser']);
  eq['originalAnalyser'] = gameContext['createAnalyser']();
}

function formatHz(val) {
  return Math["round"](val * 10) / 10;
}

function formatHzLabel(val) {;
  return val >= 1E3 ? Math['round'](val / 1E3 * 10) / 10 + ' kHz' : Math["round"](val * 10) / 10 + ' Hz';
}

function positionToDB(canCreateDiscussions) {
  return dbMax * 2 * (0.5 - canCreateDiscussions);
}

function positionToHz(regexp) {;
  return Math['round'](minHZscale * Math['pow'](2, totalOctavas * regexp));
}

function hzToPosition(deltaX) {;
  return Math['log'](deltaX / minHZscale) / Math['log'](Math["pow"](2, totalOctavas)) * 100;
}

function updateBandValue(name, s) {;
  var _incorrectComparisonFunctionResult = $(name)['attr']("knob");

  var j = 0;
  var addedPathkey = "";
  if (_incorrectComparisonFunctionResult == 'freq') {
  
    j = parseInt($(name)['attr']('value'));
  
    eq['yourBands'][eq['bandOnFocus']]["freq"] = j;
    addedPathkey = j['toFixed'](0);
  } else {
    if (_incorrectComparisonFunctionResult == "gain") {
      j = scaleBetween(s, eq['gainMin'], eq["gainMax"], 0, 100);
      eq['yourBands'][eq["bandOnFocus"]]['gain'] = j;
      addedPathkey = j['toFixed'](1);
    } else {
      if (_incorrectComparisonFunctionResult == "q") {
        j = scaleBetween(s, eq["qMin"], eq["qMax"], 0, 100);
        eq['yourBands'][eq['bandOnFocus']]["q"] = j;
        addedPathkey = j['toFixed'](1);
      }
    }
  }
  $(name)['find']('.knob-value')['html'](addedPathkey);
  SwitchEQ('yours');
}

function updateKnobValue(dayNames, switchTextDiv) {;

  eq['bandOnFocus'] = parseInt($(dayNames)['parents']('[band]')["attr"]("band"));
  updateBandValue(dayNames, switchTextDiv);
}

function updateKnobValues() {
  var reservedNamesMap = {
    0 : {
      freq : 30,
      gain : 0,
      q : 0.7
    },
    1 : {
      freq : 140,
      gain : 0,
      q : 1
    },
    2 : {
      freq : 440,
      gain : 0,
      q : 1
    },
    3 : {
      freq : 1E3,
      gain : 0,
      q : 1
    },
    4 : {
      freq : 3500,
      gain : 0,
      q : 1
    },
    5 : {
      freq : 9E3,
      gain : 0,
      q : 1
    },
    6 : {
      freq : 16E3,
      gain : 0,
      q : 0.7
    }
  };
  $('.knob-panel')['each'](function() {
    var name = $(this)['parents']("[band]")['attr']('band');
    var i = $(this)['attr']('knob');
    console.log(reservedNamesMap)
    console.log(name)

    console.log(reservedNamesMap[name])
    var variable = isset(eq['yourBands'][name]) ? eq['yourBands'][name][i] : reservedNamesMap[name][i];
    var artistTrack = i == 'gain' || i == "q" ? variable["toFixed"](1) : variable['toFixed'](0);
    $(this)["attr"]({
      y : 0,
      start : variable,
      value : variable
    });
    $(this)["find"](".knob-value")['html'](artistTrack);
  });
}

function drawPointers(elems) {;
  $['each'](elems, function(canCreateDiscussions, values) {
    var color = 'rgba(0,0,0,0)';
    var newValue = 'rgba(0,0,0,0)';
    if (values["state"] == "on") {
      color = 'rgba(' + values['color'] + ',1)';
      newValue = 'rgba(' + values['border'] + ',1)';
    }
    values["x"] = xOnCanvas(values['freq']);
    values["y"] = yOnCanvas(values['gain']);
    
    ctx["beginPath"]();
    ctx['arc'](xOnCanvas(values['freq']), yOnCanvas(values['gain']), eq["pointerRadius"], 0, eq['PI2']);
    ctx["closePath"]();
    ctx["fillStyle"] = color;
    ctx["fill"]();
  
    ctx['lineWidth'] = 2;
    ctx['strokeStyle'] = newValue;
    ctx['stroke']();
  });
}

function handleMouseDown(e, clientX, clientY) {;
  e["preventDefault"]();
  e['stopPropagation']();

  var clientX_border = parseInt(clientX - eq['offsetX']);
  var clientY_border = parseInt(clientY - eq['offsetY']);
  var value = -1;

  // check if eq was clicked on some eq band circle
  $["each"](eq["yourBands"], function(key, band_value) {
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

  event['preventDefault']();
  event['stopPropagation']();

  var axisX = positionToHz(parseInt(clientX - eq['offsetX']) / eq['canvasWidth']);
  var axisY = positionToDB(parseInt(clientY - eq['offsetY']) / eq['canvasHeight']);

  if (axisX > 20 && axisX < 19500) {
    eq["yourBands"][eq['pointerDrag']]['freq'] = axisX;
  }

  if (eq["yourBands"][eq['pointerDrag']]['filter_name'] != 'highpass' && eq['yourBands'][eq["pointerDrag"]]['filter_name'] != "lowpass" && axisY < 12.5 && axisY > -12.5) {
    eq["yourBands"][eq['pointerDrag']]["gain"] = axisY;
  }

  SwitchEQ("yours");
  updateKnobValues();
}

function handleQ(directionCode, partKeys) {;
  if (!eq['isDown'] || eq['yourBands'][eq['pointerDrag']]['band_id'] == 'highpass' || eq['yourBands'][eq["pointerDrag"]]["band_id"] == 'lowpass') {
    return;
  }
  if (directionCode == "up" && eq["yourBands"][eq["pointerDrag"]]["q"] < 5.9) {
    eq["yourBands"][eq['pointerDrag']]["q"] += partKeys;
  }
  if (directionCode == "down" && eq['yourBands'][eq['pointerDrag']]["q"] > 0.2) {
    eq["yourBands"][eq['pointerDrag']]["q"] -= partKeys;
  }
  SwitchEQ('yours');
  updateKnobValues();
}

function handleMouseWheel(myPreferences) {;
  if (myPreferences['deltaY'] >= 0) {
    handleQ("up", 0.1);
  } else {
    handleQ('down', 0.1);
  }
}

function handleMouseUp(event) {;
  event['preventDefault']();
  event['stopPropagation']();
  eq["isDown"] = ![];
}

function buildBandKnobs(elems) {
  $('[bands]')["html"]("");
  console.log("ELEMS")
  console.log(elems)
  console.log("ELEMS")
  $['each'](elems, function(key, sks) {
    var params = bands_definitions[sks["band_id"]];
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
    var scrollbarHelpers = '<div band="' + sks["id"] + '" state="' + sks['state'] + '">' + '<div toggle-band onclick="toggleBand(' + key + ');">' + '<div toggle-band-btn style="background: rgb(' + params["color"] + ')"></div>' + '<img toggle-band-img src="' + host + '/playground/eq/filter-50/' + params['filter_name'] + '.png"/>' + "</div>" + '<div class="controllers">' + escapedEmail + sitesusers + siteName + "</div>" + '</div>';
    $('[bands]')["append"](scrollbarHelpers);
  });
}


// Pass filterCode - short code LC, HS etc...
function addEqBand() { 
  console.log("Adding band")
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

  // we can have few peaking bands
  var fullBandName = bandName == 'peaking' ? 'peaking' + peakingLength : bandName;
  console.log("hey adding band")
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

  // clear bands for user to modify
  eq['yourBands']["push"]({
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
  // TODO: creats bugs - need to change
  // buildSoundMap();
  connectFilters();

  buildBandKnobs(eq['yourBands']);

  SwitchEQ('yours');
}

function volumeAudioProcess(event) {
  var window = event['inputBuffer']['getChannelData'](0);
  var f = window['length'];

  var number = 0;
  var value;

  var g = 0;
  for (; g < f; g++) {
    value = window[g];
    if (Math['abs'](value) >= this['clipLevel']) {
      this["clipping"] = !![];
      this['lastClip'] = window['performance']['now']();
    }
  
    number = number + value * value;
  }
  var result = Math['sqrt'](number / f);
  this['volume'] = Math["max"](result, this['volume'] * this["averaging"]);
  if (eq["lastMeterEvent"] % 3 === 0) {
    eq['meterUpdate'] = !![];
  } else {
    eq['meterUpdate'] = ![];
  }
  eq['lastMeterEvent'] = Math["floor"](event['playbackTime']);
  if (eq['meterUpdate']) {
  }
}

function keyIsPressed(canCreateDiscussions) {;
  if (canCreateDiscussions == 38) {
    handleQ("down", 0.1);
  }
  if (canCreateDiscussions == 40) {
    handleQ("up", 0.1);
  }
  if (canCreateDiscussions == 39) {
    SwitchEQ("yours");
  }
}

function AudioStart() {
  if (typeof gameSourceNode == "undefined") {
    loadGame();
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

function getRandomFrequencyBetween(premium_info) {
  var amount_in_currency_value = 0;
  for (; amount_in_currency_value < premium_info[0] || amount_in_currency_value > premium_info[1];) {
    amount_in_currency_value = getRandomFrequency();
  }
  return amount_in_currency_value;
}

// Get random option from given eq sets
function getWholeBetween(props) {;
  return Math['floor'](Math["random"]() * (Math["floor"](props[1]) - Math["ceil"](props[0]) + 1)) + Math['ceil'](props[0]);
}

function getFloatBetween(canCreateDiscussions) {;
  return parseFloat((Math['random']() * (canCreateDiscussions[1] - canCreateDiscussions[0]) + canCreateDiscussions[0])['toFixed'](1));
}

function setupEqPlugin() {
  $('.game-cover')['removeClass']("active");
  eq["yourBands"] = [];
  // setup eq bands/filters and its parameters in the global eq variable
  // createQuestion(scenario);
  
  
  // TEMPORARY COMMENTED - DO WE NEED THIS ?
  // updateKnobValues();

  $("#confirm-settings")['attr']('active', 'yes');

  // draw eq

  buildSoundMap();

  initKnobs();

  // Add html for knobs in the lower pane
  buildBandKnobs(eq['yourBands']);

  console.log("drawing grid")

  drawGrid();
  SwitchEQ('yours');
 
  // eq['yourBands']["push"]({
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
  eqSetup(eq['yourBands'], 'transparent');
}