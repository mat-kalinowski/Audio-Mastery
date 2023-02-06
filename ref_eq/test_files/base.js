'use strict';

var answerslog = [];
var accuracylog = [];
var tests;
var diff;
var defaultGameVolume = 0.6;
var pointsMultiplication;
var timeoutNext;
var compareBtnPressed = ![];
var canWait = ![];
var canContinue = ![];
var waitForNext = 1400;
var ctrlIsPressed = ![];
var altIsPressed = ![];
var bonus = [5, 10, 20, 35, 50, 80, 130];
var triggerInterval;
var gameMasterGain;
var gameBypassGain;
var gameUnpassGain;

// main AudioContext object of the app
var gameContext;
var gameBuffer;
var gameSourceNode;
var gameSound;
var gamePlayer;
var spriteMap = {};
var playing = false;
var currentlySelectedBand = 'highpass';

var audioElement;
var track;

function getPointMultiplier() {
  var keys = {
    1 : {
      diff : [1, 2, 4, 7, 13, 23, 41, 73, 130, 230, 370, 590, 950, 1500, 2250, 3150, 4150, 4800, 5400, 5900],
      point : 500,
      max : 5900
    },
    2 : {
      diff : [1, 1.6, 3, 5, 8.3, 14, 24, 41, 70, 120, 190, 300, 480, 750, 1200, 1750, 2350, 2850, 3300, 3700],
      point : 350,
      max : 3700
    }
  };
  return pr["currentDifficulty"] < 21 ? keys[pr["model"]["multiplier_set"]]["diff"][pr["currentDifficulty"] - 1] : (pr["currentDifficulty"] - 20) * keys[pr["model"]["multiplier_set"]]["point"] + keys[pr["model"]["multiplier_set"]]["max"];
}

function getLoopValues() {
  var i = Math["floor"](Math["random"]() * pr["sprite"]["vals"]["length"])["toString"]();
  var collectionID = 0;
  var end = 0;

  if (pr["sprite"]["vals"]["length"] > 0) {
    collectionID = parseInt(pr["sprite"]["vals"][i]["start"]) / 1E3;
    end = (parseInt(pr["sprite"]["vals"][i]["start"]) + parseInt(pr["sprite"]["vals"][i]["duration"])) / 1E3;
  } else {
    var number = Object["keys"](spriteMap)["length"];
    var indexLookupKey = Math["floor"](Math["random"]() * number);
    var data = spriteMap[Object["keys"](spriteMap)[indexLookupKey]];
    collectionID = data["start"];
    end = data["end"];
  }
  return {
    start : collectionID,
    end : end
  };
}

// set up window.AudioContext
function loadSprite() {
  // pr is set in test.html
  if (pr["sprite"] == null || isset(pr["sprite"]) && pr["sprite"]["length"] == 0) {
    gameBuffer = 0;
    return;
  }

  gameContext = new (window["AudioContext"] || window["webkitAudioContext"]);
  gameMasterGain = gameContext["createGain"]();
  // load some sound
  audioElement = document.querySelector('#song1');
  console.log(audioElement)
  gameSourceNode = gameContext.createMediaElementSource(audioElement);
  
  gameMasterGain["gain"]["setValueAtTime"](defaultGameVolume, gameContext["currentTime"]);
}

function muteGame(elem) {
  var artistTrack = gameContext["currentTime"] + 0.6;
  var action = $(elem)["attr"]("state") == "off" ? "on" : "off";
  var previousState = "icon-" + action;
  var beforeValue = $(elem)["attr"](previousState);
  $(elem)["attr"]("state", action)["html"](beforeValue);
  gameMasterGain["gain"]["exponentialRampToValueAtTime"](action == "on" ? defaultGameVolume : 0.000001, artistTrack);
}

function roundNumber(value) {
  return Math["round"](value * 1E3) / 1E3;
}

function extraLifeValue() {
  return Math["round"](pr["model"]["lives"] * pr["model"]["extra_life_value"] * getPointMultiplier());
}

function moveGridByDirectionKeys(exp) {
  var _0x3aa118 = 0.01;
  if (exp == "left") {
    rangerKeys["percent"] = rangerKeys["percent"] - _0x3aa118;
  }
  if (exp == "right") {
    rangerKeys["percent"] = rangerKeys["percent"] + _0x3aa118;
  }
  moveRangerByType(rangerKeys["type"], ![], $("#ranger")["width"]() * rangerKeys["percent"], rangerKeys["percent"]);
}

