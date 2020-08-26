/**
	Creates invisible buttons and keyboard shortcuts for elements in your scene,
	to make it accessible to people using the keyboard or screen readers.
**/
var A11yHelper = function() {
	var body = document.getElementsByTagName('body')[0];

	var shortcuts = {};

	var a11yContainer = document.createElement('div');
	a11yContainer.className = 'a11yContainer';

	document.addEventListener('keydown', function (event) {
		var keyCode = event.keyCode;
		console.log(keyCode);
		var shortcut = shortcuts[keyCode];
		if (shortcut) { 
			shortcut();
			return false;
		}		
	}, false);

	body.insertBefore(a11yContainer, body.firstChild);

	return {
		addKeyboardShortcut : function(shortcutKeyCode, callback) {
			if (shortcutKeyCode) {
				shortcuts[shortcutKeyCode] = callback;
			}
		},
		addTopLevel : function(label, callback, shortcutKeyCode) {
			var el = document.createElement('button');

			this.addKeyboardShortcut(shortcutKeyCode, callback);

			el.innerHTML = label;
			el.className = 'a11yContainer';

			el.addEventListener('click', callback);
			a11yContainer.appendChild(el);
		}
	};
};
var a11y = A11yHelper();