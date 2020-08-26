var Synth = (function () {
	var synthIdx = 0,
		curIntervalIdx = 0,
		intervals = [ 0, 2, 4, 5, 7, 9, 11, 12 ];

	return {
		createNextSynth: function() {
			var synth;
			synthIdx = (synthIdx + 1) % 3;
			switch(synthIdx) {
				case 0:
					synth = new Tone.PolySynth(4, Tone.Synth)
						.set(
						{
						    "oscillator": {
						        "partials": [
						            1,
						            0,
						            2,
						            0,
						            3
						        ]
						    },
						    "envelope": {
						        "attack": 0.001,
						        "decay": 1.2,
						        "sustain": 0,
						        "release": 1.2
						    }
						}
					).toMaster();
					synth.volume.value = -20;
					return synth;
				case 2:
					synth = new Tone.PolySynth(4, Tone.FMSynth)
						.set(
						{
						    "harmonicity":8,
						    "modulationIndex": 2,
						    "oscillator" : {
						        "type": "sine"
						    },
						    "envelope": {
						        "attack": 0.001,
						        "decay": 2,
						        "sustain": 0.1,
						        "release": 2
						    },
						    "modulation" : {
						        "type" : "square"
						    },
						    "modulationEnvelope" : {
						        "attack": 0.002,
						        "decay": 0.2,
						        "sustain": 0,
						        "release": 0.2
						    }
						}
					).toMaster();
					synth.volume.value = -2;
					return synth;
				case 1:
					synth = new Tone.PolySynth(12, Tone.FMSynth)
						.set(
						{
							"oscillator" : {
								"type" : "pwm",
								"modulationFrequency" : 0.2
							},
							"envelope" : {
								"attack" : 0.02,
								"decay" : 0.2,
								"sustain" : 0.1,
								"release" : 0.6,
							}
						}
					).toMaster();
					synth.volume.value = -15;
					return synth;
			};
		},
		getRandomNote: function(seed) {
			var idx = Math.round(seed * intervals.length) + curIntervalIdx++;
			if (idx >= intervals.length)
				idx = idx % intervals.length;
			else if (idx < 0)
				idx = 0;
			return intervals[ idx ] + 60 - 36;
		}
	};
})();