function moveGridBySectionKeys(canCreateDiscussions) {
  rangerKeys["percent"] = (canCreateDiscussions * (100 / 9) - 100 / 18) / 100;
  moveRangerByType(rangerKeys["type"], ![], $("#ranger")["width"]() * rangerKeys["percent"], rangerKeys["percent"]);
}

function initGrid(name) {
  var _0x427f15 = 0;
  var which = getGridSections(name);
  $["each"](which, function(canCreateDiscussions, items) {
    if (name == "eq") {
      var marginTop = _0x427f15 === 0 ? "&nbsp;" : items["min"] + "<small>Hz</small>";
      var activeTabWidth = items["middle"] + "<small>Hz</small>";
    }
    if (name == "panning" || name == "custom") {
      marginTop = Math["abs"](items["min"]);
      activeTabWidth = Math["abs"](items["middle"]);
    }
    $("#grid")["append"]('<div style="width:' + 100 / totalSections + "%\">" + "<div class=\"gridbox\"></div>" + '<div class="middle">' + activeTabWidth + "</div>" + "<div class=\"min\">" + marginTop + "</div>" + "</div>");
    _0x427f15++;
  });
}

function setupGridOld(m, s) {
  var window = mobile ? "touchmove" : "mousemove";
  var eventType = mobile ? "touchend" : "click";
  if (mobile) {
    $("#ranger")["on"]("touchstart", function(message) {
      var c = cut;
      message[c("0x10")]();
    });
  }
  $("#ranger")["on"](window, function(colData) {
    var parseInt = cut;
    if (m == "stereo") {
      var focusTilePosY = $("#ranger")["offset"]()["top"];
      var childValidation = mobile ? colData["originalEvent"]["touches"][0]["pageY"] ? colData["originalEvent"]["touches"][0]["pageY"] - focusTilePosY : colData["originalEvent"]["touches"][0]["clientY"] - focusTilePosY : colData["pageY"] - focusTilePosY;
      /** @type {number} */
      var scrollbarIdx = (childValidation - 20) / ($(this)["height"]() - 40);
      moveRangerByType(m, s, childValidation, scrollbarIdx);
    } else {
      /** @type {number} */
      var drawX = 30;
      focusTilePosY = $("#ranger")["offset"]()["left"];
      /** @type {number} */
      childValidation = mobile ? colData["originalEvent"]["touches"][0]["pageX"] ? colData["originalEvent"]["touches"][0]["pageX"] - drawX : colData["originalEvent"]["touches"][0]["clientX"] + focusTilePosY - drawX : colData["pageX"] - focusTilePosY;
      /** @type {number} */
      scrollbarIdx = childValidation / $(this)["width"]();
      moveRangerByType(m, s, childValidation, scrollbarIdx);
    }
  })["on"](eventType, function(canCreateDiscussions) {
    selectRangerByType(m, s);
  })["on"]("touchstart", function(message) {
    /** @type {function(string, ?): ?} */
    var c = cut;
    message[c("0x10")]();
  });
}
/**
 * @param {string} domNode
 * @param {boolean} grid
 * @return {undefined}
 */
function setupGrid(domNode, grid) {
  /** @type {function(string, ?): ?} */;
  $("#ranger")["on"]("touchstart", function(result) {
    result["preventDefault"]();
  });
  $("#ranger")["on"]("touchmove", function(same) {
    /** @type {function(string, ?): ?} */
    var rel2Mstr = render;
    if (domNode == "stereo") {
      var RectBegin = $("#ranger")["offset"]()["top"];
      /** @type {number} */
      var childValidation = same["originalEvent"]["touches"][0]["pageY"] ? same["originalEvent"]["touches"][0]["pageY"] - RectBegin : same["originalEvent"]["touches"][0]["clientY"] - RectBegin;
      /** @type {number} */
      var scrollbarIdx = (childValidation - 20) / ($(this)["height"]() - 40);
      moveRangerByType(domNode, grid, childValidation, scrollbarIdx);
    } else {
      /** @type {number} */
      var RectEnd = 30;
      RectBegin = $("#ranger")["offset"]()["left"];
      /** @type {number} */
      childValidation = same["originalEvent"]["touches"][0]["pageX"] ? same["originalEvent"]["touches"][0]["pageX"] - RectBegin - RectEnd : same["originalEvent"]["touches"][0]["clientX"] - RectBegin - RectEnd;
      /** @type {number} */
      scrollbarIdx = childValidation / $(this)["width"]();
      moveRangerByType(domNode, grid, childValidation, scrollbarIdx);
    }
  })["on"]("mousemove", function(myPreferences) {
    /** @type {function(string, ?): ?} */
    var getPreferenceKey = render;
    if (domNode == "stereo") {
      var available = $("#ranger")["offset"]()["top"];
      /** @type {number} */
      var needToFree = myPreferences["pageY"] - available;
      /** @type {number} */
      var scrollbarIdx = (needToFree - 20) / ($(this)["height"]() - 40);
      moveRangerByType(domNode, grid, needToFree, scrollbarIdx);
    } else {
      available = $("#ranger")["offset"]()["left"];
      /** @type {number} */
      needToFree = myPreferences["pageX"] - available;
      /** @type {number} */
      scrollbarIdx = needToFree / $(this)["width"]();
      moveRangerByType(domNode, grid, needToFree, scrollbarIdx);
    }
  })["on"]("touchend", function(canCreateDiscussions) {
    selectRangerByType(domNode, grid);
  })["on"]("click", function(canCreateDiscussions) {
    selectRangerByType(domNode, grid);
  })["on"]("touchstart", function(result) {
    result["preventDefault"]();
  });
}

