import re
from contextlib import redirect_stdout

file_name = 'deobf.js'
file_to_deobf = 'ref_eq/test_files/eq-test.js'

# sample substitute array
subs_arr = ["game-cleared","LC-N-N","LC-N-HC","cleared","removeClass","keys","#stage","wrong","LC-PK1-N","#points","model","active","addClass","midline","deviation","text"]

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

obf_names_arr = re.findall(r'\s*var (\S*) = _0xee2d', obf_code)

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
deobf_code = re.sub(r'\s*var (\S*) = _0xee2d', '', deobf_code)

for name in obf_names_arr:
    regex = r'(?<=[^0-9a-zA-Z_]){}\("([0-9a-z]*)"\)'.format(name)
    deobf_code = re.sub(regex, match_to_arr_sub, deobf_code)

deobf_code = direct_deobf(deobf_code,"_0xee2d")

print_to_file(deobf_code)


