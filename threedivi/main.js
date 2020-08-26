var Tweets = (function () {
  var tweets = [
    "dv",
    "cute",
    "AAAAABBBBB BBBaaaaaaaBBAAAAAA",
    "nyc",
    "lol",
    "bhai",
    "Tmm",
    "ok",
  ];

  var curTweet = 0;
  var Tweets = function (tweetOffset) {
    curTweet = tweetOffset % tweets.length;
  };

  Tweets.numTweets = tweets.length;

  Tweets.prototype.getCurProbability = function (offset) {
    return getProbabilityOfLetter(this.getCurLetter(offset));
  };

  Tweets.prototype.getCurLetter = function (offset) {
    var idx;
    if (offset > 0) idx = (tweetIdx + offset) % tweets[curTweet].length;
    else idx = tweetIdx;
    return tweets[curTweet][idx];
  };

  Tweets.prototype.incrementLetter = function () {
    tweetIdx = (tweetIdx + 1) % tweets[curTweet].length;
  };

  Tweets.prototype.nextTweet = function () {
    curTweet = (curTweet + 1) % tweets.length;
    tweetIdx = 0;
  };

  return Tweets;
})();

var ofRandom = function (max) {
  return Math.random() * max;
};

var ofDegToRad = function (degrees) {
  return (degrees * 3.14) / 180;
};

var TWEET_TREE_Y = 50;
var SLATE_HEIGHT = 2;

var MIN_BOX_SIZE = 10.0;
var MAX_BOX_SIZE = 89.0;

var FRACTAL_BOX_MARGIN = 2;

var OFFSET_SIZE = 0; //5.0f;
var BRANCH_LENGTH = 1.0;

var screenBounds = {
  width: 500,
  height: 500,
};

var TreeLeaf = function () {};

var leaves = [];
var TweetTree = function () {
  this.dotSize = MAX_BOX_SIZE;
  this.angleOffsetA = ofDegToRad(1.5);
  this.angleOffsetB = ofDegToRad(50);

  this.group = new THREE.Group();
};

TweetTree.prototype.setup = function (tweetIdx, synth) {
  this.depth = tweetIdx;
  this.tweets = new Tweets(tweetIdx);

  this.synth = synth;
};

TweetTree.prototype.seed1 = function (
  dotSize,
  angle,
  x,
  y,
  branchLevel,
  prob,
  offset
) {
  if (!(prob >= 0)) prob = 0.52;

  if (!(offset >= 0)) offset = 0;

  if (
    dotSize > MIN_BOX_SIZE &&
    (branchLevel < 0 ||
      (branchLevel >= 0 &&
        branchLevel < 3 &&
        x > -100 &&
        x < screenBounds.width &&
        (y < 100) & (y > -screenBounds.height)))
  ) {

    this.tweets.incrementLetter();

    var r = Math.random();

    var xOff = 0;
    var yOff = 0;
    var w = dotSize + xOff;
    var h = dotSize + yOff;


    this.fractalBox(x - xOff, y - yOff, w, h, 0);


    var newDotSize = dotSize * 0.99;

    if (branchLevel == -1 && newDotSize <= MAX_BOX_SIZE) {

      var l = new TreeLeaf();
      l.x = x;
      l.y = y;
      leaves.push(l);

    } else {

      if (this.tweets.getCurLetter() != " " || r > prob) {
        var newx = x + Math.cos(angle) * dotSize;
        var newy = y + Math.sin(angle) * dotSize;
        this.seed1(
          newDotSize,
          angle - this.angleOffsetA,
          newx,
          newy,
          branchLevel,
          prob,
          offset + 1
        );
      } else {
        var newx = x + Math.cos(angle);
        var newy = y + Math.sin(angle);

        var newProb = prob - 0.05;


        this.seed1(
          newDotSize,
          angle + this.angleOffsetA,
          newx,
          newy,
          branchLevel,
          newProb,
          offset + 1
        );
        this.seed1(
          dotSize * 0.6 * BRANCH_LENGTH,
          angle + this.angleOffsetB,
          newx,
          newy,
          branchLevel + 1,
          prob,
          offset + 1
        );
        this.seed1(
          dotSize * 0.5 * BRANCH_LENGTH,
          angle - this.angleOffsetB,
          newx,
          newy,
          branchLevel + 1,
          newProb,
          offset + 1
        );
      }
    }
  }
};

