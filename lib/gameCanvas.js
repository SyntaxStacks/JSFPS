var three = require('three');

module.exports = {
    render: function draw () {
        this.renderer.render(this.scene, this.camera);
    },

    initialize: function initialize (config, sprites) {
        this.sprites = sprites;
        this.scene = new three.Scene();
        this.camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new three.WebGLRenderer();
        this.renderer.setSize(config.frameWidth, config.frameHeight);
        document.getElementById(config.id).appendChild(this.renderer.domElement);
    }
};  
