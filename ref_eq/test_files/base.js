'use strict';

var diff;
var defaultGameVolume = 0.6;
var triggerInterval;
var gameMasterGain;

// main AudioContext object of the app
var gameContext;
var gameBuffer;
var gameSourceNode;
var spriteMap = {};
var playing = false;

var currentlySelectedBand = 'highpass';
var audioElement;
var track;

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

// set up window.AudioContext
function loadSprite() {
  gameContext = new (window["AudioContext"] || window["webkitAudioContext"]);
  gameMasterGain = gameContext["createGain"]();
  // load some sound
  audioElement = document.querySelector('#song1');
  console.log(audioElement)
  gameSourceNode = gameContext.createMediaElementSource(audioElement);
  
  gameMasterGain["gain"]["setValueAtTime"](defaultGameVolume, gameContext["currentTime"]);
}

function positionToHz(name) {
  return Math["round"](minHZscale * Math["pow"](2, totalSections * name));
}

function hzToPosition(deltaX) {
  return Math["log"](deltaX / minHZscale) / Math["log"](Math["pow"](2, totalSections)) * 100;
}

function getRandomFrequency() {
  var updatedEdgesById = [];
  return $["each"](getGridSections("eq"), function(canCreateDiscussions, totalRange) {
    updatedEdgesById["push"](Math["floor"](Math["random"]() * (totalRange["max"] - totalRange["min"] + 1) + totalRange["min"]));
  }), updatedEdgesById["shift"](), updatedEdgesById["pop"](), updatedEdgesById[Math["floor"](Math["random"]() * updatedEdgesById["length"])];
}

function randomBetween(a, b) {
  return Math["floor"](Math["random"]() * (b * 10 - a * 10 + 1) + a * 10) / 10;
}

function randomBetweenInts(precision, scale) {
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

function startGame() {
  $(".game-cover")["removeClass"]("active");
  $("#game-ready")["addClass"]("active");
}

function loadGame() {
  $(".game-cover")["removeClass"]("active");
  $("#game-loading")["addClass"]("active");

  // LOAD AudioContext and fetch main audio files - set them to buffer
  loadSprite();

  setTimeout(function() {
    loadingStatusCheck();
  }, 800);
}

function SelectBand(bandName, source) {
  $(".selected", "#bandsAdd").removeClass("selected");
  $(source).addClass("selected")
  currentlySelectedBand = bandName

  // TODO: create new band of given type
}