function moveRangerByType(condition, key, validation, position) {
  if (condition == "eq") {
    var value = positionToHz(position);
    var x = getSectionRange("eq", value, key ? 2 : rangeset[rangeLevel]);
    if (value < slideMin || value > slideMax) {
      return;
    }
    if (key) {
      updateFrequency(value);
    }
    $("#range")["width"](x["width"]);
    if (position >= 0.5) {
      $("#range")["css"]({
        left : hzToPosition(x["min"]) + "%",
        right : "auto"
      });
    } else {
      $("#range")["css"]({
        right : 100 - hzToPosition(x["max"]) + "%",
        left : "auto"
      });
    }
    $("#handle")["css"]("left", validation);
    $("#value")["css"]("left", validation)["html"](numberWithCommas(value) + "<small>Hz</small>")["attr"]("val", value);
  }
  if (condition == "panning") {
    var value = positionToPan(position);
    x = getSectionRange("panning", value, 0);
    if (value > 0.93 || value < -0.93) {
      return;
    }
    if (key) {
      updatePan(getPanSet(value));
    }
    $("#range")["width"](x["width"]);
    $("#value")["css"]("left", validation)["attr"]("val", value);
    $("#handle")["css"]("left", validation);
    if (value < 0) {
      $("#range")["css"]({
        right : 100 - position * 100 + "%",
        left : "auto",
        "margin-right" : x["width"] / 2 * -1
      });
      $("#value")["html"](Math["abs"](value) + "<small>left</small>");
    } else {
      $("#range")["css"]({
        left : position * 100 + "%",
        right : "auto",
        "margin-left" : x["width"] / 2 * -1
      });
      $("#value")["html"](Math["abs"](value) + "<small>right</small>");
    }
  }
  if (condition == "stereo") {
    /** @type {number} */
    value = Math["round"]((1 - position) * 100) / 100;
    x = getSectionRange("panning", value, 0);
    if (value > 1 || value < 0) {
      return;
    }
    if (key) {
      updateStereo(getPanSet(value));
    }
    $("#value")["attr"]("val", value)["html"](Math["abs"](value));
    $("#range, #range-mirror")["width"](x["width"]);
    $("#range")["css"]({
      left : position * 50 + "%",
      right : "auto",
      "margin-left" : x["width"] / 2 * -1
    });
    $("#range-mirror")["css"]({
      right : position * 50 + "%",
      left : "auto",
      "margin-right" : x["width"] / 2 * -1
    });
    $("#handle")["css"]("left", position * 50 + "%");
    $("#handle-mirror")["css"]("right", position * 50 + "%");
  }
  if (condition == "space") {
    value = positionToPan(position);
    x = getSectionRange("space", value, 0);
    if (value > 0.98 || value < -0.98) {
      return;
    }
    $("#space-main, #value, #cartridge, #handle")["css"]("left", validation)["attr"]("val", value);
    $("#value")["attr"]("val", value);
    if (value < 0) {
      $("#range")["css"]({
        right : 100 - position * 100 + "%",
        left : "auto",
        "margin-right" : x["width"] / 2 * -1
      });
      $("#value")["html"](Math["abs"](value) + "<small>left</small>");
    } else {
      $("#range")["css"]({
        left : position * 100 + "%",
        right : "auto",
        "margin-left" : x["width"] / 2 * -1
      });
      $("#value")["html"](Math["abs"](value) + "<small>right</small>");
    }
  }
  if (condition == "custom") {
    value = positionToValue(position);
    x = getSectionRange("custom", value, 0);
    if (value > maxRandValue || value < minRandValue) {
      return;
    }
    if (key) {
      updateGrid(value);
    }
    $("#range")["width"](x["width"]);
    $("#value")["css"]("left", validation)["attr"]("val", value);
    $("#handle")["css"]("left", validation);
    $("#range")["css"]({
      left : position * 100 + "%",
      right : "auto",
      "margin-left" : x["width"] / 2 * -1
    });
    $("#value")["html"](value + " <small>" + gridValueLabel + "</small>");
  }
}
/**
 * @param {string} condition
 * @param {string} str
 * @return {undefined}
 */
