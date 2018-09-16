
var min3 = {}
var VISUAL = ['3', '4', '5', '6', '7', '8', '9', '10', 'J','Q','K','A','2']

for (var i = 3; i< 16; i++) {
    min3[i] = VISUAL[i-3];
}

export const MIN3 = min3;

export const MIN3_V = 16;
export const MIN3_W = 17;

export const MIN3_COLOR = ['♦', '♣', '♥', '♠'];


export function min3hex_to_list(hexstr) {
    var result = [];
    for (var i = 0; i<hexstr.length; i=i+2) {
        var aa = parseInt(hexstr.substring(i,i+2),16);
        result.push(aa);
    }
    return result;
}

export function min3list_to_hex(clist) {
    var result = '';
    for (var i = 0; i<clist.length; i=i+1) {
        result += clist[i].toString(16);
    }
    return result; 
}