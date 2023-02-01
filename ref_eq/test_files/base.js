'use strict';
/** @type {!Array} */
var answerslog = [];
/** @type {!Array} */
var accuracylog = [];
var tests;
var diff;
/** @type {number} */
var defaultGameVolume = 0.6;
/** @type {number} */
var defaultFXVolume = 0.45;
var pointsMultiplication;
var timeoutNext;
/** @type {boolean} */
var compareBtnPressed = ![];
/** @type {boolean} */
var canWait = ![];
/** @type {boolean} */
var canContinue = ![];
/** @type {number} */
var waitForNext = 1400;
/** @type {boolean} */
var ctrlIsPressed = ![];
/** @type {boolean} */
var altIsPressed = ![];
/** @type {!Array} */
var bonus = [5, 10, 20, 35, 50, 80, 130];
var fxMap;
var fxContext;
var fxPlayer;
var fxSound;
var fxBuffer;
var fxGain;
var triggerInterval;
var gameMasterGain;
var gameBypassGain;
var gameUnpassGain;

// main AudioContext object of the app
var gameContext;
var gameBuffer;
var gameSound;
var gamePlayer;
var spriteMap = {};

function getPointMultiplier() {
  /** @type {function(string, ?): ?} */;
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
/**
 * @return {?}
 */
function getLoopValues() {
  /** @type {function(string, ?): ?} */;
  var i = Math["floor"](Math["random"]() * pr["sprite"]["vals"]["length"])["toString"]();
  /** @type {number} */
  var collectionID = 0;
  /** @type {number} */
  var end = 0;
  if (pr["sprite"]["vals"]["length"] > 0) {
    /** @type {number} */
    collectionID = parseInt(pr["sprite"]["vals"][i]["start"]) / 1E3;
    /** @type {number} */
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
  console.log(pr)

  // pr is set in test.html
  if (pr["sprite"] == null || isset(pr["sprite"]) && pr["sprite"]["length"] == 0) {
    /** @type {number} */
    gameBuffer = 0;
    return;
  }

  if (pr["sprite"]["method"] == "old") {
    gameContext = new (window["AudioContext"] || window["webkitAudioContext"]);
    gameMasterGain = gameContext["createGain"]();

    gameMasterGain["gain"]["setValueAtTime"](defaultGameVolume, gameContext["currentTime"]);
    
    // host="https://assets.soundgym.co"; 
    // GET SOUNDS FROM SOUNDGYM MEDIA SERVER
    gameSound = new XMLHttpRequest;
    // GET SOUND DUE TO GIVEN CONFIGURATION IN test.html - pr variable
    gameSound["open"]("GET", host + "/sounds/sprites/" + pr["sprite"]["id"] + "/" + (pr["sprite"]["stereo"] ? "stereo" : "mono") + "-128.mp3", !![]);
    gameSound["responseType"] = "arraybuffer";

    // FUNCTION ON RECEIVE GET RESPONSE WITH AUDIO
    gameSound["onload"] = function() {
      gameContext["decodeAudioData"](gameSound["response"], function(receivedBuffer) {
        // FUNCTION TO BE INVOKED ON SUCCESSFUL DECODING
        gameBuffer = receivedBuffer;
      });
    };
    gameSound["send"]();
  } else {
  // CURRENTLY NOT USED
    var precUserLanguage = pr["sprite"]["name"];
    fetchJSONFile(host + "/sounds/sprite/" + precUserLanguage + "/main.json", function(canCreateDiscussions) {
      spriteMap = canCreateDiscussions["spritemap"];
    });
    gameContext = new (window["AudioContext"] || window["webkitAudioContext"]);
    gameMasterGain = gameContext["createGain"]();
    gameMasterGain["gain"]["setValueAtTime"](defaultGameVolume, gameContext["currentTime"]);
    /** @type {!XMLHttpRequest} */
    gameSound = new XMLHttpRequest;
    gameSound["open"]("GET", host + "/sounds/sprite/" + precUserLanguage + "/main.mp3", !![]);
    /** @type {string} */
    gameSound["responseType"] = "arraybuffer";
    /**
     * @return {undefined}
     */
    gameSound["onload"] = function() {
      gameContext["decodeAudioData"](gameSound["response"], function(canCreateDiscussions) {
        /** @type {number} */
        gameBuffer = canCreateDiscussions;
      });
    };
    gameSound["send"]();
  }
}

function playFx(key) {
  /** @type {function(string, ?): ?} */;
  var record = fxMap[key];
  var artistTrack = fxContext["currentTime"];
  /** @type {number} */
  var GET_AUTH_URL_TIMEOUT = fxMap[key]["end"] - fxMap[key]["start"];
  fxGain = fxContext["createGain"]();
  fxGain["gain"]["setValueAtTime"](pr["fxs"] == "on" ? defaultFXVolume : 0, artistTrack);
  fxPlayer = fxContext["createBufferSource"]();
  fxPlayer["buffer"] = fxBuffer;
  fxPlayer["connect"](fxGain);
  fxGain["connect"](fxContext["destination"]);
  fxPlayer["start"](0, record["start"], GET_AUTH_URL_TIMEOUT);
}

// LOAD SOUND EFFECTS - whistles on right answeretc.
function loadFxs() {

  fetchJSONFile(host + "/sounds/sprite/" + fxfolder + "/main.json", function(myPreferences) {
    fxMap = myPreferences["spritemap"];
    // console.log("fxMAP fxMAP fxMAP=")
    // console.log(JSON.stringify(fxMap))
  });

  fxContext = new (window["AudioContext"] || window["webkitAudioContext"]);

  fxSound = new XMLHttpRequest;
  fxSound["open"]("GET", host + "/sounds/sprite/" + fxfolder + "/main.mp3", !![]);
  console.log("GET", host + "/sounds/sprite/" + fxfolder + "/main.mp3")
  fxSound["responseType"] = "arraybuffer";

  fxSound["onload"] = function() {
    fxContext["decodeAudioData"](fxSound["response"], function(canCreateDiscussions) {
      /** @type {number} */
      fxBuffer = canCreateDiscussions;
    });
  };

  fxSound["send"]();
}

function muteGame(elem) {
  /** @type {function(string, ?): ?} */;
  var artistTrack = gameContext["currentTime"] + 0.6;
  var action = $(elem)["attr"]("state") == "off" ? "on" : "off";
  var previousState = "icon-" + action;
  var beforeValue = $(elem)["attr"](previousState);
  $(elem)["attr"]("state", action)["html"](beforeValue);
  gameMasterGain["gain"]["exponentialRampToValueAtTime"](action == "on" ? defaultGameVolume : 0.000001, artistTrack);
}
/**
 * @param {?} elem
 * @return {undefined}
 */
function muteFX(elem) {
  /** @type {function(string, ?): ?} */;
  var groupId = $(elem)["attr"]("state") == "off" ? "on" : "off";
  var url = "icon-" + groupId;
  var html = $(elem)["attr"](url);
  $(elem)["attr"]("state", groupId)["html"](html);
  pr["fxs"] = groupId;
}
/**
 * @param {number} value
 * @return {?}
 */
function roundNumber(value) {
  /** @type {function(string, ?): ?} */;
  return Math["round"](value * 1E3) / 1E3;
}

function extraLifeValue() {
  /** @type {function(string, ?): ?} */;
  return Math["round"](pr["model"]["lives"] * pr["model"]["extra_life_value"] * getPointMultiplier());
}
/**
 * @param {!Object} name
 * @param {?} oneofIndex
 * @return {undefined}
 */
function gameAnswer(name, oneofIndex) {
  /** @type {function(string, ?): ?} */;
  if (pr["model"]["compare"] == "1" && compareBtnPressed) {
    AnswerCompare(name);
    return;
  }
  if ($("#game-panel-body")["attr"]("state") === "wait") {
    return;
  }
  $("#game-panel-body")["attr"]("state", "wait");
  var value;
  if (oneofIndex) {
    value = "correct";
    var total_tax = Math["round"](50 * getPointMultiplier());
    step++;
    total = total + total_tax + (step == pr["model"]["stages"] ? extraLifeValue() : 0);
  } else {
    /** @type {string} */
    value = "wrong";
    pr["model"]["lives"]--;
    if (step >= 1) {
      /** @type {number} */
      step = step - 1;
    }
  }
  name["attr"]("state", value);
  $("#points")["text"](numberWithCommas(total));
  showLives();
  answerslog["push"]({
    e : value,
    t : Date["now"](),
    p : total
  });
  playFx(value);
  /** @type {boolean} */
  canWait = !![];
  /** @type {number} */
  timeoutNext = setTimeout(function() {
    /** @type {function(string, ?): ?} */
    var r = require;
    gamePlayer[r("0xd")](0);
    if (pr["model"]["lives"] === 0) {
      endGame(![]);
      return;
    } else {
      if (step == pr[r("0xb")][r("0x25")]) {
        endGame(!![]);
        return;
      } else {
        loadNext();
        $("#stage")["text"](step + 1);
      }
    }
    /** @type {boolean} */
    canWait = ![];
  }, waitForNext);
}
/**
 * @param {string} v
 * @param {!Object} data
 * @param {?} left
 * @return {?}
 */
function gridAnswer(v, data, left) {
  /** @type {function(string, ?): ?} */;
  var name;
  var options = $("#stepPoints");
  /** @type {string} */
  var html = "";
  var result;
  if (left >= data["minperfect"] && left <= data["maxperfect"]) {
    /** @type {string} */
    name = "perfect";
    /** @type {string} */
    result = "perfect";
    var value = Math["round"](100 * getPointMultiplier());
    total = total + value;
    html = options["attr"]("perfect") + " +" + numberWithCommas(value);
    step++;
  } else {
    if (left >= data["min"] && left <= data["max"]) {
      name = "correct";
      result = "correct";
      value = getGridAccurancyPoints(v, data["middle"], left);
      var type = Math["round"](bonus[rangeLevel] * getPointMultiplier());
      total = Math["round"](total + value + type);
      html = options["attr"]("accurate") + " +" + numberWithCommas(value) + "<br />" + options["attr"]("bonus") + " +" + numberWithCommas(type);
      step++;
    } else {
      /** @type {string} */
      name = "wrong";
      result = "wrong";
      html = options["attr"]("zero");
      pr["model"]["lives"]--;
    }
  }
  return answerslog["push"]({
    e : name,
    t : Date["now"](),
    p : total
  }), v == "eq" && accuracylog["push"]({
    selected : data["middle"],
    actual : left,
    gap : Math["round"](Math["abs"](hzToPosition(data["middle"]) - hzToPosition(left)))
  }), v == "panning" && accuracylog["push"]({
    selected : data["middle"],
    actual : left,
    gap : Math["round"](Math["abs"](panToPosition(data["middle"]) - panToPosition(left)))
  }), options["removeClass"](name == "wrong" ? "positive" : "negative")["addClass"](name == "wrong" ? "negative" : "positive")["html"](html)["show"]()["fadeOut"](waitForNext), $("#points")["text"](numberWithCommas(total)), playFx(result), $("#ranger")["attr"]("color", name), showLives(), setTimeout(function() {
    /** @type {function(string, ?): ?} */
    var titletemplate = String;
    $("#ranger")["attr"]("color", "none");
  }, 200), name;
}
/**
 * @param {!Object} range
 * @param {?} value
 * @return {?}
 */
function gridAnswerCheetah(range, value) {
  /** @type {function(string, ?): ?} */;
  var S;
  var HelloMethod;
  if (value >= range["min"] && value <= range["max"]) {
    S = "correct";
    HelloMethod = "correct";
    var total_tax = Math["round"](30 * getPointMultiplier());
    total = total + total_tax;
    step++;
  } else {
    S = "wrong";
    HelloMethod = "wrong_long";
  }
  return answerslog["push"]({
    e : S,
    t : Date["now"](),
    p : total
  }), $("#points")["text"](numberWithCommas(total)), playFx(HelloMethod), $("#ranger")["attr"]("color", S), setTimeout(function() {
    /** @type {function(string, ?): ?} */
    var e = require;
    $(e("0x4f"))[e("0x6c")](e("0x6f"), e("0x6b"));
  }, 200), S;
}
/**
 * @param {?} obj
 * @return {undefined}
 */
function hoverSet(obj) {
  /** @type {function(string, ?): ?} */;
  var RULES = $(obj)["parents"]("[answer]");
  $("[answer]")["attr"]("state", "reset");
  RULES["attr"]("state", "hover");
}
/**
 * @param {!Object} tasks
 * @return {undefined}
 */
function AnswerCompare(tasks) {
  /** @type {function(string, ?): ?} */;
  var funcsToRun = gameContext["currentTime"];
  switchGainA["gain"]["setValueAtTime"](tasks["attr"]("set") == "A" ? 1 : 0, funcsToRun);
  switchGainB["gain"]["setValueAtTime"](tasks["attr"]("set") == "B" ? 1 : 0, funcsToRun);
  gameUnpassGain["gain"]["setValueAtTime"](1, funcsToRun);
  $(".answer")["removeAttr"]("compare");
  tasks["attr"]("compare", "play");
}
/**
 * @param {?} exp
 * @return {undefined}
 */
function moveGridByDirectionKeys(exp) {
  /** @type {function(string, ?): ?} */;
  /** @type {number} */
  var _0x3aa118 = 0.01;
  if (exp == "left") {
    /** @type {number} */
    rangerKeys["percent"] = rangerKeys["percent"] - _0x3aa118;
  }
  if (exp == "right") {
    rangerKeys["percent"] = rangerKeys["percent"] + _0x3aa118;
  }
  moveRangerByType(rangerKeys["type"], ![], $("#ranger")["width"]() * rangerKeys["percent"], rangerKeys["percent"]);
}
/**
 * @param {number} canCreateDiscussions
 * @return {undefined}
 */
function moveGridBySectionKeys(canCreateDiscussions) {
  /** @type {function(string, ?): ?} */;
  /** @type {number} */
  rangerKeys["percent"] = (canCreateDiscussions * (100 / 9) - 100 / 18) / 100;
  moveRangerByType(rangerKeys["type"], ![], $("#ranger")["width"]() * rangerKeys["percent"], rangerKeys["percent"]);
}
/**
 * @param {string} name
 * @return {undefined}
 */
function initGrid(name) {
  /** @type {number} */
  var _0x427f15 = 0;
  var which = getGridSections(name);
  $["each"](which, function(canCreateDiscussions, items) {
    /** @type {function(string, ?): ?} */;
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
/**
 * @param {string} m
 * @param {boolean} s
 * @return {undefined}
 */
function setupGridOld(m, s) {
  /** @type {function(string, ?): ?} */;
  var window = mobile ? "touchmove" : "mousemove";
  var eventType = mobile ? "touchend" : "click";
  if (mobile) {
    $("#ranger")["on"]("touchstart", function(message) {
      /** @type {function(string, ?): ?} */
      var c = cut;
      message[c("0x10")]();
    });
  }
  $("#ranger")["on"](window, function(colData) {
    /** @type {function(string, ?): ?} */
    var parseInt = cut;
    if (m == "stereo") {
      var focusTilePosY = $("#ranger")["offset"]()["top"];
      /** @type {number} */
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
/**
 * @param {string} condition
 * @param {boolean} key
 * @param {number} validation
 * @param {number} position
 * @return {undefined}
 */
function moveRangerByType(condition, key, validation, position) {
  /** @type {function(string, ?): ?} */;
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
/**
 * @param {string} comparator
 * @param {undefined} left
 * @return {undefined}
 */
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
/**
 * @param {string} type
 * @param {undefined} i
 * @return {undefined}
 */
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
/**
 * @param {(!Function|string)} name
 * @param {number} x
 * @param {number} i
 * @return {?}
 */
function getSectionRange(name, x, i) {
  /** @type {function(string, ?): ?} */;
  if (name == "eq") {
    var data = {};
    /** @type {number} */
    var r = i / 2;
    return data["min"] = x * Math["pow"](2, -r), data["max"] = x * Math["pow"](2, r), data["middle"] = x, data["minperfect"] = x * Math["pow"](2, -0.125), data["maxperfect"] = x * Math["pow"](2, 0.125), data["width"] = $("#ranger")["width"]() / totalSections * i, data;
  }
  if (name == "panning" || name == "space") {
    /** @type {number} */
    var legend_width = 0.1;
    data = {};
    /** @type {number} */
    r = rangeset[rangeLevel] / 2;
    return data["min"] = roundNumber(x - legend_width * 2 * r), data["max"] = roundNumber(x + legend_width * 2 * r), data["middle"] = roundNumber(x), data["minperfect"] = roundNumber(x - legend_width / 2), data["maxperfect"] = roundNumber(x + legend_width / 2), data["width"] = $("#ranger")["width"]() / totalSections * rangeset[rangeLevel], data;
  }
  if (name == "custom") {
    data = {};
    /** @type {number} */
    r = rangeset[rangeLevel] / 2;
    return data["min"] = roundNumber(x - gridScale * 2 * r), data["max"] = roundNumber(x + gridScale * 2 * r), data["middle"] = roundNumber(x), data["minperfect"] = roundNumber(x - gridScale / 2), data["maxperfect"] = roundNumber(x + gridScale / 2), data["width"] = $("#ranger")["width"]() / totalSections * rangeset[rangeLevel], data;
  }
}
/**
 * @param {number} name
 * @return {?}
 */
function positionToHz(name) {
  /** @type {function(string, ?): ?} */;
  return Math["round"](minHZscale * Math["pow"](2, totalSections * name));
}
/**
 * @param {?} deltaX
 * @return {?}
 */
function hzToPosition(deltaX) {
  /** @type {function(string, ?): ?} */;
  return Math["log"](deltaX / minHZscale) / Math["log"](Math["pow"](2, totalSections)) * 100;
}
/**
 * @param {number} value
 * @return {?}
 */
function getKeyByHz(value) {
  /** @type {function(string, ?): ?} */;
  return roundNumber(12 * Math["log10"](value / 440) / Math["log10"](2) + 69);
}
/**
 * @param {?} value
 * @return {?}
 */
function volumeToDB(value) {
  /** @type {function(string, ?): ?} */;
  return Math["log"](value) / Math["log"](10) * 20;
}
/**
 * @param {number} height
 * @return {?}
 */
function dbToVolume(height) {
  return Math["pow"](10, height / 20);
}
/**
 * @param {string} val
 * @param {number} key
 * @param {number} value
 * @return {?}
 */
function getGridAccurancyPoints(val, key, value) {
  /** @type {function(string, ?): ?} */;
  if (val == "eq") {
    /** @type {number} */
    var number = 2 * getPointMultiplier();
    return Math["abs"](Math["round"]((21 - Math["abs"](getKeyByHz(key) - getKeyByHz(value))) * number));
  }
  if (val == "panning") {
    /** @type {number} */
    var minFluct = 0;
    /** @type {number} */
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
      /** @type {function(string, ?): ?} */
      var k = a;
      if ($(obj)[k("0x6c")]("key-status") == k("0x18")) {
        obj[k("0x48")]();
      }
    });
  });
  $(document)["keyup"](function(result) {
    /** @type {function(string, ?): ?} */
    if (result["which"] == 17 || result[key("0x46")] == 91 || result[key("0x46")] == 93) {
      /** @type {boolean} */
      ctrlIsPressed = ![];
    }
    if (result[key("0x46")] == 18) {
      /** @type {boolean} */
      altIsPressed = ![];
    }
  });
}
/**
 * @return {undefined}
 */
function GameCompare() {
  /** @type {function(string, ?): ?} */;
  if (pr["model"]["compare"] == "1") {
    if (compareBtnPressed) {
      /** @type {boolean} */
      compareBtnPressed = ![];
      $("#game-panel")["attr"]("compare", "off");
      $(".game-main-btns")["show"]();
      GameContinue();
    } else {
      /** @type {boolean} */
      compareBtnPressed = !![];
      $("#game-panel")["attr"]("compare", "on");
      $(".game-main-btns")["hide"]();
      GameWait();
    }
  }
}
/**
 * @return {undefined}
 */
function GameWait() {
  if (canWait) {
    clearTimeout(timeoutNext);
    /** @type {boolean} */
    canContinue = !![];
  }
}
/**
 * @return {undefined}
 */
function GameContinue() {
  /** @type {function(string, ?): ?} */;
  if (canWait) {
    gamePlayer["stop"](0);
    $(".answer")["removeAttr"]("compare");
    if (pr["model"]["lives"] === 0) {
      endGame(![]);
      return;
    } else {
      if (step == pr["model"]["stages"]) {
        endGame(!![]);
        return;
      } else {
        /** @type {boolean} */
        canContinue = ![];
        /** @type {boolean} */
        canWait = ![];
        setGame();
        $("#stage")["text"](step + 1);
      }
    }
  }
}
/**
 * @return {undefined}
 */
function bypassOn() {
  /** @type {function(string, ?): ?} */;
  $("[bypass=\"off\"]")["attr"]("active", "no");
  $("[bypass=\"on\"]")["attr"]("active", "yes");
  var artistTrack = gameContext["currentTime"];
  gameBypassGain["gain"]["setValueAtTime"](1, artistTrack);
  gameUnpassGain["gain"]["setValueAtTime"](0, artistTrack);
}
/**
 * @return {undefined}
 */
function bypassOff() {
  /** @type {function(string, ?): ?} */;
  $('[bypass="off"]')["attr"]("active", "yes");
  $("[bypass=\"on\"]")["attr"]("active", "no");
  var funcsToRun = gameContext["currentTime"];
  gameUnpassGain["gain"]["setValueAtTime"](1, funcsToRun);
  gameBypassGain["gain"]["setValueAtTime"](0, funcsToRun);
}
/**
 * @param {!Object} tempstick
 * @return {undefined}
 */
function setBypass(tempstick) {
  if (tempstick == "on") {
    bypassOn();
  } else {
    bypassOff();
  }
}
/**
 * @return {undefined}
 */
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
      if (typeof gameBuffer !== "undefined" && typeof fxBuffer !== "undefined") {
        clearInterval(triggerInterval);
        $(".game-cover")["removeClass"]("active");
        setGame();
      }
    } catch (previousState) {
      console["error"](previousState);
    }
  }, 300);
}
/**
 * @param {boolean} playerOut
 * @return {undefined}
 */
function endGame(playerOut) {
  /** @type {function(string, ?): ?} */;
  if (playerOut) {
    playFx("cleared");
  }
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

function nextStage() {
  rangeLevel++;
  stage++;
  step = 0;

  var _0x4757c3 = ![];
  var el = Math["round"](bonus[rangeLevel] * getPointMultiplier());

  total = total + el + (stage == pr["model"]["stages"] ? extraLifeValue() : 0);
  $("#points")["text"](numberWithCommas(total));

  if (stage == pr["model"]["stages"]) {
    endGame(!![]);
    return;
  }

  $("#stage")["text"](stage + 1);

  if (stage == 2 || stage == 4) {
    pr["model"]["lives"]++;
    showLives();
    /** @type {boolean} */
    _0x4757c3 = !![];
  }

  var mirror = $("#game-stage");
  mirror["find"]("[stage] span")["html"](stage + 1);
  mirror["find"]("[range] span")["html"](rangeset[rangeLevel]);
  mirror["find"]("[points] span")["html"](el);

  if (_0x4757c3) {
    mirror["find"]("[life-bonus]")["show"]();
  } else {
    mirror["find"]("[life-bonus]")["hide"]();
  }

  mirror["addClass"]("active");
  setTimeout(function() {
    loadNext();
  }, waitForNext);
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
/**
 * @param {?} received_data
 * @return {undefined}
 */
function switchSound(received_data) {
  /** @type {function(string, ?): ?} */;
  var key = $(received_data)["attr"]("stype");
  if (key == "stereo") {
    switchStereoSound();
    return;
  }
  gamePlayer["stop"](0);
  var frontpageItems = getLoopValues();
  gamePlayer = gameContext["createBufferSource"]();
  gamePlayer["buffer"] = gameBuffer;

  if (key == "peak" || key == "cut" || key == "bass") {
    gamePlayer["connect"](gameBypassGain);
    gamePlayer["connect"](gameFilter);
  }

  if (key == "pan") {
    gamePlayer["connect"](gamePan);
    gamePan["connect"](gameMasterGain);
  }

  if (key == "db") {
    gamePlayer["connect"](sliderGain);
    sliderGain["connect"](gameContext["destination"]);
  }

  if (key == "delay") {
    gamePlayer["connect"](dryGain);
    dryGain["connect"](gameMasterGain);
    gameMasterGain["connect"](gameContext["destination"]);
    gamePlayer["connect"](gameDelay);
    gameDelay["connect"](gameMasterGain);
    gameMasterGain["connect"](gameContext["destination"]);
  }

  if (key == "eq") {
    gamePlayer["connect"](gameBypassGain);
    gameBypassGain["connect"](gameMasterGain);
    gamePlayer["connect"](gameFilters[0]);
    var prop;
    /** @type {number} */
    prop = 0;

    for (; prop < bands["length"] - 1; prop++) {
      gameFilters[prop]["connect"](gameFilters[prop + 1]);
    }

    gameFilters[bands["length"] - 1]["connect"](gameUnpassGain);
    gameUnpassGain["connect"](gameMasterGain);
    gameMasterGain["connect"](gameContext["destination"]);
  }

  gameMasterGain["connect"](gameContext["destination"]);
  gamePlayer["loop"] = !![];
  gamePlayer["loopStart"] = frontpageItems["start"];
  gamePlayer["loopEnd"] = frontpageItems["end"];
  gamePlayer["start"](0, frontpageItems["start"]);
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
/**
 * @param {?} row
 * @return {undefined}
 */
function updateFrequency(row) {
  /** @type {function(string, ?): ?} */;
  gameFilter["frequency"]["setValueAtTime"](row, gameContext["currentTime"]);
}
/**
 * @param {!Array} lng
 * @return {undefined}
 */
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
  /** @type {function(string, ?): ?} */;
  $(".game-cover")["removeClass"]("active");
  $("#game-loading")["addClass"]("active");

  // LOAD AudioContext and fetch main audio files - set them to buffer
  loadSprite();

  // LOAD AudioContext and fetch effects audio - whistle on righ answer etc.
  loadFxs();

  // set keyboard key mapping
  setKeyboardKeys();

  setTimeout(function() {
    loadingStatusCheck();
  }, 800);
}

/**
 * @param {?} state
 * @return {undefined}
 */
function initGame(state) {
  if (state) {
    loadJsons();
  }
  startGame();
}
;