function selectRangerByType(condition, str) {
  /** @type {function(string, ?): ?} */;
  if (str || $("#game-panel-body")["attr"]("state") === "wait") {
    return;
  }
  if (condition == "eq") {
    /** @type {number} */
    var result = parseInt($("#value")["attr"]("val"));
    var data = globalFrq;
    showResult(result, data);
  }
  if (condition == "panning" || condition == "stereo") {
    /** @type {number} */
    var result = parseFloat($("#value")["attr"]("val"));
    var event = pan;
    showResult(result, event);
  }
  if (condition == "space") {
    /** @type {number} */
    result = parseFloat($("#value")["attr"]("val"));
    event = mode == "game" ? pan : bonusPanPosition;
    shot(result, event);
  }
  if (condition == "custom") {
    /** @type {number} */
    var result = parseFloat($("#value")["attr"]("val"));
    showResult(result);
  }
}
/**
 * @param {string} name
 * @return {?}
 */
function getGridSections(name) {
  /** @type {function(string, ?): ?} */;
  /** @type {!Array} */
  var params = [];
  /** @type {number} */
  var _0x309a05 = 0;
  if (name == "eq") {
    /** @type {number} */
    var i = 0;
    for (; i < totalSections; i++) {
      params[i] = {
        id : i,
        min : Math["pow"](2, i) * minHZscale,
        max : Math["pow"](2, i + 1) * minHZscale,
        middle : Math["round"](Math["pow"](2, i + 0.5) * minHZscale),
        WidthMin : _0x309a05,
        WidthMax : _0x309a05 + 100 / totalSections,
        LogarithmicVal : Math["pow"](2, i)
      };
      /** @type {number} */
      _0x309a05 = _0x309a05 + 100 / totalSections;
    }
  }
  if (name == "panning") {
    /** @type {number} */
    var data = -1;
    /** @type {number} */
    var _0x52661e = 0.1;
    /** @type {number} */
    i = 0;
    for (; i < totalSections; i++) {
      params[i] = {
        id : i,
        min : roundNumber(data),
        max : roundNumber(data + _0x52661e * 2),
        middle : roundNumber(roundNumber(data) + 0.1),
        WidthMin : _0x309a05,
        WidthMax : _0x309a05 + 100 / totalSections,
        LogarithmicVal : 0
      };
      /** @type {number} */
      _0x309a05 = _0x309a05 + 100 / totalSections;
      data = roundNumber(data + 0.1 * 2);
    }
  }
  if (name == "custom") {
    data = gridStartingPoint;
    /** @type {number} */
    i = 0;
    for (; i < totalSections; i++) {
      var minVal;
      var NULL;
      var middle;
      minVal = roundNumber(data);
      NULL = roundNumber(data + gridScale * 2);
      middle = roundNumber(minVal + gridScale);
      params[i] = {
        id : i,
        min : minVal,
        max : NULL,
        middle : middle,
        WidthMin : _0x309a05,
        WidthMax : _0x309a05 + 100 / totalSections
      };
      /** @type {number} */
      _0x309a05 = _0x309a05 + 100 / totalSections;
      data = NULL;
    }
  }
  return params;
}

