'use strict';
/** @type {!Array} */
var _0x2ce6 = ['[bypass="on"]', "[answer]", "floor", "start", "createBufferSource", "sprite", "now", "spritemap", "setValueAtTime", '%">', ".game-cover", "50%", "connect", "touchstart", "<br />", ".game-main-btns", "random", "state", "yes", "pow", "error", "each", "#handle", "toString", "buffer", "currentDifficulty", '<div class="gridbox"></div>', "arraybuffer", "#value", "reset", "open", ".answer", "json_tests", "delay", "onload", "uid", "json_diffs", "loop", "log", "removeAttr", "toFixed", "game", 
"#grid", "sin", "keyup", "lives", "height", "#points", "pageY", '[bypass="off"]', '<i class="fa fa-user"></i>', "inactive", "GET", "type", "percent", "<small>Hz</small>", "/sounds/sprite/", "[key-id]", "clientY", "panning", "POST", "model", "offset", "stop", "addClass", "#range, #range-mirror", "preventDefault", "left", "createGain", "touchend", "vals", "compare", "[set]", "fadeOut", "active", "destination", "pageX", "negative", "#game-panel", "min", "sub", "keys", "parents", "append", '<div class="min">', 
"width", "#game-loading", "stages", "positive", "touches", "html", "set", "gain", "text", "#game-ready", "accurate", "play", "space", "wrong_long", ".json?v=", "exponentialRampToValueAtTime", "log10", "slice", "clientX", "decodeAudioData", "zero", "touchmove", "extra_life_value", " [key-id]", "custom", "maxperfect", "webkitAudioContext", "push", "[life-bonus]", "cleared", "round", "[points] span", "name", "send", "/sounds/sprites/", "which", "response", "click", "end", "</div>", "key-status", "css", 
"#stage", "/main.json", "#ranger", "</small>", "perfect", "responseType", "/play/register", "setPosition", "#handle-mirror", "length", "[range] span", "stringify", "ajax", "#space-main, #value, #cartridge, #handle", "[stage] span", "loopEnd", "multiplier_set", "loopStart", "wrong", "removeClass", "game-cleared", "top", "stereo", "<small>left</small>", "duration", "off", "abs", "bass", "val", "bonus", "none", "attr", "icon-", "game-over", "color", "game-ready", "mousemove", "diff", "#range-mirror", 
"keydown", " <small>", "auto", "#range", "pop", "#game-over", "1.00", "minperfect", "originalEvent", "currentTime", "max", "point", "hide", "correct", "<small>right</small>", "middle", "show", "wait", "right", "#game-panel-body", "find", '[set][state="play"] [answer-btn]'];

(function(data, i) {
  /**
   * @param {number} isLE
   * @return {undefined}
   */
  var write = function(isLE) {
    for (; --isLE;) {
      data["push"](data["shift"]());
    }
  };
  write(++i);
})(_0x2ce6, 426);

/**
 * @param {string} i
 * @param {?} parameter1
 * @return {?}
 */
var _0x37ce = function(i, parameter1) {
  /** @type {number} */
  i = i - 0;
  var oembedView = _0x2ce6[i];
  return oembedView;
};

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
var gameContext;
var gameBuffer;
var gameSound;
var gamePlayer;
var spriteMap = {};
/**
 * @return {?}
 */
function getPointMultiplier() {
  /** @type {function(string, ?): ?} */
  var mod12 = _0x37ce;
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
  return pr[mod12("0xa3")] < 21 ? keys[pr["model"]["multiplier_set"]][mod12("0x72")][pr[mod12("0xa3")] - 1] : (pr[mod12("0xa3")] - 20) * keys[pr[mod12("0xb")][mod12("0x5d")]][mod12("0x7f")] + keys[pr["model"]["multiplier_set"]][mod12("0x7e")];
}
/**
 * @return {?}
 */
function getLoopValues() {
  /** @type {function(string, ?): ?} */
  var random = _0x37ce;
  var i = Math[random("0x8c")](Math["random"]() * pr[random("0x8f")]["vals"][random("0x56")])[random("0xa1")]();
  /** @type {number} */
  var collectionID = 0;
  /** @type {number} */
  var end = 0;
  if (pr[random("0x8f")][random("0x14")][random("0x56")] > 0) {
    /** @type {number} */
    collectionID = parseInt(pr[random("0x8f")][random("0x14")][i][random("0x8d")]) / 1E3;
    /** @type {number} */
    end = (parseInt(pr[random("0x8f")][random("0x14")][i]["start"]) + parseInt(pr[random("0x8f")][random("0x14")][i][random("0x65")])) / 1E3;
  } else {
    var number = Object[random("0x1f")](spriteMap)["length"];
    var indexLookupKey = Math["floor"](Math[random("0x9a")]() * number);
    var data = spriteMap[Object["keys"](spriteMap)[indexLookupKey]];
    collectionID = data[random("0x8d")];
    end = data["end"];
  }
  return {
    start : collectionID,
    end : end
  };
}
/**
 * @return {undefined}
 */
function loadSprite() {
  /** @type {function(string, ?): ?} */
  var d3_vendorSymbol = _0x37ce;
  if (pr[d3_vendorSymbol("0x8f")] == null || isset(pr[d3_vendorSymbol("0x8f")]) && pr[d3_vendorSymbol("0x8f")][d3_vendorSymbol("0x56")] == 0) {
    /** @type {number} */
    gameBuffer = 0;
    return;
  }
  if (pr["sprite"]["method"] == "old") {
    gameContext = new (window["AudioContext"] || window[d3_vendorSymbol("0x3d")]);
    gameMasterGain = gameContext[d3_vendorSymbol("0x12")]();
    gameMasterGain[d3_vendorSymbol("0x2a")][d3_vendorSymbol("0x92")](defaultGameVolume, gameContext[d3_vendorSymbol("0x7d")]);
    /** @type {!XMLHttpRequest} */
    gameSound = new XMLHttpRequest;
    gameSound[d3_vendorSymbol("0xa8")](d3_vendorSymbol("0x2"), host + d3_vendorSymbol("0x45") + pr["sprite"]["id"] + "/" + (pr[d3_vendorSymbol("0x8f")][d3_vendorSymbol("0x63")] ? d3_vendorSymbol("0x63") : "mono") + "-128.mp3", !![]);
    gameSound[d3_vendorSymbol("0x52")] = d3_vendorSymbol("0xa5");
    /**
     * @return {undefined}
     */
    gameSound["onload"] = function() {
      /** @type {function(string, ?): ?} */
      var gotoNewOfflinePage = d3_vendorSymbol;
      gameContext[gotoNewOfflinePage("0x36")](gameSound[gotoNewOfflinePage("0x47")], function(canCreateDiscussions) {
        /** @type {number} */
        gameBuffer = canCreateDiscussions;
      });
    };
    gameSound[d3_vendorSymbol("0x44")]();
  } else {
    var precUserLanguage = pr["sprite"][d3_vendorSymbol("0x43")];
    fetchJSONFile(host + d3_vendorSymbol("0x6") + precUserLanguage + d3_vendorSymbol("0x4e"), function(canCreateDiscussions) {
      spriteMap = canCreateDiscussions["spritemap"];
    });
    gameContext = new (window["AudioContext"] || window[d3_vendorSymbol("0x3d")]);
    gameMasterGain = gameContext[d3_vendorSymbol("0x12")]();
    gameMasterGain[d3_vendorSymbol("0x2a")]["setValueAtTime"](defaultGameVolume, gameContext[d3_vendorSymbol("0x7d")]);
    /** @type {!XMLHttpRequest} */
    gameSound = new XMLHttpRequest;
    gameSound[d3_vendorSymbol("0xa8")](d3_vendorSymbol("0x2"), host + "/sounds/sprite/" + precUserLanguage + "/main.mp3", !![]);
    /** @type {string} */
    gameSound[d3_vendorSymbol("0x52")] = "arraybuffer";
    /**
     * @return {undefined}
     */
    gameSound[d3_vendorSymbol("0xac")] = function() {
      /** @type {function(string, ?): ?} */
      var gotoNewOfflinePage = d3_vendorSymbol;
      gameContext[gotoNewOfflinePage("0x36")](gameSound[gotoNewOfflinePage("0x47")], function(canCreateDiscussions) {
        /** @type {number} */
        gameBuffer = canCreateDiscussions;
      });
    };
    gameSound[d3_vendorSymbol("0x44")]();
  }
}
/**
 * @param {!Object} key
 * @return {undefined}
 */
