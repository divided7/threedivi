var letterDist = [
	7, //a
	9, //b
	21, //c
	24, //d
	1, //e
	15, //f
	14, //g
	22, //h
	13, //i
	5, //j
	6, //k
	23, //l
	18, //m
	16, //n
	10, //o
	11, //p
	2, //q
	25, //r
	19, //s
	4, //t
	20, //u
	8, //v
	17, //w
	3, //x
	12, //y
	0 //z
];


var getProbabilityOfLetter = function(letter) {
	letter = letter.charCodeAt(0);
	if (letter > 97) //lowercase: make uppercase
		letter -= 32;
	
	var letterIdx = letter - 65; //get to 0 index for array
	if (letterIdx >= 0 && letterIdx < 26) {
		return letterDist[letterIdx] / 25.0;
	}
	
	return Math.max(Math.min((letterIdx) / (26.0), 1.), 0);
}