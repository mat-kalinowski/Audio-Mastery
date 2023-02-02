'use strict';

var prototype;
var steps = [];
var total = 0;
var step = 0;
var totalPoints = 0;

function getNextBands() {
  // code example: 
  // LC-N-N : LOW CUT - NO FILTER - NO FILTER
  steps = ['LC-N-N', 'LC-PK1-N', 'LC-N-HC'];

  percentAccuracy = 40;

  // step changes on every level
  prototype = prototypes[steps[step]];
  deviation = prototype['deviation'];

  // target is a single eq band - low cut, peaking band etc.
  var target = prototype["options"];

  var length = Object['keys'](target)["length"];

  // Pick random option from given scenerio - for variation
  var type = getWholeBetween([1, length]);
  var scenario = target[type];

  // Load given scenerio
  loadNext(scenario);
};