function playFx(key) {
  /** @type {function(string, ?): ?} */
  var unescape = _0x37ce;
  var record = fxMap[key];
  var artistTrack = fxContext[unescape("0x7d")];
  /** @type {number} */
  var GET_AUTH_URL_TIMEOUT = fxMap[key]["end"] - fxMap[key][unescape("0x8d")];
  fxGain = fxContext[unescape("0x12")]();
  fxGain["gain"][unescape("0x92")](pr["fxs"] == "on" ? defaultFXVolume : 0, artistTrack);
  fxPlayer = fxContext[unescape("0x8e")]();
  fxPlayer[unescape("0xa2")] = fxBuffer;
  fxPlayer[unescape("0x96")](fxGain);
  fxGain[unescape("0x96")](fxContext[unescape("0x19")]);
  fxPlayer[unescape("0x8d")](0, record[unescape("0x8d")], GET_AUTH_URL_TIMEOUT);
}
/**
 * @return {undefined}
 */
function loadFxs() {
  /** @type {function(string, ?): ?} */
  var nu = _0x37ce;
  fetchJSONFile(host + nu("0x6") + fxfolder + "/main.json", function(myPreferences) {
    /** @type {function(string, ?): ?} */
    var getPreferenceKey = nu;
    fxMap = myPreferences[getPreferenceKey("0x91")];
  });
  fxContext = new (window["AudioContext"] || window["webkitAudioContext"]);
  /** @type {!XMLHttpRequest} */
  fxSound = new XMLHttpRequest;
  fxSound[nu("0xa8")](nu("0x2"), host + "/sounds/sprite/" + fxfolder + "/main.mp3", !![]);
  fxSound[nu("0x52")] = nu("0xa5");
  /**
   * @return {undefined}
   */
  fxSound[nu("0xac")] = function() {
    /** @type {function(string, ?): ?} */
    var now = nu;
    fxContext[now("0x36")](fxSound[now("0x47")], function(canCreateDiscussions) {
      /** @type {number} */
      fxBuffer = canCreateDiscussions;
    });
  };
  fxSound[nu("0x44")]();
}
/**
 * @param {?} elem
 * @return {undefined}
 */
function muteGame(elem) {
  /** @type {function(string, ?): ?} */
  var toQueryParams = _0x37ce;
  var artistTrack = gameContext[toQueryParams("0x7d")] + 0.6;
  var action = $(elem)["attr"](toQueryParams("0x9b")) == "off" ? "on" : toQueryParams("0x66");
  var previousState = toQueryParams("0x6d") + action;
  var beforeValue = $(elem)["attr"](previousState);
  $(elem)[toQueryParams("0x6c")](toQueryParams("0x9b"), action)[toQueryParams("0x28")](beforeValue);
  gameMasterGain["gain"][toQueryParams("0x32")](action == "on" ? defaultGameVolume : 0.000001, artistTrack);
}
/**
 * @param {?} elem
 * @return {undefined}
 */
function muteFX(elem) {
  /** @type {function(string, ?): ?} */
  var getResponsesAnalysisDataPrefixCacheKey = _0x37ce;
  var groupId = $(elem)["attr"](getResponsesAnalysisDataPrefixCacheKey("0x9b")) == "off" ? "on" : getResponsesAnalysisDataPrefixCacheKey("0x66");
  var url = getResponsesAnalysisDataPrefixCacheKey("0x6d") + groupId;
  var html = $(elem)[getResponsesAnalysisDataPrefixCacheKey("0x6c")](url);
  $(elem)[getResponsesAnalysisDataPrefixCacheKey("0x6c")](getResponsesAnalysisDataPrefixCacheKey("0x9b"), groupId)["html"](html);
  pr["fxs"] = groupId;
}
/**
 * @param {number} value
 * @return {?}
 */
function roundNumber(value) {
  /** @type {function(string, ?): ?} */
  var pow = _0x37ce;
  return Math[pow("0x41")](value * 1E3) / 1E3;
}
/**
 * @return {?}
 */
function extraLifeValue() {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  return Math[gotoNewOfflinePage("0x41")](pr[gotoNewOfflinePage("0xb")][gotoNewOfflinePage("0xb7")] * pr[gotoNewOfflinePage("0xb")][gotoNewOfflinePage("0x39")] * getPointMultiplier());
}
/**
 * @param {!Object} name
 * @param {?} oneofIndex
 * @return {undefined}
 */
