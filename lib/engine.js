var canvas = require('./gameCanvas');
var input = require('./gameInput');
var assets = require('./gameAssets');

module.exports = {
    initialize: function Engine (config) {  
        canvas.initialize(config, assets.images);
        input.initialize(canvas);

        console.dir(canvas.camera);
        this.dependencies = {
            canvas: canvas, 
            input: input, 
            assets: assets
        };
    },


    run: function run (scene, callback) {
        var animFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        null;

        var dependencies = this.dependencies;
        var recursiveAnim =  function() {
            scene.run(dependencies, function(status) {
                if(status != 'running') {
                    callback(status);
                    return;
                }
                assets.sounds.play();
                animFrame( recursiveAnim );
            });
        };

        animFrame( recursiveAnim );
    }
};