TweetTree.prototype.fractalBox = function (
  x,
  y,
  w,
  h,
  offset,
  probabilityOfSplit,
  c
) {
  if (w < MIN_BOX_SIZE || h < MIN_BOX_SIZE) return;

  if (!c) {
    c = palette.getNextColor(166);
  }

  if (!(probabilityOfSplit >= 0)) probabilityOfSplit = 0.4;

  var r = ofRandom(this.tweets.getCurProbability());
  if (r > probabilityOfSplit) {
    this.makeBox(
      x + FRACTAL_BOX_MARGIN,
      y + FRACTAL_BOX_MARGIN,
      w - FRACTAL_BOX_MARGIN * 2,
      h - FRACTAL_BOX_MARGIN * 2,
      offset,
      c
    );
  } else {
    var numSplit = ofRandom(3) + 1.0;
    for (i = 0; i < numSplit; i++) {
      var newW = w / numSplit;
      var newX = x + newW * i;

      var ySplit = ofRandom(3) + 1.0;
      var newH = h / ySplit;
      for (j = 0; j < ySplit; j++) {
        var newY = y + newH * j;

        this.fractalBox(
          newX,
          newY,
          newW,
          newH,
          offset++,
          probabilityOfSplit * 0.06,
          c
        );
      }
    }
  }
};

var geometry = new THREE.BoxBufferGeometry(1, 1, 1);

TweetTree.prototype.makeBox = function (x, y, w, h, offset, c) {
  var self = this;
  var material = new THREE.MeshPhysicalMaterial({
    map: null,
    color: c,
    metalness: 1.0,
    roughness: 0.6,
    opacity: 0.75,
    side: THREE.FrontSide,
    transparent: true,
    envMapIntensity: 5,
    premultipliedAlpha: true,
  });

  var object = new THREE.Mesh(geometry, material);

  object.position.x = x;
  object.position.z = y;
  object.position.y = TWEET_TREE_Y + 50 * this.depth + offset * SLATE_HEIGHT;

  object.scale.x = w;
  object.scale.z = h;
  object.scale.y = SLATE_HEIGHT; 
  var interval = getProbabilityOfLetter(this.tweets.getCurLetter(offset));

  var note = Synth.getRandomNote(interval);
  var octave =
    Math.round((1.0 - (w * h) / (this.dotSize * this.dotSize)) * 3.0) * 12; 
  note += octave;
  var freq = Tone.Frequency(note, "midi");

  var tween,
    shake = function () {
      if (tween) {
        tween.stop();
        object.position.x = x;
      }
      tween = new TWEEN.Tween(object.position)
        .to({ x: object.position.x - 6 }, 130, TWEEN.Easing.Elastic.InOut)
        .repeat(2)
        .yoyo()
        .start();
    };

  object.noteOn = function () {
    debugPrint("noteOn " + freq, note);
    shake();
    self.synth.triggerAttackRelease(freq, "1n");
  };
  object.noteOff = function () {
    debugPrint("noteoff ");
    self.synth.triggerRelease();
  };

  debugPrint("makeBox ", x, y, w, h, offset, c, octave);

  self.group.add(object); 
  self.slates.push(object);
};

TweetTree.prototype.killAll = function () {
  this.slates = [];
  this.leaves = [];

};

TweetTree.prototype.rebuild = function (branchLevel) {
  palette.togglePalette();

  this.tweets.nextTweet();


  this.killAll();


  this.seed1(this.dotSize, ofDegToRad(270), 0, 0, branchLevel); 

  curBoxIdx = 0;

  if (branchLevel < 0) {
    var maxLeaves = Math.min(leaves.length, this.tweets.numTweets - 1);
    for (var i = 0; i < maxLeaves; i++) {
      this.leaves[i].child = new TweetTree();
      this.leaves[i].child.setup(i + 1, this.synth);

      this.leaves[i].child.rebuild(1);
    }
  }
};

var leaves;

var killAll = function () {
  leaves = [];
};

var curBoxIdx = 0;
var Hill_rebuild = function (branchLevel) {
  killAll();

  curBoxIdx = 0;

  var depth = 20000.0;

  var x = 0,
    y = 0;

  var maxLeaves = 3;
  for (var i = 0; i < maxLeaves; i++) {
    var synth = Synth.createNextSynth();

    y -= depth / maxLeaves;
    x = Math.sin((i / maxLeaves) * 3.14 * 2.0) * 1000.0;

    var z = Math.sin((i / maxLeaves) * 3.14) * 100.0;
    var l = new TreeLeaf();
    l.x = x;
    l.y = y;

    l.child = new TweetTree();
    l.child.setup(i, synth);

    l.child.rebuild(1);

    l.child.group.rotateY(i * 90);

    leaves.push(l);
  }

  return leaves;
};
