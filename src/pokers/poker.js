
var min3 = {}
var VISUAL = ['3', '4', '5', '6', '7', '8', '9', '10', 'J','Q','K','A','2']

for (var i = 3; i< 16; i++) {
    min3[i] = VISUAL[i-3];
}

export const MIN3 = min3;

export const MIN3_V = 17;
export const MIN3_W = 18;

export const MIN3_COLOR = ['♦', '♣', '♥', '♠'];