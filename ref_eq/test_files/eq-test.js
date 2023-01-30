var _0x438c = [
  "cleared",
  "removeClass",
  "keys",
  "#stage",
  "wrong",
  "LC-PK1-N",
  "#points",
  "model",
  "active",
  "addClass",
  "midline",
  "deviation",
  "text",
  "game-cleared",
  "LC-N-N",
  "LC-N-HC",
];
(function (_0x57b024, _0x438c3d) {
  var _0xee2d87 = function (_0x269b7c) {
    while (--_0x269b7c) {
      _0x57b024["push"](_0x57b024["shift"]());
    }
  };
  _0xee2d87(++_0x438c3d);
})(_0x438c, 0x11d);
var _0xee2d = function (_0x57b024, _0x438c3d) {
  _0x57b024 = _0x57b024 - 0x0;
  var _0xee2d87 = _0x438c[_0x57b024];
  return _0xee2d87;
};
var prototype,
  steps = [],
  total = 0x0,
  step = 0x0,
  totalPoints = 0x0;
function finishTest() {
  var _0x4e79ff = _0xee2d,
    _0x269b7c = 3.2;
  if (totalPoints > 0xfa) _0x269b7c = 94.2;
  else {
    if (totalPoints > 0xb4) _0x269b7c = 87.1;
    else {
      if (totalPoints > 0x82) _0x269b7c = 72.8;
      else {
        if (totalPoints > 0x62) _0x269b7c = 58.7;
        else {
          if (totalPoints > 0x4b) _0x269b7c = 46.4;
          else totalPoints > 0x2d && (_0x269b7c = 31.6);
        }
      }
    }
  }
  $("[better-then]")[_0x4e79ff("0xf")](_0x269b7c),
    playFx(_0x4e79ff("0x3")),
    $(".game-cover")[_0x4e79ff("0x4")](_0x4e79ff("0xb")),
    $("#game-compare")[_0x4e79ff("0xc")](_0x4e79ff("0xb")),
    resetKeyboardKeys(),
    activateKeyboardKeys(_0x4e79ff("0x0"));
}
function CustomGoNext() {
  var _0x4e7a99 = _0xee2d;
  if (step == pr[_0x4e7a99("0xa")]["stages"]) {
    finishTest();
    return;
  } else getNextBands(), $(_0x4e7a99("0x6"))["text"](step + 0x1);
}
function submitEqMirrorResult(_0x3d256b) {
  var _0x8c44c9 = _0xee2d;
  updateMeter(_0x3d256b, _0x8c44c9("0xd"));
  if (parseInt(_0x3d256b) >= perfectPercent) result = "perfect";
  else
    parseInt(_0x3d256b) >= percentAccuracy
      ? ((result = "correct"), total++)
      : (result = _0x8c44c9("0x7"));
  (totalPoints += parseInt(_0x3d256b)),
    step++,
    $(_0x8c44c9("0x9"))[_0x8c44c9("0xf")](totalPoints),
    playFx(result),
    RevealOriginal(result);
}
function getNextBands() {
  var _0x1d99f8 = _0xee2d;
  (steps = [_0x1d99f8("0x1"), _0x1d99f8("0x8"), _0x1d99f8("0x2")]),
    (percentAccuracy = 0x28),
    (prototype = prototypes[steps[step]]),
    (deviation = prototype[_0x1d99f8("0xe")]);
  var _0x1144b6 = prototype["options"],
    _0x50e1f9 = Object[_0x1d99f8("0x5")](_0x1144b6)["length"],
    _0x1024ac = getWholeBetween([0x1, _0x50e1f9]),
    _0x254c4a = _0x1144b6[_0x1024ac];
  loadNext(_0x254c4a);
}