function setGridRangePosition(comparator, left) {
  /** @type {function(string, ?): ?} */;
  if (comparator == "eq") {
    var result = getSectionRange("eq", defaultHz, left);
    $("#handle")["css"]("left", "50%");
    $("#value")["css"]("left", "50%")["html"](defaultHz + "<small>Hz</small>");
    $("#range")["width"](result["width"])["css"]({
      left : hzToPosition(result["min"]) + "%",
      right : "auto"
    });
  }
  if (comparator == "panning") {
    result = getSectionRange("panning", left, 0);
    $("#handle")["css"]("left", "50%");
    $("#value")["css"]("left", "50%")["html"]("0");
    $("#range")["width"](result["width"])["css"]({
      left : "50%",
      right : "auto",
      "margin-left" : result["width"] / 2 * -1
    });
  }
  if (comparator == "space") {
    result = getSectionRange("space", left, 0);
    $("#handle")["css"]("left", "50%");
    $("#value")["css"]("left", "50%")["html"]("0");
    $("#range")["width"](result["width"])["css"]({
      left : "50%",
      right : "auto",
      "margin-left" : result["width"] / 2 * -1
    });
  }
  if (comparator == "custom") {
    result = getSectionRange("custom", left, 0);
    $("#handle")["css"]("left", "50%");
    $("#value")["css"]("left", "50%")["html"](gridDefaultValue + " <small>" + gridValueLabel + "</small>");
    $("#range")["width"](result["width"])["css"]({
      left : "50%",
      right : "auto",
      "margin-left" : result["width"] / 2 * -1
    });
  }
}

function setGridRangeWidth(type, i) {
  /** @type {function(string, ?): ?} */;
  if (type == "eq") {
    var idx = getSectionRange("eq", defaultHz, i);
  }
  if (type == "panning" || type == "space") {
    idx = getSectionRange("panning", i, 0);
  }
  if (type == "custom") {
    idx = getSectionRange("custom", i, 0);
  }
  $("#range")["width"](idx["width"]);
}

function getSectionRange(name, x, i) {
  if (name == "eq") {
    var data = {};
    var r = i / 2;
    return data["min"] = x * Math["pow"](2, -r), data["max"] = x * Math["pow"](2, r), data["middle"] = x, data["minperfect"] = x * Math["pow"](2, -0.125), data["maxperfect"] = x * Math["pow"](2, 0.125), data["width"] = $("#ranger")["width"]() / totalSections * i, data;
  }
  if (name == "panning" || name == "space") {
    var legend_width = 0.1;
    data = {};
    r = rangeset[rangeLevel] / 2;
    return data["min"] = roundNumber(x - legend_width * 2 * r), data["max"] = roundNumber(x + legend_width * 2 * r), data["middle"] = roundNumber(x), data["minperfect"] = roundNumber(x - legend_width / 2), data["maxperfect"] = roundNumber(x + legend_width / 2), data["width"] = $("#ranger")["width"]() / totalSections * rangeset[rangeLevel], data;
  }
  if (name == "custom") {
    data = {};
    r = rangeset[rangeLevel] / 2;
    return data["min"] = roundNumber(x - gridScale * 2 * r), data["max"] = roundNumber(x + gridScale * 2 * r), data["middle"] = roundNumber(x), data["minperfect"] = roundNumber(x - gridScale / 2), data["maxperfect"] = roundNumber(x + gridScale / 2), data["width"] = $("#ranger")["width"]() / totalSections * rangeset[rangeLevel], data;
  }
}

function positionToHz(name) {
  return Math["round"](minHZscale * Math["pow"](2, totalSections * name));
}

function hzToPosition(deltaX) {
  return Math["log"](deltaX / minHZscale) / Math["log"](Math["pow"](2, totalSections)) * 100;
}

function getKeyByHz(value) {
  return roundNumber(12 * Math["log10"](value / 440) / Math["log10"](2) + 69);
}

function volumeToDB(value) {
  return Math["log"](value) / Math["log"](10) * 20;
}

function dbToVolume(height) {
  return Math["pow"](10, height / 20);
}

function getGridAccurancyPoints(val, key, value) {
  if (val == "eq") {
    var number = 2 * getPointMultiplier();
    return Math["abs"](Math["round"]((21 - Math["abs"](getKeyByHz(key) - getKeyByHz(value))) * number));
  }
  if (val == "panning") {
    var minFluct = 0;
    number = 15 * getPointMultiplier();
    return key > 0 && value > 0 || key < 0 && value < 0 ? minFluct = Math["abs"](value - key) * 10 : minFluct = (Math["abs"](value) + Math["abs"](key)) * 10, Math["round"](number * (3 - minFluct));
  }
  if (val == "custom") {
    return Math["round"]((30 - Math["abs"](value - key)) * 1.7 * getPointMultiplier());
  }
}
/**
 * @return {?}
 */
function getRandomPanValue() {
  /** @type {function(string, ?): ?} */;
  return (Math["floor"](Math["random"]() * 186) - 93) / 100;
}
/**
 * @param {number} level
 * @return {?}
 */
