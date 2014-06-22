var engine = require('../lib/engine');
var menu = require('./scenes/menu');
var shooter = require('./scenes/shooter');
var config = require('./config');

var scenes = {
    menu: newMenuScene,
    game: newShooterScene
};

function newMenuScene() {
    var menuScene = new menu(config);
    engine.run(menuScene, done);
}

function newShooterScene() {
    shooter.initialize(engine.dependencies);
    engine.run(shooter, done);
}

function done(scene) {
    if(scene == 'running') return;
    nextScene = scenes[scene] || newMenuScene;
    nextScene();
}

module.exports = {
    play: function play () {
        engine.initialize(config);
        var menu = newShooterScene();
    }
}

