import re
from contextlib import redirect_stdout

file_name = 'deobf.js'
file_to_deobf = 'ref_eq/test_files/eq-module.js'

# sample substitute array
subs_arr = ["frequencyBinCount", '<div class="knob-controller" style="transform: rotate(', "attr", "original", "123,31,162", "#main-canvas", '[band="', ".needle", "rgb(140, 140, 140)", "#question", "loop", "/playground/eq/filter-50/", "abs", "mousedown", "connect", "canvas_ctx", "rgba(0,0,0,0)", "canvas", "knobs", "reset", "clientX", "PEAK", "LOWPASS", "sin", "arc", "fillStyle", "getContext", "originalFilters", "gray", "onaudioprocess", ",1)", "transform", "preventDefault", "band_id", ",.6)", "bandOnFocus", 
"down", "textAlign", "peaking", '" ondblclick="knobBase(this);" onMouseDown="knobActivate(this, event);">', "allpass", "checkClipping", "rotate(180deg)", "clientY", "#000", "gap", "hide", "color", "css", "end", ".yk-meter", "rgba(", "244,129,129", "touches", "247,140,69", "yourBands", "now", "clipping", ".meter-correct", "f_lowshelf", "random", "[eq]", "rgba(55,132,55,.3)", "your", "#111", "reconfigure", "14px Arial", "averaging", "toFixed", "filter_name", '<img toggle-band-img src="', "constants", 
"originalBands", "state", "knob", "chart", "pow", "gameOriginalGain", "playbackTime", ".meter-value", "freq", "parents", "fill", "f_peak", "height", "clipLevel", "lineTo", "inputBuffer", "canvasWidth", "pointerRadius", "sqrt", "center", "156,221,99", "band", ".game-cover", "f_highshelf", "[diff-accuracy]", "includes", "frequency", "211,47,47", "banned", "#confirm-settings", "hint", "offsetY", "touchTwoFingerStartValue", "loopEnd", "rate", "diff", "push", "offset", "194,24,91", "fillText", "strokeWidth", 
"gain", ".game-compare-panel", "highpass", "[bands]", "currentTime", "clipLag", "lastHz", "count", "[diff-cor]", "#game-panel-body", "game-panel-footer", "each", "filter", "start", '[meter="', "fontWeight", "createBufferSource", "f_highpass", ".compare-btn", '<div toggle-band-btn style="background: rgb(', "touchmove", "find", "originalAnalyser", "font", "rgba(105,175,115,.5)", "255,184,137", "answerSubmitted", "getByteFrequencyData", "hsl(", "text", "createGain", "floor", "loading", "[hints]", "gameBypassGain", 
"volume", "normal 11px Arial", "timegap", "draw", "setValueAtTime", "width", "rgba(237,61,61,.3)", "fillRect", ".hint-btn", "freqRunner", "#777", '<div class="knob-label">GAIN</div>', "loopStart", "rotate(", "PI2", "off", "lastMeterEvent", '>" value="', "side", '<div class="knob-panel" knob="gain" state="inactive" sensitivity="0.05" y="0" min="-18" max="18" base="', "removeClass", " kHz", ".game-helper-panel", "log", '<div class="knob-panel" knob="freq" state="inactive" sensitivity="', "play", 'deg)"><i class="fa fa-circle"></i></div>', 
"top", '[timeline-spectrogram="', "Notch", "0,151,167", "lineWidth", "activeFilter", "left", "deg)", '<div class="knob-value" contentEditable="true" onBlur="knobValueBlur(this);" onFocus="knobValueFocus(this);" onKeyDown="knobKeydown(this, event);">', "isDown", "NOTCH", "stroke", "putImageData", "clearRect", "length", "247,111,163", '"ondblclick="knobBase(this);"onMouseDown="knobActivate(this, event);">', "lastClip", '<div class="empty-knob-panel"></div>', '.png"/>', "transparent", "f_bandpass", 
"lowpass", "f_notch", "functions", "originalEvent", "</div>", "game-panel-body", "createScriptProcessor", "rgba(255,255,0,.8)", "bypass", "getChannelData", "beginPath", "touchend", ".knob-panel", " Hz", "setLineDash", "gameYourGain", "[band]", "ceil", "moveTo", "performance", "pointerDrag", ".knob-value", "yourAnalyser", "type", "gainDB", "freqDataMap", "strokeStyle", "active", "meterUpdate", " dB", "rgba(70,119,115,.8)", "addEventListener", "yours", "deltaY", "#999", "shutdown", "result", "value", 
"yourFilters", "stopPropagation", "yes", "touchstart", '<div band="', "HIGHSHELF", "offsetX", "angle_gain", "closePath", "sample_rate", "create", "border", "log_result", "98,178,252", "canvasHeight", "hsl(280, 100%, 10%)", "wait", "highshelf", "samples", "createBiquadFilter", "% accurate", "show", "rgb(0, 0, 0)", "#go-next-btn", '<div toggle-band onclick="toggleBand(', "95,160,38", '\" state=\"', "rgba(150,150,150,.3)", "#bypass-btn", "gainMin", "filter_id", "mouseup", "createElement", "createAnalyser", 
"rgba(200,200,200,.5)", '" y="0" min="20" max="19100" base="', "html", "199,117,234", ".bypass-btn", '" start="', "BANDPASS", "right", "mousemove", '" value="', "f_lowpass", "configure", "round"];


def match_to_arr_sub(match_obj):
    index = int(match_obj.group(1), 16)
    # print(index)
    print('"{}"'.format(subs_arr[index]))
    return '\'{}\''.format(subs_arr[index])

def print_to_file(str_to_print):
    with open(file_name, 'w') as f:
        with redirect_stdout(f):
            print(str_to_print)

# option to deobfuscate direct assignments, for example:
#   activeFilter : _0x278f7d("0x3")
def direct_deobf(deobf_code, arr_name):
    new_deobf_code = re.sub(r'{}\("([0-9a-z]*)"\)'.format(arr_name), match_to_arr_sub, deobf_code)
    return new_deobf_code

obf_file = open(file_to_deobf, "r")
obf_code = obf_file.read()

obf_names_arr = re.findall(r'\s*var (\S*) = _0x278f7d', obf_code)

# TODO: CHECK MULTIPLE LEVEL OBFUSCATION
# When using script remove declarations with added name, for example:
# var d = a;

# HELPER METHODS TO DEOBFUSCATE base.js
# obf_names_arr.append("rel2Mstr")
# obf_names_arr.append("getPreferenceKey")
# obf_names_arr.append("edgeId")

# HELPER METHODS TO DEOBFUSCATE eq-module.js
# obf_names_arr.append("d")
# obf_names_arr.append("unescape")
# obf_names_arr.append("c")
# obf_names_arr.append("transformProperty")
# obf_names_arr.append("decodeSymbol")
# obf_names_arr.append("getNameForValue")
# obf_names_arr.append("Number")
# obf_names_arr.append("canPlaceCFC")
# obf_names_arr.append("getRefreshTokenKey")

deobf_code = obf_code
deobf_code = re.sub(r'\s*var (\S*) = _0x278f7d', '', deobf_code)

for name in obf_names_arr:
    regex = r'(?<=[^0-9a-zA-Z_]){}\("([0-9a-z]*)"\)'.format(name)
    deobf_code = re.sub(regex, match_to_arr_sub, deobf_code)

deobf_code = direct_deobf(deobf_code,"_0x278f7d")

print_to_file(deobf_code)