function getPanSet(level) {
  /** @type {function(string, ?): ?} */;
  /** @type {number} */
  var val = level * 90;
  /** @type {number} */
  var value = val + 90;
  var _0x28c91d = Math["sin"](val * (Math["PI"] / 180));
  var _0x54f1fa = Math["sin"](value * (Math["PI"] / 180));
  return [_0x28c91d, 0, _0x54f1fa];
}
/**
 * @param {number} deltaX
 * @return {?}
 */
function panToPosition(deltaX) {
  return deltaX > 0 ? (deltaX / 2 + 0.5) * 100 : (0.5 - Math["abs"](deltaX / 2)) * 100;
}
/**
 * @param {number} name
 * @return {?}
 */
function positionToPan(name) {
  return name > 0.5 ? roundNumber((name - 0.5) * 2) : roundNumber(-1 * (1 - name * 2));
}
/**
 * @param {number} position
 * @return {?}
 */
function positionToValue(position) {
  /** @type {function(string, ?): ?} */;
  return roundNumber(position * 100 + gridStartingPoint)["toFixed"](1);
}
/**
 * @return {?}
 */
function getRandomFrequency() {
  /** @type {function(string, ?): ?} */;
  /** @type {!Array} */
  var updatedEdgesById = [];
  return $["each"](getGridSections("eq"), function(canCreateDiscussions, totalRange) {
    /** @type {function(string, ?): ?} */
    updatedEdgesById["push"](Math["floor"](Math["random"]() * (totalRange["max"] - totalRange["min"] + 1) + totalRange["min"]));
  }), updatedEdgesById["shift"](), updatedEdgesById["pop"](), updatedEdgesById[Math["floor"](Math["random"]() * updatedEdgesById["length"])];
}
/**
 * @return {undefined}
 */
function resetKeyboardKeys() {
  /** @type {function(string, ?): ?} */;
  $("[key-id]")["each"](function() {
    /** @type {function(string, ?): ?} */
    $(this)["attr"]("key-status", "inactive");
  });
}
/**
 * @param {string} picSize
 * @return {undefined}
 */
function activateKeyboardKeys(picSize) {
  /** @type {function(string, ?): ?} */;
  $("#" + picSize + " [key-id]")["each"](function() {
    /** @type {function(string, ?): ?} */
    $(this)["attr"]("key-status", "active");
  });
}
/**
 * @param {number} v
 * @return {?}
 */
function msToTime(v) {
  /**
   * @param {number} value
   * @param {number} abbr
   * @return {?}
   */
  function z(value, abbr) {
    /** @type {function(string, ?): ?} */;
    return abbr = abbr || 2, ("00" + value)["slice"](-abbr);
  }
  /** @type {number} */
  var mili = v % 1E3;
  /** @type {number} */
  v = (v - mili) / 1E3;
  /** @type {number} */
  var m = v % 60;
  /** @type {number} */
  v = (v - m) / 60;
  /** @type {number} */
  var mins = v % 60;
  return z(m) + "." + z(mili / 10, 1);
}
/**
 * @param {number} state
 * @return {?}
 */
function minToTime(state) {
  /**
   * @param {number} src
   * @param {number} options
   * @return {?}
   */
  function render(src, options) {
    /** @type {function(string, ?): ?} */;
    return options = options || 2, ("00" + src)["slice"](-options);
  }
  /** @type {number} */
  var pointer_state = state % 1E3;
  /** @type {number} */
  state = (state - pointer_state) / 1E3;
  /** @type {number} */
  var value = state % 60;
  /** @type {number} */
  state = (state - value) / 60;
  /** @type {number} */
  var lessSrc = state % 60;
  return render(lessSrc) + ":" + render(value) + "." + render(pointer_state / 10, 1);
}
/**
 * @param {?} canCreateDiscussions
 * @return {undefined}
 */
function keyIsPressed(canCreateDiscussions) {
  return;
}
/**
 * @return {undefined}
 */
