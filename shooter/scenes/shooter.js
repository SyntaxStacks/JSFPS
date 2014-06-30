var _ = require('lodash');
var three = require('three');

module.exports = {
    initialize: function init (deps) {
        var canvas = deps.canvas;
        var scene = canvas.scene;
        canvas.renderer.setClearColor( 0xffffff );
        this.status = 'running';
        this.geometry = new three.BoxGeometry(1,1,1);
        this.material = new three.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new three.Mesh( this.geometry, this.material );
        scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
        scene.add( this.cube );
        scene.add( deps.input.controls.getObject() );

        this.objects = [];
        var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
        light.position.set( -1, - 0.5, -1 );
        scene.add( light );

        ray = new THREE.Raycaster();
        ray.ray.direction.set( 0, -1, 0 );

        // floor
        var floor = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
        floor.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

        for ( var i = 0, l = floor.vertices.length; i < l; i ++ ) {

            var vertex = floor.vertices[ i ];
            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 20 - 10;

        }

        for ( var i = 0, l = floor.faces.length; i < l; i ++ ) {

            var face = floor.faces[ i ];
            face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

        }

        var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

        var mesh = new THREE.Mesh( floor, material );
        scene.add( mesh );

        // objects

        var box = new THREE.BoxGeometry( 20, 20, 20 );

        for ( var i = 0, l = box.faces.length; i < l; i ++ ) {

            var face = box.faces[ i ];
            face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

        }

        for ( var i = 0; i < 500; i ++ ) {

            var material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

            var mesh = new THREE.Mesh( box, material );
            mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
            mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
            mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
            scene.add( mesh );

            material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

             this.objects.push( mesh );

        }

    },

    processInput: function input (deps) {
        // var input = deps.input;
        // var keys = input.keys;
        // var camera = deps.canvas.camera;
        // var keycode = input.keycode();

        // var x = camera.position.x;
        // var y = camera.position.y;
        // var z = camera.position.z;
        // _.each(input.get(), function (event) {
        //     if (event == keycode.up) {
        //         z++;
        //     }
        //     if (event == keycode.down)
        //         z--;
        //     if (event == keycode.right)
        //         x++;
        //     if (event == keycode.left)
        //         x--;
        // });

        // camera.position.set(x,y,z);
    },

    run: function run (deps, callback) {
        this.processInput(deps);
        this.cube.rotation.x += 0.1;
        this.cube.rotation.y += 0.1;
        deps.canvas.render();
        callback(this.status);
    }
}