function gameAnswer(name, oneofIndex) {
  /** @type {function(string, ?): ?} */
  var require = _0x37ce;
  if (pr["model"]["compare"] == "1" && compareBtnPressed) {
    AnswerCompare(name);
    return;
  }
  if ($(require("0x87"))["attr"](require("0x9b")) === require("0x85")) {
    return;
  }
  $(require("0x87"))["attr"](require("0x9b"), require("0x85"));
  var value;
  if (oneofIndex) {
    value = require("0x81");
    var total_tax = Math[require("0x41")](50 * getPointMultiplier());
    step++;
    total = total + total_tax + (step == pr[require("0xb")][require("0x25")] ? extraLifeValue() : 0);
  } else {
    /** @type {string} */
    value = "wrong";
    pr[require("0xb")][require("0xb7")]--;
    if (step >= 1) {
      /** @type {number} */
      step = step - 1;
    }
  }
  name["attr"](require("0x9b"), value);
  $(require("0xb9"))[require("0x2b")](numberWithCommas(total));
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
  /** @type {function(string, ?): ?} */
  var String = _0x37ce;
  var name;
  var options = $("#stepPoints");
  /** @type {string} */
  var html = "";
  var result;
  if (left >= data[String("0x7b")] && left <= data[String("0x3c")]) {
    /** @type {string} */
    name = "perfect";
    /** @type {string} */
    result = "perfect";
    var value = Math[String("0x41")](100 * getPointMultiplier());
    total = total + value;
    html = options[String("0x6c")](String("0x51")) + " +" + numberWithCommas(value);
    step++;
  } else {
    if (left >= data[String("0x1d")] && left <= data[String("0x7e")]) {
      name = String("0x81");
      result = String("0x81");
      value = getGridAccurancyPoints(v, data[String("0x83")], left);
      var type = Math[String("0x41")](bonus[rangeLevel] * getPointMultiplier());
      total = Math[String("0x41")](total + value + type);
      html = options[String("0x6c")](String("0x2d")) + " +" + numberWithCommas(value) + String("0x98") + options[String("0x6c")](String("0x6a")) + " +" + numberWithCommas(type);
      step++;
    } else {
      /** @type {string} */
      name = "wrong";
      result = String("0x5f");
      html = options[String("0x6c")](String("0x37"));
      pr[String("0xb")][String("0xb7")]--;
    }
  }
  return answerslog["push"]({
    e : name,
    t : Date[String("0x90")](),
    p : total
  }), v == "eq" && accuracylog[String("0x3e")]({
    selected : data[String("0x83")],
    actual : left,
    gap : Math["round"](Math[String("0x67")](hzToPosition(data[String("0x83")]) - hzToPosition(left)))
  }), v == String("0x9") && accuracylog[String("0x3e")]({
    selected : data[String("0x83")],
    actual : left,
    gap : Math["round"](Math[String("0x67")](panToPosition(data["middle"]) - panToPosition(left)))
  }), options["removeClass"](name == "wrong" ? String("0x26") : String("0x1b"))[String("0xe")](name == "wrong" ? "negative" : "positive")["html"](html)[String("0x84")]()[String("0x17")](waitForNext), $("#points")[String("0x2b")](numberWithCommas(total)), playFx(result), $(String("0x4f"))["attr"]("color", name), showLives(), setTimeout(function() {
    /** @type {function(string, ?): ?} */
    var titletemplate = String;
    $(titletemplate("0x4f"))["attr"]("color", "none");
  }, 200), name;
}
/**
 * @param {!Object} range
 * @param {?} value
 * @return {?}
 */
function gridAnswerCheetah(range, value) {
  /** @type {function(string, ?): ?} */
  var require = _0x37ce;
  var S;
  var HelloMethod;
  if (value >= range["min"] && value <= range[require("0x7e")]) {
    S = require("0x81");
    HelloMethod = require("0x81");
    var total_tax = Math[require("0x41")](30 * getPointMultiplier());
    total = total + total_tax;
    step++;
  } else {
    S = require("0x5f");
    HelloMethod = require("0x30");
  }
  return answerslog[require("0x3e")]({
    e : S,
    t : Date["now"](),
    p : total
  }), $(require("0xb9"))[require("0x2b")](numberWithCommas(total)), playFx(HelloMethod), $(require("0x4f"))[require("0x6c")](require("0x6f"), S), setTimeout(function() {
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
  /** @type {function(string, ?): ?} */
  var String = _0x37ce;
  var RULES = $(obj)[String("0x20")]("[answer]");
  $(String("0x8b"))["attr"](String("0x9b"), String("0xa7"));
  RULES[String("0x6c")]("state", "hover");
}
/**
 * @param {!Object} tasks
 * @return {undefined}
 */
function AnswerCompare(tasks) {
  /** @type {function(string, ?): ?} */
  var makeTaskDoneCallBack = _0x37ce;
  var funcsToRun = gameContext["currentTime"];
  switchGainA[makeTaskDoneCallBack("0x2a")][makeTaskDoneCallBack("0x92")](tasks["attr"](makeTaskDoneCallBack("0x29")) == "A" ? 1 : 0, funcsToRun);
  switchGainB[makeTaskDoneCallBack("0x2a")][makeTaskDoneCallBack("0x92")](tasks["attr"](makeTaskDoneCallBack("0x29")) == "B" ? 1 : 0, funcsToRun);
  gameUnpassGain["gain"][makeTaskDoneCallBack("0x92")](1, funcsToRun);
  $(".answer")[makeTaskDoneCallBack("0xb1")](makeTaskDoneCallBack("0x15"));
  tasks[makeTaskDoneCallBack("0x6c")](makeTaskDoneCallBack("0x15"), makeTaskDoneCallBack("0x2e"));
}
/**
 * @param {?} exp
 * @return {undefined}
 */
function moveGridByDirectionKeys(exp) {
  /** @type {function(string, ?): ?} */
  var flag = _0x37ce;
  /** @type {number} */
  var _0x3aa118 = 0.01;
  if (exp == flag("0x11")) {
    /** @type {number} */
    rangerKeys[flag("0x4")] = rangerKeys[flag("0x4")] - _0x3aa118;
  }
  if (exp == flag("0x86")) {
    rangerKeys[flag("0x4")] = rangerKeys["percent"] + _0x3aa118;
  }
  moveRangerByType(rangerKeys["type"], ![], $(flag("0x4f"))[flag("0x23")]() * rangerKeys[flag("0x4")], rangerKeys[flag("0x4")]);
}
/**
 * @param {number} canCreateDiscussions
 * @return {undefined}
 */
function moveGridBySectionKeys(canCreateDiscussions) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  /** @type {number} */
  rangerKeys[gotoNewOfflinePage("0x4")] = (canCreateDiscussions * (100 / 9) - 100 / 18) / 100;
  moveRangerByType(rangerKeys[gotoNewOfflinePage("0x3")], ![], $("#ranger")[gotoNewOfflinePage("0x23")]() * rangerKeys[gotoNewOfflinePage("0x4")], rangerKeys["percent"]);
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
    /** @type {function(string, ?): ?} */
    var parseInt = _0x37ce;
    if (name == "eq") {
      var marginTop = _0x427f15 === 0 ? "&nbsp;" : items[parseInt("0x1d")] + "<small>Hz</small>";
      var activeTabWidth = items[parseInt("0x83")] + "<small>Hz</small>";
    }
    if (name == parseInt("0x9") || name == parseInt("0x3b")) {
      marginTop = Math["abs"](items["min"]);
      activeTabWidth = Math["abs"](items["middle"]);
    }
    $(parseInt("0xb4"))[parseInt("0x21")]('<div style="width:' + 100 / totalSections + parseInt("0x93") + parseInt("0xa4") + '<div class="middle">' + activeTabWidth + parseInt("0x4a") + parseInt("0x22") + marginTop + parseInt("0x4a") + parseInt("0x4a"));
    _0x427f15++;
  });
}
/**
 * @param {string} m
 * @param {boolean} s
 * @return {undefined}
 */
