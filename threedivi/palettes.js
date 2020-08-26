var PALETTES = [
  ["#C0DC47", "#D5DF68", "#E8EADC", "#315220", "#819F37"], 

  ["#D5B877", "#432A29", "#82231B", "#E27546", "#AA5335"],
  [
    "#C869FA",
    "#7F2EF6",
    "#2415AB",

  ], 
  [
    "#F5E320",
    "#42A4ED",,
    "#AAA5CA"
  ], 
  ["#83CDBE", "#5A3529", "#B8DBCD", "#212D2B", "#836A54"], 

  [
    "#74CCE4",

    "#2095CB",
    "#CD1F10",
  ], 
  ["#6F889B", "#BFD5EC", "#35451E", "#7D4E13", "#B87E1A"],
  ["#051931", "#2D4B76", "#859AD0", "#BCB5D7", "#5272AA"], 

  ["#FBEEB1", "#ECBF74", "#EECB99", "#D49D3D", "#E2B059"], 
];
var paletteIdx = 0;
var palette = {
  togglePalette: function () {
    paletteIdx = (paletteIdx + 1) % PALETTES.length;
  },
  getNextColor: function (alpha) {
    var curPalette = PALETTES[paletteIdx];
    return curPalette[Math.floor(Math.random() * curPalette.length)];
  },
};