function setKeyboardKeys() {
  /** @type {function(string, ?): ?} */;
  $(document)["keydown"](function(result) {
    /** @type {function(string, ?): ?} */
    keyIsPressed(result[a("0x46")]);
    if (result[a("0x46")] == 17 || result[a("0x46")] == 91 || result[a("0x46")] == 93) {
      /** @type {boolean} */
      ctrlIsPressed = !![];
    }
    if (result[a("0x46")] == 18) {
      /** @type {boolean} */
      altIsPressed = !![];
    }
    if (result[a("0x46")] == 32) {
      result[a("0x10")]();
      selectAnswer();
      return;
    }
    if (result["which"] >= 49 && result[a("0x46")] <= 57 && !ctrlIsPressed) {
      result["preventDefault"]();
      moveGridBySectionKeys(result[a("0x46")] - 48);
      return;
    }
    if (result["which"] == 82 && !ctrlIsPressed) {
      result[a("0x10")]();
      moveGridByDirectionKeys(a("0x11"));
      return;
    }
    if (result[a("0x46")] == 84 && !ctrlIsPressed) {
      result[a("0x10")]();
      moveGridByDirectionKeys(a("0x86"));
      return;
    }
    if (result["which"] == 67 && $(a("0x87"))["attr"](a("0x9b")) === a("0x85")) {
      GameCompare();
    }
    /** @type {!Array} */
    var next = [];
    var track = $('[key-id="' + result[a("0x46")] + '"]');
    if (track["length"] > 0) {
      result["preventDefault"]();
    }
    if (track[a("0x56")] == 1) {
      next[a("0x3e")](track);
    } else {
      if (track[a("0x56")] > 1) {
        next = track;
      }
    }
    $[a("0x9f")](next, function(canCreateDiscussions, obj) {
      var k = a;
      if ($(obj)[k("0x6c")]("key-status") == k("0x18")) {
        obj[k("0x48")]();
      }
    });
  });
  $(document)["keyup"](function(result) {
    if (result["which"] == 17 || result[key("0x46")] == 91 || result[key("0x46")] == 93) {
      ctrlIsPressed = ![];
    }
    if (result[key("0x46")] == 18) {
      altIsPressed = ![];
    }
  });
}

function bypassOn() {
  $("[bypass=\"off\"]")["attr"]("active", "no");
  $("[bypass=\"on\"]")["attr"]("active", "yes");
  var artistTrack = gameContext["currentTime"];
  gameBypassGain["gain"]["setValueAtTime"](1, artistTrack);
  gameUnpassGain["gain"]["setValueAtTime"](0, artistTrack);
}

function bypassOff() {
  $('[bypass="off"]')["attr"]("active", "yes");
  $("[bypass=\"on\"]")["attr"]("active", "no");
  var funcsToRun = gameContext["currentTime"];
  gameUnpassGain["gain"]["setValueAtTime"](1, funcsToRun);
  gameBypassGain["gain"]["setValueAtTime"](0, funcsToRun);
}

function setBypass(tempstick) {
  if (tempstick == "on") {
    bypassOn();
  } else {
    bypassOff();
  }
}

function selectAnswer() {
  /** @type {function(string, ?): ?} */;
  if ($("[set]")["length"] < 0) {
    $("[set][state=\"play\"] [answer-btn]")["click"]();
  }
  if ($("#ranger")["length"] && $("#game-panel-body")["attr"]("state") === "play") {
    selectRangerByType(rangerKeys["type"], ![]);
  }
}
/**
 * @param {number} a
 * @param {number} b
 * @return {?}
 */
function randomBetween(a, b) {
  /** @type {function(string, ?): ?} */;
  return Math["floor"](Math["random"]() * (b * 10 - a * 10 + 1) + a * 10) / 10;
}
/**
 * @param {number} precision
 * @param {string} scale
 * @return {?}
 */
function randomBetweenInts(precision, scale) {
  /** @type {function(string, ?): ?} */;
  return Math["floor"](Math["random"]() * (scale - precision + 1) + precision);
}

function loadingStatusCheck() {
  triggerInterval = setInterval(function() {
    try {
      // Audio files are loaded
      if (typeof gameSourceNode !== "undefined") {
        clearInterval(triggerInterval);
        // setGame();
        setupEqPlugin();
      }
    } catch (previousState) {
      console["error"](previousState);
    }
  }, 300);
}

function endGame(playerOut) {
  var data = {
    type : pr["type"],
    sub : pr["sub"],
    uid : pr["uid"],
    model : pr["model"]["id"],
    points : total,
    difficulty : isset(pr["currentDifficulty"]) ? pr["currentDifficulty"] : 0,
    completed : playerOut ? "yes" : "no",
    log : JSON["stringify"](answerslog),
    accuracy : JSON["stringify"](accuracylog)
  };
  $["ajax"]({
    url : baseUrl + "/play/register",
    type : "POST",
    data : data,
    success : function() {
      /** @type {function(string, ?): ?} */
      var titletemplate = pluralize;
      $(".game-cover")["removeClass"]("active");
      resetKeyboardKeys();
      if (playerOut) {
        $("#game-cleared")["addClass"]("active");
        activateKeyboardKeys("game-cleared");
      } else {
        $("#game-over")["addClass"]("active");
        activateKeyboardKeys("game-over");
      }
    },
    error : function(data, message, result) {
      /** @type {function(string, ?): ?} */
      var temp_err = pluralize;
      console[temp_err("0xb0")](data, message, result);
    }
  });
}