function setupGridOld(m, s) {
  /** @type {function(string, ?): ?} */
  var cut = _0x37ce;
  var window = mobile ? cut("0x38") : cut("0x71");
  var eventType = mobile ? cut("0x13") : "click";
  if (mobile) {
    $(cut("0x4f"))["on"](cut("0x97"), function(message) {
      /** @type {function(string, ?): ?} */
      var c = cut;
      message[c("0x10")]();
    });
  }
  $("#ranger")["on"](window, function(colData) {
    /** @type {function(string, ?): ?} */
    var parseInt = cut;
    if (m == parseInt("0x63")) {
      var focusTilePosY = $(parseInt("0x4f"))["offset"]()[parseInt("0x62")];
      /** @type {number} */
      var childValidation = mobile ? colData[parseInt("0x7c")][parseInt("0x27")][0][parseInt("0xba")] ? colData[parseInt("0x7c")][parseInt("0x27")][0]["pageY"] - focusTilePosY : colData[parseInt("0x7c")]["touches"][0][parseInt("0x8")] - focusTilePosY : colData["pageY"] - focusTilePosY;
      /** @type {number} */
      var scrollbarIdx = (childValidation - 20) / ($(this)[parseInt("0xb8")]() - 40);
      moveRangerByType(m, s, childValidation, scrollbarIdx);
    } else {
      /** @type {number} */
      var drawX = 30;
      focusTilePosY = $(parseInt("0x4f"))[parseInt("0xc")]()[parseInt("0x11")];
      /** @type {number} */
      childValidation = mobile ? colData[parseInt("0x7c")]["touches"][0][parseInt("0x1a")] ? colData[parseInt("0x7c")][parseInt("0x27")][0][parseInt("0x1a")] - drawX : colData[parseInt("0x7c")][parseInt("0x27")][0][parseInt("0x35")] + focusTilePosY - drawX : colData[parseInt("0x1a")] - focusTilePosY;
      /** @type {number} */
      scrollbarIdx = childValidation / $(this)[parseInt("0x23")]();
      moveRangerByType(m, s, childValidation, scrollbarIdx);
    }
  })["on"](eventType, function(canCreateDiscussions) {
    selectRangerByType(m, s);
  })["on"](cut("0x97"), function(message) {
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
  /** @type {function(string, ?): ?} */
  var render = _0x37ce;
  $(render("0x4f"))["on"](render("0x97"), function(result) {
    result["preventDefault"]();
  });
  $(render("0x4f"))["on"](render("0x38"), function(same) {
    /** @type {function(string, ?): ?} */
    var rel2Mstr = render;
    if (domNode == rel2Mstr("0x63")) {
      var RectBegin = $("#ranger")[rel2Mstr("0xc")]()[rel2Mstr("0x62")];
      /** @type {number} */
      var childValidation = same[rel2Mstr("0x7c")]["touches"][0]["pageY"] ? same[rel2Mstr("0x7c")][rel2Mstr("0x27")][0][rel2Mstr("0xba")] - RectBegin : same["originalEvent"]["touches"][0][rel2Mstr("0x8")] - RectBegin;
      /** @type {number} */
      var scrollbarIdx = (childValidation - 20) / ($(this)["height"]() - 40);
      moveRangerByType(domNode, grid, childValidation, scrollbarIdx);
    } else {
      /** @type {number} */
      var RectEnd = 30;
      RectBegin = $(rel2Mstr("0x4f"))[rel2Mstr("0xc")]()[rel2Mstr("0x11")];
      /** @type {number} */
      childValidation = same[rel2Mstr("0x7c")][rel2Mstr("0x27")][0][rel2Mstr("0x1a")] ? same[rel2Mstr("0x7c")][rel2Mstr("0x27")][0]["pageX"] - RectBegin - RectEnd : same[rel2Mstr("0x7c")]["touches"][0]["clientX"] - RectBegin - RectEnd;
      /** @type {number} */
      scrollbarIdx = childValidation / $(this)[rel2Mstr("0x23")]();
      moveRangerByType(domNode, grid, childValidation, scrollbarIdx);
    }
  })["on"]("mousemove", function(myPreferences) {
    /** @type {function(string, ?): ?} */
    var getPreferenceKey = render;
    if (domNode == getPreferenceKey("0x63")) {
      var available = $("#ranger")[getPreferenceKey("0xc")]()[getPreferenceKey("0x62")];
      /** @type {number} */
      var needToFree = myPreferences["pageY"] - available;
      /** @type {number} */
      var scrollbarIdx = (needToFree - 20) / ($(this)[getPreferenceKey("0xb8")]() - 40);
      moveRangerByType(domNode, grid, needToFree, scrollbarIdx);
    } else {
      available = $(getPreferenceKey("0x4f"))[getPreferenceKey("0xc")]()[getPreferenceKey("0x11")];
      /** @type {number} */
      needToFree = myPreferences[getPreferenceKey("0x1a")] - available;
      /** @type {number} */
      scrollbarIdx = needToFree / $(this)[getPreferenceKey("0x23")]();
      moveRangerByType(domNode, grid, needToFree, scrollbarIdx);
    }
  })["on"](render("0x13"), function(canCreateDiscussions) {
    selectRangerByType(domNode, grid);
  })["on"](render("0x48"), function(canCreateDiscussions) {
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
  /** @type {function(string, ?): ?} */
  var create = _0x37ce;
  if (condition == "eq") {
    var value = positionToHz(position);
    var x = getSectionRange("eq", value, key ? 2 : rangeset[rangeLevel]);
    if (value < slideMin || value > slideMax) {
      return;
    }
    if (key) {
      updateFrequency(value);
    }
    $(create("0x77"))[create("0x23")](x[create("0x23")]);
    if (position >= 0.5) {
      $(create("0x77"))[create("0x4c")]({
        left : hzToPosition(x[create("0x1d")]) + "%",
        right : create("0x76")
      });
    } else {
      $("#range")["css"]({
        right : 100 - hzToPosition(x[create("0x7e")]) + "%",
        left : create("0x76")
      });
    }
    $("#handle")["css"](create("0x11"), validation);
    $(create("0xa6"))[create("0x4c")](create("0x11"), validation)["html"](numberWithCommas(value) + create("0x5"))[create("0x6c")](create("0x69"), value);
  }
  if (condition == "panning") {
    var value = positionToPan(position);
    x = getSectionRange(create("0x9"), value, 0);
    if (value > 0.93 || value < -0.93) {
      return;
    }
    if (key) {
      updatePan(getPanSet(value));
    }
    $(create("0x77"))[create("0x23")](x["width"]);
    $("#value")[create("0x4c")](create("0x11"), validation)[create("0x6c")](create("0x69"), value);
    $(create("0xa0"))[create("0x4c")]("left", validation);
    if (value < 0) {
      $("#range")["css"]({
        right : 100 - position * 100 + "%",
        left : create("0x76"),
        "margin-right" : x[create("0x23")] / 2 * -1
      });
      $("#value")["html"](Math[create("0x67")](value) + create("0x64"));
    } else {
      $(create("0x77"))[create("0x4c")]({
        left : position * 100 + "%",
        right : create("0x76"),
        "margin-left" : x["width"] / 2 * -1
      });
      $(create("0xa6"))["html"](Math[create("0x67")](value) + "<small>right</small>");
    }
  }
  if (condition == create("0x63")) {
    /** @type {number} */
    value = Math[create("0x41")]((1 - position) * 100) / 100;
    x = getSectionRange(create("0x9"), value, 0);
    if (value > 1 || value < 0) {
      return;
    }
    if (key) {
      updateStereo(getPanSet(value));
    }
    $(create("0xa6"))["attr"](create("0x69"), value)[create("0x28")](Math[create("0x67")](value));
    $(create("0xf"))[create("0x23")](x["width"]);
    $(create("0x77"))[create("0x4c")]({
      left : position * 50 + "%",
      right : "auto",
      "margin-left" : x[create("0x23")] / 2 * -1
    });
    $(create("0x73"))[create("0x4c")]({
      right : position * 50 + "%",
      left : create("0x76"),
      "margin-right" : x[create("0x23")] / 2 * -1
    });
    $("#handle")[create("0x4c")](create("0x11"), position * 50 + "%");
    $(create("0x55"))[create("0x4c")](create("0x86"), position * 50 + "%");
  }
  if (condition == create("0x2f")) {
    value = positionToPan(position);
    x = getSectionRange("space", value, 0);
    if (value > 0.98 || value < -0.98) {
      return;
    }
    $(create("0x5a"))[create("0x4c")]("left", validation)[create("0x6c")](create("0x69"), value);
    $(create("0xa6"))["attr"](create("0x69"), value);
    if (value < 0) {
      $(create("0x77"))[create("0x4c")]({
        right : 100 - position * 100 + "%",
        left : create("0x76"),
        "margin-right" : x[create("0x23")] / 2 * -1
      });
      $(create("0xa6"))["html"](Math[create("0x67")](value) + create("0x64"));
    } else {
      $(create("0x77"))[create("0x4c")]({
        left : position * 100 + "%",
        right : "auto",
        "margin-left" : x[create("0x23")] / 2 * -1
      });
      $(create("0xa6"))[create("0x28")](Math[create("0x67")](value) + create("0x82"));
    }
  }
  if (condition == create("0x3b")) {
    value = positionToValue(position);
    x = getSectionRange("custom", value, 0);
    if (value > maxRandValue || value < minRandValue) {
      return;
    }
    if (key) {
      updateGrid(value);
    }
    $("#range")["width"](x[create("0x23")]);
    $(create("0xa6"))[create("0x4c")](create("0x11"), validation)["attr"](create("0x69"), value);
    $(create("0xa0"))["css"](create("0x11"), validation);
    $(create("0x77"))["css"]({
      left : position * 100 + "%",
      right : create("0x76"),
      "margin-left" : x["width"] / 2 * -1
    });
    $(create("0xa6"))[create("0x28")](value + create("0x75") + gridValueLabel + create("0x50"));
  }
}
/**
 * @param {string} condition
 * @param {string} str
 * @return {undefined}
 */
function selectRangerByType(condition, str) {
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  if (str || $(titletemplate("0x87"))[titletemplate("0x6c")](titletemplate("0x9b")) === titletemplate("0x85")) {
    return;
  }
  if (condition == "eq") {
    /** @type {number} */
    var result = parseInt($(titletemplate("0xa6"))[titletemplate("0x6c")]("val"));
    var data = globalFrq;
    showResult(result, data);
  }
  if (condition == titletemplate("0x9") || condition == titletemplate("0x63")) {
    /** @type {number} */
    var result = parseFloat($(titletemplate("0xa6"))[titletemplate("0x6c")](titletemplate("0x69")));
    var event = pan;
    showResult(result, event);
  }
  if (condition == titletemplate("0x2f")) {
    /** @type {number} */
    result = parseFloat($("#value")[titletemplate("0x6c")](titletemplate("0x69")));
    event = mode == titletemplate("0xb3") ? pan : bonusPanPosition;
    shot(result, event);
  }
  if (condition == titletemplate("0x3b")) {
    /** @type {number} */
    var result = parseFloat($(titletemplate("0xa6"))[titletemplate("0x6c")]("val"));
    showResult(result);
  }
}
/**
 * @param {string} name
 * @return {?}
 */
function getGridSections(name) {
  /** @type {function(string, ?): ?} */
  var _ = _0x37ce;
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
        min : Math[_("0x9d")](2, i) * minHZscale,
        max : Math[_("0x9d")](2, i + 1) * minHZscale,
        middle : Math[_("0x41")](Math["pow"](2, i + 0.5) * minHZscale),
        WidthMin : _0x309a05,
        WidthMax : _0x309a05 + 100 / totalSections,
        LogarithmicVal : Math["pow"](2, i)
      };
      /** @type {number} */
      _0x309a05 = _0x309a05 + 100 / totalSections;
    }
  }
  if (name == _("0x9")) {
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
  if (name == _("0x3b")) {
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
  /** @type {function(string, ?): ?} */
  var create = _0x37ce;
  if (comparator == "eq") {
    var result = getSectionRange("eq", defaultHz, left);
    $(create("0xa0"))[create("0x4c")](create("0x11"), create("0x95"));
    $(create("0xa6"))[create("0x4c")]("left", create("0x95"))[create("0x28")](defaultHz + create("0x5"));
    $(create("0x77"))["width"](result[create("0x23")])[create("0x4c")]({
      left : hzToPosition(result[create("0x1d")]) + "%",
      right : "auto"
    });
  }
  if (comparator == create("0x9")) {
    result = getSectionRange("panning", left, 0);
    $(create("0xa0"))[create("0x4c")](create("0x11"), create("0x95"));
    $("#value")[create("0x4c")]("left", "50%")[create("0x28")]("0");
    $(create("0x77"))[create("0x23")](result[create("0x23")])[create("0x4c")]({
      left : create("0x95"),
      right : "auto",
      "margin-left" : result[create("0x23")] / 2 * -1
    });
  }
  if (comparator == create("0x2f")) {
    result = getSectionRange(create("0x2f"), left, 0);
    $(create("0xa0"))["css"](create("0x11"), create("0x95"));
    $(create("0xa6"))[create("0x4c")](create("0x11"), create("0x95"))["html"]("0");
    $(create("0x77"))[create("0x23")](result[create("0x23")])[create("0x4c")]({
      left : create("0x95"),
      right : "auto",
      "margin-left" : result[create("0x23")] / 2 * -1
    });
  }
  if (comparator == create("0x3b")) {
    result = getSectionRange(create("0x3b"), left, 0);
    $(create("0xa0"))["css"]("left", create("0x95"));
    $(create("0xa6"))[create("0x4c")](create("0x11"), "50%")[create("0x28")](gridDefaultValue + " <small>" + gridValueLabel + "</small>");
    $("#range")[create("0x23")](result["width"])[create("0x4c")]({
      left : create("0x95"),
      right : create("0x76"),
      "margin-left" : result[create("0x23")] / 2 * -1
    });
  }
}
/**
 * @param {string} type
 * @param {undefined} i
 * @return {undefined}
 */
function setGridRangeWidth(type, i) {
  /** @type {function(string, ?): ?} */
  var getListType = _0x37ce;
  if (type == "eq") {
    var idx = getSectionRange("eq", defaultHz, i);
  }
  if (type == getListType("0x9") || type == "space") {
    idx = getSectionRange(getListType("0x9"), i, 0);
  }
  if (type == getListType("0x3b")) {
    idx = getSectionRange(getListType("0x3b"), i, 0);
  }
  $("#range")[getListType("0x23")](idx[getListType("0x23")]);
}
/**
 * @param {(!Function|string)} name
 * @param {number} x
 * @param {number} i
 * @return {?}
 */
function getSectionRange(name, x, i) {
  /** @type {function(string, ?): ?} */
  var get = _0x37ce;
  if (name == "eq") {
    var data = {};
    /** @type {number} */
    var r = i / 2;
    return data["min"] = x * Math[get("0x9d")](2, -r), data[get("0x7e")] = x * Math[get("0x9d")](2, r), data[get("0x83")] = x, data[get("0x7b")] = x * Math[get("0x9d")](2, -0.125), data[get("0x3c")] = x * Math[get("0x9d")](2, 0.125), data[get("0x23")] = $("#ranger")["width"]() / totalSections * i, data;
  }
  if (name == get("0x9") || name == get("0x2f")) {
    /** @type {number} */
    var legend_width = 0.1;
    data = {};
    /** @type {number} */
    r = rangeset[rangeLevel] / 2;
    return data[get("0x1d")] = roundNumber(x - legend_width * 2 * r), data[get("0x7e")] = roundNumber(x + legend_width * 2 * r), data["middle"] = roundNumber(x), data[get("0x7b")] = roundNumber(x - legend_width / 2), data[get("0x3c")] = roundNumber(x + legend_width / 2), data[get("0x23")] = $(get("0x4f"))["width"]() / totalSections * rangeset[rangeLevel], data;
  }
  if (name == "custom") {
    data = {};
    /** @type {number} */
    r = rangeset[rangeLevel] / 2;
    return data[get("0x1d")] = roundNumber(x - gridScale * 2 * r), data[get("0x7e")] = roundNumber(x + gridScale * 2 * r), data[get("0x83")] = roundNumber(x), data[get("0x7b")] = roundNumber(x - gridScale / 2), data[get("0x3c")] = roundNumber(x + gridScale / 2), data[get("0x23")] = $(get("0x4f"))["width"]() / totalSections * rangeset[rangeLevel], data;
  }
}
/**
 * @param {number} name
 * @return {?}
 */
function positionToHz(name) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  return Math["round"](minHZscale * Math[gotoNewOfflinePage("0x9d")](2, totalSections * name));
}
/**
 * @param {?} deltaX
 * @return {?}
 */
function hzToPosition(deltaX) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  return Math[gotoNewOfflinePage("0xb0")](deltaX / minHZscale) / Math[gotoNewOfflinePage("0xb0")](Math["pow"](2, totalSections)) * 100;
}
/**
 * @param {number} value
 * @return {?}
 */
function getKeyByHz(value) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  return roundNumber(12 * Math["log10"](value / 440) / Math[gotoNewOfflinePage("0x33")](2) + 69);
}
/**
 * @param {?} value
 * @return {?}
 */
