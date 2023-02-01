'use strict';

var prototype;
var steps = [];
var total = 0;
var step = 0;
var totalPoints = 0;

function finishTest() {
  var artistTrack = 3.2;
  if (totalPoints > 250) {
    artistTrack = 94.2;
  } else {
    if (totalPoints > 180) {
      artistTrack = 87.1;
    } else {
      if (totalPoints > 130) {
        artistTrack = 72.8;
      } else {
        if (totalPoints > 98) {
          artistTrack = 58.7;
        } else {
          if (totalPoints > 75) {
            artistTrack = 46.4;
          } else {
            if (totalPoints > 45) {
              artistTrack = 31.6;
            }
          }
        }
      }
    }
  }
  $("[better-then]")['text'](artistTrack);
  playFx('cleared');
  $(".game-cover")['removeClass']('active');
  $("#game-compare")['addClass']('active');
  resetKeyboardKeys();
  activateKeyboardKeys('game-cleared');
}

function CustomGoNext() {
  if (step == pr['model']["stages"]) {
    finishTest();
    return;
  } else {
    getNextBands();
    $('#stage')["text"](step + 1);
  }
}

function submitEqMirrorResult(id_local) {
  updateMeter(id_local, 'midline');
  if (parseInt(id_local) >= perfectPercent) {
    result = "perfect";
  } else {
    if (parseInt(id_local) >= percentAccuracy) {
      result = "correct";
      total++;
    } else {
      result = 'wrong';
    }
  }
  totalPoints = totalPoints + parseInt(id_local);
  step++;
  $('#points')['text'](totalPoints);
  playFx(result);
  RevealOriginal(result);
}

function getNextBands() {
  steps = ['LC-N-N', 'LC-PK1-N', 'LC-N-HC'];

  percentAccuracy = 40;
  prototype = prototypes[steps[step]];
  deviation = prototype['deviation'];
  var target = prototype["options"];
  var PL$29 = Object['keys'](target)["length"];
  var type = getWholeBetween([1, PL$29]);
  var method = target[type];
  loadNext(method);
};
