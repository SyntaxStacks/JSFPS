var _ = require('lodash');
var three = require('three');

module.exports = {
    initialize: function init (deps) {
        this.status = 'running';
        this.geometry = new three.BoxGeometry(1,1,1);
        this.material = new three.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new three.Mesh( this.geometry, this.material );
        deps.canvas.scene.add( this.cube );
        deps.canvas.camera.position.z = 5;
    },

    processInput: function input (deps) {
        var input = deps.input;
        var camera = deps.canvas.camera;
        var keycode = input.keycode();

        var x = camera.position.x;
        var y = camera.position.y;
        var z = camera.position.z;
        _.each(input.get(), function (event) {
            if (event == keycode.up) {
                y++;
            }
            if (event == keycode.down)
                y--;
            if (event == keycode.right)
                x++;
            if (event == keycode.left)
                x--;
        });

        camera.position.set(x,y,z);
    },

    run: function run (deps, callback) {
        this.processInput(deps);
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        deps.canvas.render();
        callback(this.status);
    }
}