function volumeToDB(value) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  return Math[gotoNewOfflinePage("0xb0")](value) / Math["log"](10) * 20;
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
  /** @type {function(string, ?): ?} */
  var state = _0x37ce;
  if (val == "eq") {
    /** @type {number} */
    var number = 2 * getPointMultiplier();
    return Math[state("0x67")](Math["round"]((21 - Math[state("0x67")](getKeyByHz(key) - getKeyByHz(value))) * number));
  }
  if (val == state("0x9")) {
    /** @type {number} */
    var minFluct = 0;
    /** @type {number} */
    number = 15 * getPointMultiplier();
    return key > 0 && value > 0 || key < 0 && value < 0 ? minFluct = Math[state("0x67")](value - key) * 10 : minFluct = (Math["abs"](value) + Math[state("0x67")](key)) * 10, Math[state("0x41")](number * (3 - minFluct));
  }
  if (val == state("0x3b")) {
    return Math[state("0x41")]((30 - Math[state("0x67")](value - key)) * 1.7 * getPointMultiplier());
  }
}
/**
 * @return {?}
 */
function getRandomPanValue() {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  return (Math["floor"](Math[gotoNewOfflinePage("0x9a")]() * 186) - 93) / 100;
}
/**
 * @param {number} level
 * @return {?}
 */