function registerPlay(instancesTypes) {
  $["ajax"]({
    url : baseUrl + "/play/register",
    type : "POST",
    data : instancesTypes,
    success : function(a) {
      var topPrice = getBaseURL;
      console[topPrice("0xb0")](a);
    },
    error : function(msg, t, val) {
      console["log"](msg, t, val);
    }
  });
}

function loadJsons() {
  var alignContentAlignItem = "1.00";
  if (pr["model"]["json_tests"] == "1") {
    fetchJSONFile(host + "/play/jsons/tests/" + pr["model"]["id"] + ".json?v=" + alignContentAlignItem, function(solo) {
      tests = solo;
    });
  }
  if (pr["model"]["json_diffs"] == "1") {
    fetchJSONFile(host + "/play/jsons/diffs/" + pr["model"]["id"] + ".json?v=" + alignContentAlignItem, function(abDiff) {
      diff = abDiff;
    });
  }
}

function showLives() {
  var _0x35734d;
  /** @type {string} */
  var html = "";
  /** @type {number} */
  _0x35734d = 0;
  for (; _0x35734d < pr["model"]["lives"]; _0x35734d++) {
    /** @type {string} */
    html = html + "<i class=\"fa fa-user\"></i>";
  }
  $("#lives")["html"](html);
}

function switchStereoSound() {
  gamePlayerLeft["stop"](0);
  gamePlayerRight["stop"](0);
  var same = getStereoLoopValues();

  gamePlayerLeft = gameContext["createBufferSource"]();
  gamePlayerRight = gameContext["createBufferSource"]();
  gamePlayerLeft["buffer"] = gameBuffer;
  gamePlayerRight["buffer"] = gameBuffer;
  gamePlayerLeft["connect"](gamePanLeft);
  gamePlayerRight["connect"](gamePanRight);
  gamePanLeft["connect"](gameMasterGain);
  gamePanRight["connect"](gameMasterGain);
  gameMasterGain["connect"](gameContext["destination"]);
  
  gamePlayerLeft["loop"] = !![];
  gamePlayerLeft["loopStart"] = same["left"]["start"];
  gamePlayerLeft["loopEnd"] = same["left"]["end"];
  gamePlayerLeft["start"](0, same["left"]["start"]);

  gamePlayerRight["loop"] = !![];
  gamePlayerRight["loopStart"] = same["right"]["start"];
  gamePlayerRight["loopEnd"] = same["right"]["end"];
  gamePlayerRight["start"](0, same["right"]["start"]);
}

function updateFrequency(row) {
  /** @type {function(string, ?): ?} */;
  gameFilter["frequency"]["setValueAtTime"](row, gameContext["currentTime"]);
}

function updatePan(lng) {
  /** @type {function(string, ?): ?} */;
  gamePan["setPosition"](lng[0], lng[1], lng[2]);
}
/**
 * @param {!Array} canCreateDiscussions
 * @return {undefined}
 */
function updateStereo(canCreateDiscussions) {
  /** @type {function(string, ?): ?} */;
  gamePanLeft["setPosition"](canCreateDiscussions[0] * -1, canCreateDiscussions[1], canCreateDiscussions[2]);
  gamePanRight["setPosition"](canCreateDiscussions[0], canCreateDiscussions[1], canCreateDiscussions[2]);
}
/**
 * @return {undefined}
 */
function startGame() {
  /** @type {function(string, ?): ?} */;
  $(".game-cover")["removeClass"]("active");
  $("#game-ready")["addClass"]("active");
  resetKeyboardKeys();
  activateKeyboardKeys("game-ready");
}

function loadGame() {
  $(".game-cover")["removeClass"]("active");
  $("#game-loading")["addClass"]("active");

  // LOAD AudioContext and fetch main audio files - set them to buffer
  loadSprite();

  // set keyboard key mapping
  setKeyboardKeys();

  setTimeout(function() {
    loadingStatusCheck();
  }, 800);
}

function initGame(state) {
  if (state) {
    loadJsons();
  }
  startGame();
};

function SelectBand(bandName, source) {
  $(".selected", "#bandsAdd").removeClass("selected");
  $(source).addClass("selected")
  currentlySelectedBand = bandName

  // TODO: create new band of given type
}