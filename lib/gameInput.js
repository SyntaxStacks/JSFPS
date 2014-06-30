var hammer = require('hammerjs');
var three = require('three');
var _ = require('lodash');
var pointerLock = require('pointerLock');

module.exports = {

    initialize: function initialize (canvas) {
        this.inputQueue = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.canvasElement = canvas.renderer.domElement;
        this.camera = canvas.camera;
        this.controls = new pointerLock(this.camera);
        // this.canvasElement = document.getElementById('frame');
        //mouse listeners
        // Hook pointer lock state change events
        var lockChange = this.lockChange.bind(this);
        document.addEventListener('pointerlockchange', lockChange, false);
        document.addEventListener('mozpointerlockchange', lockChange, false);
        document.addEventListener('webkitpointerlockchange', lockChange, false);

        //error listeners for mouse lock
        document.addEventListener('pointerlockerror', this.lockError, false);
        document.addEventListener('mozpointerlockerror', this.lockError, false);
        document.addEventListener('webkitpointerlockerror', this.lockError, false);
        // console.log(three.OrbitControls);
        // this.controls = new three.OrbitControls(canvas.camera, canvas.renderer.domElement);

        var processor = this._processInput.bind(this);
        var eventListeners = ['keydown', 'keyup', 'mousemove'];
        _.map(eventListeners, function (listener) {
            //key listeners
            document.addEventListener(listener, processor, false);
        });

        //touch elements
        // var leftElement = document.getElementById('left');
        // var rightElement = document.getElementById('right');
        // var topElement = document.getElementById('shoot');

        //touch listeners
        // var leftTouchListener = hammer(leftElement).on("touch", processor).on("release", processor);
        // var rightTouchListener = hammer(rightElement).on("touch", processor).on("release", processor);
        // var topTouchListener = hammer(topElement).on("touch", processor).on("release", processor);

        var canvasAction = this.requestPointerControl.bind(this, this.canvasElement);
        this.canvasElement.addEventListener('click', canvasAction, false);

    },

    hasPointerLock: function () {
        pointerLockElement = [
            'pointerLockElement' in document,
            'mozPointerLockElement' in document,
            'webkitPointerLockElement' in document
        ];

        return _.contains(pointerLockElement, true);
    },

    requestPointerControl: function (element) {
        if (this.hasPointerLock()) {
            element.requestPointerLock =
                element.requestPointerLock ||
                element.mozRequestPointerLock ||
                element.webkitRequestPointerLock;

            element.requestPointerLock();
        }
    },

    requestPointerExit: function () {
        document.exitPointerLock =
            document.exitPointerLock ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock;
        document.exitPointerLock();
    },

    lockChange: function lockChangeAlert() {
        var pointerLockElement = document.pointerLockElement ||
                                 document.mozPointerLockElement ||
                                 document.webkitPointerLockElement;

        var mouseMove = this.mouseMoveCallback;
        if(pointerLockElement === this.canvasElement) {
            console.log('The pointer lock status is now locked');
            this.controls.enabled = true;
        } else {
            console.log('The pointer lock status is now unlocked');      
            document.removeEventListener("mousemove", mouseMove, false);
            // document.unhookElement(this.canvasElement);
        }
    },

    mouseMoveCallback: function (e) {
        console.log(e);
        this.mouseX =
            e.movementX ||
            e.mozMovementX ||
            e.webkitMovementX ||
            0;
        this.mouseY =
            e.movementY ||
            e.mozMovementY ||
            e.webkitMovementY ||
            0;
    },

    toKey: function toKey (keyCode) {
        var patt = /^[a-zA-Z0-9_\-\+=~`!@#$%\^&\*()\[\]{}\?\/\.,<>\\|\"\'\;:]*$/i;
        var key = String.fromCharCode(keyCode).match(patt);
        key = key || keyCode;

        if (typeof key === 'object') { return key[0]; }
        return key;
    },

    get: function getInputs () {
        return {
            keys: this.inputQueue,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
        };
    },

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