function getPanSet(level) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  /** @type {number} */
  var val = level * 90;
  /** @type {number} */
  var value = val + 90;
  var _0x28c91d = Math[gotoNewOfflinePage("0xb5")](val * (Math["PI"] / 180));
  var _0x54f1fa = Math[gotoNewOfflinePage("0xb5")](value * (Math["PI"] / 180));
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
  /** @type {function(string, ?): ?} */
  var getValueAt = _0x37ce;
  return roundNumber(position * 100 + gridStartingPoint)[getValueAt("0xb2")](1);
}
/**
 * @return {?}
 */
function getRandomFrequency() {
  /** @type {function(string, ?): ?} */
  var now = _0x37ce;
  /** @type {!Array} */
  var updatedEdgesById = [];
  return $[now("0x9f")](getGridSections("eq"), function(canCreateDiscussions, totalRange) {
    /** @type {function(string, ?): ?} */
    var edgeId = now;
    updatedEdgesById[edgeId("0x3e")](Math[edgeId("0x8c")](Math[edgeId("0x9a")]() * (totalRange[edgeId("0x7e")] - totalRange["min"] + 1) + totalRange[edgeId("0x1d")]));
  }), updatedEdgesById["shift"](), updatedEdgesById[now("0x78")](), updatedEdgesById[Math[now("0x8c")](Math["random"]() * updatedEdgesById[now("0x56")])];
}
/**
 * @return {undefined}
 */
function resetKeyboardKeys() {
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  $(titletemplate("0x7"))[titletemplate("0x9f")](function() {
    /** @type {function(string, ?): ?} */
    var gotoNewOfflinePage = titletemplate;
    $(this)["attr"](gotoNewOfflinePage("0x4b"), gotoNewOfflinePage("0x1"));
  });
}
/**
 * @param {string} picSize
 * @return {undefined}
 */
