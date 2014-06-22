var hammer = require('hammerjs');
var three = require('three');
var _ = require('lodash');

module.exports = {

    initialize: function initialize (canvas) {
        this.inputQueue = [];
        // console.log(three.OrbitControls);
        // this.controls = new three.OrbitControls(canvas.camera, canvas.renderer.domElement);

        var processor = this._processInput.bind(this);
        var eventListeners = ['keydown', 'keyup'];
        _.map(eventListeners, function (listener) {
            document.addEventListener(listener, processor, false);
        });

        var leftElement = document.getElementById('left');
        var rightElement = document.getElementById('right');
        var topElement = document.getElementById('shoot');

        var leftTouch = hammer(leftElement).on("touch", processor).on("release", processor);
        var rightTouch = hammer(rightElement).on("touch", processor).on("release", processor);
        var topTouch = hammer(topElement).on("touch", processor).on("release", processor);
    },

    toKey: function toKey (keyCode) {
        var patt = /^[a-zA-Z0-9_\-\+=~`!@#$%\^&\*()\[\]{}\?\/\.,<>\\|\"\'\;:]*$/i;
        var key = String.fromCharCode(keyCode).match(patt);
        key = key || keyCode;

        if (typeof key === 'object') { return key[0]; }
        return key;
    },

    get: function getInputs () { return this.inputQueue; },
    addInput: function addInput (key) {
        if (!_.contains(this.inputQueue, key)) {
            this.inputQueue.push(key);
        }
    },

    _processInput: function processInput(event) {
        event.preventDefault();
        var inputCode = this.keycode();
        var key = this.toKey(event.keyCode);

        if(event.type == 'keydown') {
            this.addInput(key);
        }
        else if(event.type == 'keyup') {
            this._removeInput(key);
        }
        else if(event.type == 'touch') {
          event.gesture.preventDefault();
          if(event.srcElement.id == inputCode.touch.right)
            this.addInput(inputCode.right);
          if(event.srcElement.id == inputCode.touch.left)
            this.addInput(inputCode.left);
          if(event.srcElement.id == inputCode.touch.shoot)
            this.addInput(inputCode.space);
        }
        else if(event.type == 'release') {
          if(event.srcElement.id == inputCode.touch.right)        
            this._removeInput(inputCode.right);
          if(event.srcElement.id == inputCode.touch.left)
            this._removeInput(inputCode.left);
          if(event.srcElement.id == inputCode.touch.shoot)
            this._removeInput(inputCode.space);
        }
    },

    _removeInput: function removeInput(key) {
        _.pull(this.inputQueue, key);
    },

    keycode: function () {
        return {
            right: this.toKey(39),
            left: this.toKey(37),
            up: this.toKey(38),
            down: this.toKey(40),
            space: this.toKey(32),
            enter: this.toKey(13),
            touch: {
                left:  'left',
                right: 'right',
                shoot: 'shoot'
            }
        };
    }
}; 
