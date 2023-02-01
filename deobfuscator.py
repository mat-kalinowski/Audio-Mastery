import re
from contextlib import redirect_stdout

file_name = 'deobf.js'

# sample substitute array
subs_arr = ["<i class=\\\"fa fa-user\\\"></i>","inactive","GET","type","percent","<small>Hz</small>","/sounds/sprite/","[key-id]","clientY","panning",
            "POST","model","offset","stop","addClass","#range, #range-mirror","preventDefault","left","createGain","touchend","vals","compare","[set]",
            "fadeOut","active","destination","pageX","negative","#game-panel","min","sub","keys","parents","append","<div class=\\\"min\\\">","width",
            "#game-loading","stages","positive","touches","html","set","gain","text","#game-ready","accurate","play","space","wrong_long",".json?v=",
            "exponentialRampToValueAtTime","log10","slice","clientX","decodeAudioData","zero","touchmove","extra_life_value"," [key-id]","custom",
            "maxperfect","webkitAudioContext","push","[life-bonus]","cleared","round","[points] span","name","send","/sounds/sprites/","which","response",
            "click","end","</div>","key-status","css","#stage","/main.json","#ranger","</small>","perfect","responseType","/play/register","setPosition",
            "#handle-mirror","length","[range] span","stringify","ajax","#space-main, #value, #cartridge, #handle","[stage] span","loopEnd","multiplier_set",
            "loopStart","wrong","removeClass","game-cleared","top","stereo","<small>left</small>","duration","off","abs","bass","val","bonus","none","attr",
            "icon-","game-over","color","game-ready","mousemove","diff","#range-mirror","keydown"," <small>","auto","#range","pop","#game-over","1.00","minperfect",
            "originalEvent","currentTime","max","point","hide","correct","<small>right</small>","middle","show","wait","right","#game-panel-body","find",
            "[set][state=\\\"play\\\"] [answer-btn]","[bypass=\\\"on\\\"]","[answer]","floor","start","createBufferSource","sprite","now","spritemap","setValueAtTime",
            "%\\\">",".game-cover","50%","connect","touchstart","<br />",".game-main-btns","random","state","yes","pow","error","each","#handle","toString","buffer",
            "currentDifficulty","<div class=\\\"gridbox\\\"></div>","arraybuffer","#value","reset","open",".answer","json_tests","delay","onload","uid","json_diffs",
            "loop","log","removeAttr","toFixed","game","#grid","sin","keyup","lives","height","#points","pageY","[bypass=\\\"off\\\"]"]


def match_to_arr_sub(match_obj):
    index = int(match_obj.group(1), 16)
    # print(index)
    print('"{}"'.format(subs_arr[index]))
    return '"{}"'.format(subs_arr[index])

def print_to_file(str_to_print):
    with open(file_name, 'w') as f:
        with redirect_stdout(f):
            print(str_to_print)

obf_file = open("test_files/base.js", "r")
obf_code = obf_file.read()

obf_names_arr = re.findall(r'\s*var (\S*) = _0x37ce', obf_code)

# TODO: CHECK MULTIPLE LEVEL OBFUSCATION
# HELPER METHODS TO DEOBFUSCATE base.js
obf_names_arr.append("rel2Mstr")
obf_names_arr.append("getPreferenceKey")
obf_names_arr.append("edgeId")

deobf_code = obf_code
deobf_code = re.sub(r'\s*var (\S*) = _0x37ce', '', deobf_code)

for name in obf_names_arr:
    regex = r'(?<=[^0-9a-zA-Z]){}\("([0-9a-z]*)"\)'.format(name)
    deobf_code = re.sub(regex, match_to_arr_sub, deobf_code)

print_to_file(deobf_code)