function activateKeyboardKeys(picSize) {
  /** @type {function(string, ?): ?} */
  var getQunitPath = _0x37ce;
  $("#" + picSize + getQunitPath("0x3a"))["each"](function() {
    /** @type {function(string, ?): ?} */
    var gotoNewOfflinePage = getQunitPath;
    $(this)[gotoNewOfflinePage("0x6c")](gotoNewOfflinePage("0x4b"), gotoNewOfflinePage("0x18"));
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
    /** @type {function(string, ?): ?} */
    var reloadOptions = _0x37ce;
    return abbr = abbr || 2, ("00" + value)[reloadOptions("0x34")](-abbr);
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
    /** @type {function(string, ?): ?} */
    var mapFragmentAndProps = _0x37ce;
    return options = options || 2, ("00" + src)[mapFragmentAndProps("0x34")](-options);
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
  /** @type {function(string, ?): ?} */
  var B = _0x37ce;
  $(document)[B("0x74")](function(result) {
    /** @type {function(string, ?): ?} */
    var a = B;
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
  $(document)[B("0xb6")](function(result) {
    /** @type {function(string, ?): ?} */
    var key = B;
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
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  if (pr[titletemplate("0xb")][titletemplate("0x15")] == "1") {
    if (compareBtnPressed) {
      /** @type {boolean} */
      compareBtnPressed = ![];
      $(titletemplate("0x1c"))[titletemplate("0x6c")]("compare", titletemplate("0x66"));
      $(".game-main-btns")[titletemplate("0x84")]();
      GameContinue();
    } else {
      /** @type {boolean} */
      compareBtnPressed = !![];
      $("#game-panel")["attr"](titletemplate("0x15"), "on");
      $(titletemplate("0x99"))[titletemplate("0x80")]();
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
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  if (canWait) {
    gamePlayer[titletemplate("0xd")](0);
    $(titletemplate("0xa9"))["removeAttr"](titletemplate("0x15"));
    if (pr["model"]["lives"] === 0) {
      endGame(![]);
      return;
    } else {
      if (step == pr["model"][titletemplate("0x25")]) {
        endGame(!![]);
        return;
      } else {
        /** @type {boolean} */
        canContinue = ![];
        /** @type {boolean} */
        canWait = ![];
        setGame();
        $("#stage")[titletemplate("0x2b")](step + 1);
      }
    }
  }
}
/**
 * @return {undefined}
 */
function bypassOn() {
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  $(titletemplate("0xbb"))[titletemplate("0x6c")]("active", "no");
  $(titletemplate("0x8a"))[titletemplate("0x6c")](titletemplate("0x18"), titletemplate("0x9c"));
  var artistTrack = gameContext[titletemplate("0x7d")];
  gameBypassGain["gain"][titletemplate("0x92")](1, artistTrack);
  gameUnpassGain[titletemplate("0x2a")]["setValueAtTime"](0, artistTrack);
}
/**
 * @return {undefined}
 */
function bypassOff() {
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  $('[bypass="off"]')["attr"](titletemplate("0x18"), titletemplate("0x9c"));
  $(titletemplate("0x8a"))["attr"](titletemplate("0x18"), "no");
  var funcsToRun = gameContext["currentTime"];
  gameUnpassGain[titletemplate("0x2a")][titletemplate("0x92")](1, funcsToRun);
  gameBypassGain["gain"][titletemplate("0x92")](0, funcsToRun);
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
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  if ($(titletemplate("0x16"))[titletemplate("0x56")] < 0) {
    $(titletemplate("0x89"))[titletemplate("0x48")]();
  }
  if ($(titletemplate("0x4f"))[titletemplate("0x56")] && $(titletemplate("0x87"))[titletemplate("0x6c")](titletemplate("0x9b")) === titletemplate("0x2e")) {
    selectRangerByType(rangerKeys[titletemplate("0x3")], ![]);
  }
}
/**
 * @param {number} a
 * @param {number} b
 * @return {?}
 */
function randomBetween(a, b) {
  /** @type {function(string, ?): ?} */
  var floor = _0x37ce;
  return Math[floor("0x8c")](Math[floor("0x9a")]() * (b * 10 - a * 10 + 1) + a * 10) / 10;
}
/**
 * @param {number} precision
 * @param {string} scale
 * @return {?}
 */
function randomBetweenInts(precision, scale) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  return Math["floor"](Math[gotoNewOfflinePage("0x9a")]() * (scale - precision + 1) + precision);
}
/**
 * @return {undefined}
 */
function loadingStatusCheck() {
  /** @type {number} */
  triggerInterval = setInterval(function() {
    /** @type {function(string, ?): ?} */
    var getConsoleMethod = _0x37ce;
    try {
      if (typeof gameBuffer !== "undefined" && typeof fxBuffer !== "undefined") {
        clearInterval(triggerInterval);
        $(".game-cover")[getConsoleMethod("0x60")]("active");
        setGame();
      }
    } catch (previousState) {
      console[getConsoleMethod("0x9e")](previousState);
    }
  }, 300);
}
/**
 * @param {boolean} playerOut
 * @return {undefined}
 */
function endGame(playerOut) {
  /** @type {function(string, ?): ?} */
  var pluralize = _0x37ce;
  if (playerOut) {
    playFx(pluralize("0x40"));
  }
  var data = {
    type : pr["type"],
    sub : pr[pluralize("0x1e")],
    uid : pr[pluralize("0xad")],
    model : pr["model"]["id"],
    points : total,
    difficulty : isset(pr["currentDifficulty"]) ? pr["currentDifficulty"] : 0,
    completed : playerOut ? pluralize("0x9c") : "no",
    log : JSON[pluralize("0x58")](answerslog),
    accuracy : JSON["stringify"](accuracylog)
  };
  $[pluralize("0x59")]({
    url : baseUrl + pluralize("0x53"),
    type : pluralize("0xa"),
    data : data,
    success : function() {
      /** @type {function(string, ?): ?} */
      var titletemplate = pluralize;
      $(".game-cover")[titletemplate("0x60")](titletemplate("0x18"));
      resetKeyboardKeys();
      if (playerOut) {
        $("#game-cleared")[titletemplate("0xe")](titletemplate("0x18"));
        activateKeyboardKeys(titletemplate("0x61"));
      } else {
        $(titletemplate("0x79"))[titletemplate("0xe")](titletemplate("0x18"));
        activateKeyboardKeys(titletemplate("0x6e"));
      }
    },
    error : function(data, message, result) {
      /** @type {function(string, ?): ?} */
      var temp_err = pluralize;
      console[temp_err("0xb0")](data, message, result);
    }
  });
}
/**
 * @return {undefined}
 */
function nextStage() {
  /** @type {function(string, ?): ?} */
  var unwrap = _0x37ce;
  rangeLevel++;
  stage++;
  /** @type {number} */
  step = 0;
  /** @type {boolean} */
  var _0x4757c3 = ![];
  var el = Math["round"](bonus[rangeLevel] * getPointMultiplier());
  total = total + el + (stage == pr[unwrap("0xb")][unwrap("0x25")] ? extraLifeValue() : 0);
  $(unwrap("0xb9"))[unwrap("0x2b")](numberWithCommas(total));
  if (stage == pr[unwrap("0xb")][unwrap("0x25")]) {
    endGame(!![]);
    return;
  }
  $(unwrap("0x4d"))[unwrap("0x2b")](stage + 1);
  if (stage == 2 || stage == 4) {
    pr["model"][unwrap("0xb7")]++;
    showLives();
    /** @type {boolean} */
    _0x4757c3 = !![];
  }
  var mirror = $("#game-stage");
  mirror[unwrap("0x88")](unwrap("0x5b"))["html"](stage + 1);
  mirror[unwrap("0x88")](unwrap("0x57"))[unwrap("0x28")](rangeset[rangeLevel]);
  mirror[unwrap("0x88")](unwrap("0x42"))["html"](el);
  if (_0x4757c3) {
    mirror[unwrap("0x88")](unwrap("0x3f"))[unwrap("0x84")]();
  } else {
    mirror[unwrap("0x88")](unwrap("0x3f"))[unwrap("0x80")]();
  }
  mirror[unwrap("0xe")](unwrap("0x18"));
  setTimeout(function() {
    loadNext();
  }, waitForNext);
}
/**
 * @param {!Object} instancesTypes
 * @return {undefined}
 */
function registerPlay(instancesTypes) {
  /** @type {function(string, ?): ?} */
  var getBaseURL = _0x37ce;
  $[getBaseURL("0x59")]({
    url : baseUrl + getBaseURL("0x53"),
    type : "POST",
    data : instancesTypes,
    success : function(a) {
      /** @type {function(string, ?): ?} */
      var topPrice = getBaseURL;
      console[topPrice("0xb0")](a);
    },
    error : function(msg, t, val) {
      console["log"](msg, t, val);
    }
  });
}
/**
 * @return {undefined}
 */
function loadJsons() {
  /** @type {function(string, ?): ?} */
  var getAlignItem = _0x37ce;
  var alignContentAlignItem = getAlignItem("0x7a");
  if (pr["model"][getAlignItem("0xaa")] == "1") {
    fetchJSONFile(host + "/play/jsons/tests/" + pr[getAlignItem("0xb")]["id"] + getAlignItem("0x31") + alignContentAlignItem, function(solo) {
      /** @type {number} */
      tests = solo;
    });
  }
  if (pr["model"][getAlignItem("0xae")] == "1") {
    fetchJSONFile(host + "/play/jsons/diffs/" + pr["model"]["id"] + getAlignItem("0x31") + alignContentAlignItem, function(abDiff) {
      /** @type {number} */
      diff = abDiff;
    });
  }
}
/**
 * @return {undefined}
 */
function showLives() {
  /** @type {function(string, ?): ?} */
  var createFreeSpaceRowHtml = _0x37ce;
  var _0x35734d;
  /** @type {string} */
  var html = "";
  /** @type {number} */
  _0x35734d = 0;
  for (; _0x35734d < pr[createFreeSpaceRowHtml("0xb")]["lives"]; _0x35734d++) {
    /** @type {string} */
    html = html + createFreeSpaceRowHtml("0x0");
  }
  $("#lives")["html"](html);
}
/**
 * @param {?} received_data
 * @return {undefined}
 */
function switchSound(received_data) {
  /** @type {function(string, ?): ?} */
  var parseInt = _0x37ce;
  var key = $(received_data)[parseInt("0x6c")]("stype");
  if (key == "stereo") {
    switchStereoSound();
    return;
  }
  gamePlayer[parseInt("0xd")](0);
  var frontpageItems = getLoopValues();
  gamePlayer = gameContext[parseInt("0x8e")]();
  gamePlayer[parseInt("0xa2")] = gameBuffer;
  if (key == "peak" || key == "cut" || key == parseInt("0x68")) {
    gamePlayer["connect"](gameBypassGain);
    gamePlayer[parseInt("0x96")](gameFilter);
  }
  if (key == "pan") {
    gamePlayer[parseInt("0x96")](gamePan);
    gamePan[parseInt("0x96")](gameMasterGain);
  }
  if (key == "db") {
    gamePlayer[parseInt("0x96")](sliderGain);
    sliderGain["connect"](gameContext["destination"]);
  }
  if (key == parseInt("0xab")) {
    gamePlayer[parseInt("0x96")](dryGain);
    dryGain[parseInt("0x96")](gameMasterGain);
    gameMasterGain[parseInt("0x96")](gameContext[parseInt("0x19")]);
    gamePlayer[parseInt("0x96")](gameDelay);
    gameDelay[parseInt("0x96")](gameMasterGain);
    gameMasterGain[parseInt("0x96")](gameContext[parseInt("0x19")]);
  }
  if (key == "eq") {
    gamePlayer[parseInt("0x96")](gameBypassGain);
    gameBypassGain["connect"](gameMasterGain);
    gamePlayer[parseInt("0x96")](gameFilters[0]);
    var prop;
    /** @type {number} */
    prop = 0;
    for (; prop < bands[parseInt("0x56")] - 1; prop++) {
      gameFilters[prop][parseInt("0x96")](gameFilters[prop + 1]);
    }
    gameFilters[bands[parseInt("0x56")] - 1][parseInt("0x96")](gameUnpassGain);
    gameUnpassGain["connect"](gameMasterGain);
    gameMasterGain[parseInt("0x96")](gameContext[parseInt("0x19")]);
  }
  gameMasterGain["connect"](gameContext[parseInt("0x19")]);
  /** @type {boolean} */
  gamePlayer[parseInt("0xaf")] = !![];
  gamePlayer[parseInt("0x5e")] = frontpageItems[parseInt("0x8d")];
  gamePlayer[parseInt("0x5c")] = frontpageItems[parseInt("0x49")];
  gamePlayer[parseInt("0x8d")](0, frontpageItems[parseInt("0x8d")]);
}
/**
 * @return {undefined}
 */
function switchStereoSound() {
  /** @type {function(string, ?): ?} */
  var rel2Mstr = _0x37ce;
  gamePlayerLeft["stop"](0);
  gamePlayerRight[rel2Mstr("0xd")](0);
  var same = getStereoLoopValues();
  gamePlayerLeft = gameContext[rel2Mstr("0x8e")]();
  gamePlayerRight = gameContext[rel2Mstr("0x8e")]();
  gamePlayerLeft[rel2Mstr("0xa2")] = gameBuffer;
  gamePlayerRight[rel2Mstr("0xa2")] = gameBuffer;
  gamePlayerLeft["connect"](gamePanLeft);
  gamePlayerRight["connect"](gamePanRight);
  gamePanLeft[rel2Mstr("0x96")](gameMasterGain);
  gamePanRight["connect"](gameMasterGain);
  gameMasterGain["connect"](gameContext[rel2Mstr("0x19")]);
  /** @type {boolean} */
  gamePlayerLeft[rel2Mstr("0xaf")] = !![];
  gamePlayerLeft["loopStart"] = same[rel2Mstr("0x11")][rel2Mstr("0x8d")];
  gamePlayerLeft[rel2Mstr("0x5c")] = same[rel2Mstr("0x11")][rel2Mstr("0x49")];
  gamePlayerLeft[rel2Mstr("0x8d")](0, same[rel2Mstr("0x11")][rel2Mstr("0x8d")]);
  /** @type {boolean} */
  gamePlayerRight[rel2Mstr("0xaf")] = !![];
  gamePlayerRight["loopStart"] = same[rel2Mstr("0x86")][rel2Mstr("0x8d")];
  gamePlayerRight[rel2Mstr("0x5c")] = same[rel2Mstr("0x86")][rel2Mstr("0x49")];
  gamePlayerRight["start"](0, same[rel2Mstr("0x86")][rel2Mstr("0x8d")]);
}
/**
 * @param {?} row
 * @return {undefined}
 */
function updateFrequency(row) {
  /** @type {function(string, ?): ?} */
  var sinc = _0x37ce;
  gameFilter["frequency"]["setValueAtTime"](row, gameContext[sinc("0x7d")]);
}
/**
 * @param {!Array} lng
 * @return {undefined}
 */
function updatePan(lng) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  gamePan[gotoNewOfflinePage("0x54")](lng[0], lng[1], lng[2]);
}
/**
 * @param {!Array} canCreateDiscussions
 * @return {undefined}
 */
function updateStereo(canCreateDiscussions) {
  /** @type {function(string, ?): ?} */
  var gotoNewOfflinePage = _0x37ce;
  gamePanLeft[gotoNewOfflinePage("0x54")](canCreateDiscussions[0] * -1, canCreateDiscussions[1], canCreateDiscussions[2]);
  gamePanRight[gotoNewOfflinePage("0x54")](canCreateDiscussions[0], canCreateDiscussions[1], canCreateDiscussions[2]);
}
/**
 * @return {undefined}
 */
function startGame() {
  /** @type {function(string, ?): ?} */
  var html = _0x37ce;
  $(html("0x94"))[html("0x60")](html("0x18"));
  $(html("0x2c"))[html("0xe")]("active");
  resetKeyboardKeys();
  activateKeyboardKeys(html("0x70"));
}
/**
 * @return {undefined}
 */
function loadGame() {
  /** @type {function(string, ?): ?} */
  var titletemplate = _0x37ce;
  $(titletemplate("0x94"))[titletemplate("0x60")](titletemplate("0x18"));
  $(titletemplate("0x24"))[titletemplate("0xe")]("active");
  loadSprite();
  loadFxs();
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