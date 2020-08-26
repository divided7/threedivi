var Loops = function (loopFiles, onLoaded, onProgress) {
  this.loopFiles = loopFiles;
  var urls = {};
  for (var name in loopFiles) {
    urls[name] = loopFiles[name].url;
  }

  this.players = new Tone.Players(urls, onLoaded).toMaster();
};

Loops.prototype.startAll = function () {
  var self = this;
  this.players._forEach(function (player, name) {
    var volume = self.loopFiles[name].volume;
    if (typeof volume != "undefined") {
      player.volume.value = volume;
    }
    player.loop = true;

    player.sync().start(0);
  });

  Tone.Transport.start();
};
Loops.prototype.mute = function (sampleName, isMuted) {
  this.players.get(sampleName).mute = isMuted;
};
Loops.prototype.getByIndex = function (sampleIndex) {
  var i = 0;
  for (var name in this.players._players) {
    if (i++ == sampleIndex) {
      var player = this.players.get(name);
      return player;
    }
  }
  return false;
};
Loops.prototype.toggle = function (sampleIndex) {
  var player = this.getByIndex(sampleIndex);
  player.mute = !player.mute;
};

var MODEL_ROTATION = 10;

var onLoaderError = function (err) {
  console.error("Error loading model: ", err);
};

var Boat = function (radius, rotation, onClick) {
  this.radius = radius;
  this.rotation = (rotation || 0) * (Math.PI / 4);
  this.orbit = 0;
  this.onClickCallback = onClick;
};

Boat.prototype.load = function (path, objFile, mtlFile) {
  var self = this;
  return new Promise(function (resolve, reject) {
    var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.crossOrigin = true;
    mtlLoader.setPath(path);
    mtlLoader.load(
      mtlFile,
      function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path);

        objLoader.setMaterials(materials);
        objLoader.load(
          objFile,
          function (obj) {
            self.obj = obj;
            resolve(self);
          },
          null,
          onLoaderError
        );
      },
      null,
      onLoaderError
    );
  });
};

Boat.prototype.update = function () {
  this.orbit += 0.002;
  this.obj.position.y = this.y;
  if (this.radius > 0) {
    this.obj.position.x =
      Math.sin(this.orbit + this.radius * this.radius) * this.radius;
    this.obj.position.z =
      Math.cos(this.orbit + this.radius * this.radius) * this.radius;

    this.obj.lookAt(0, 0, 0);
    this.obj.rotateY(this.rotation);
  }
};

function setEmissiveColor(model, color) {
  if (model.obj.children[0].material.forEach) {
    model.obj.children[0].material.forEach(function (child) {
      child.emissive.setHex(color);
    
    });
  } else {
    model.obj.children[0].material.emissive.setHex(color);

  }
}

Boat.prototype.onClick = function () {
  this.onClickCallback && this.onClickCallback();
};

Boat.prototype.onMouseOver = function () {
  setEmissiveColor(this, 0xffffff);
};

Boat.prototype.onMouseOut = function () {
  setEmissiveColor(this, 0x000000);
};


var BOAT_KEYCODE_START = 49; 

/**
 * Rotates the boatates and controls the loops when you click on them.
 * @param {Scene3d} scene
 * @param {Loops} loops      the loops that correspond with the modelFiles
 * @param {Array} modelFiles Array of model file descriptions.
 */
var Boats = function (
  scene,
  loops,
  modelFiles,
  onBoatLoadFinished,
  onBoatLoadStart
) {
  var self = this;
  self.models = [];
  modelFiles.forEach(function (boatFile, i) {
    var toggleLoop = function () {
      loops.toggle(i);
    };
    var boat = new Boat(i * 120, boatFile.rotation, toggleLoop);
    onBoatLoadStart && onBoatLoadStart(boat);

    boat
      .load(
        encodeURI(boatFile.assetPath + "/"),
        encodeURI(boatFile.objFile),
        encodeURI(boatFile.mtlFile)
      )
      .then(function (boat) {
        if (boatFile.scale) {
          boat.obj.scale.x = boatFile.scale;
          boat.obj.scale.y = boatFile.scale;
          boat.obj.scale.z = boatFile.scale;
        }
        boat.y = boatFile.y || 0;

        boat.update();
        scene.add(boat.obj);
        self.models.push(boat);

        onBoatLoadFinished && onBoatLoadFinished(boat);
      });

    // a11y keboard control
    var label = boatFile.assetPath;
    label = label.substring(label.lastIndexOf("/") + 1, label.length);
    a11y.addTopLevel(label, toggleLoop, BOAT_KEYCODE_START + i);
  });
};

Boats.prototype.update = function () {
  this.models.forEach(function (model) {
    model.update();
  });
};

Boats.prototype.checkMouse = function (raycaster, isClick) {
  this.models.forEach(function (model) {
    if (raycaster.intersectObject(model.obj, true).length > 0) {
      model.onMouseOver();
      if (isClick) {
        model.onClick();
      }
    } else {
      model.onMouseOut();
    }
  });
};
