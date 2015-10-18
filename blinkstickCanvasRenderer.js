var BlinkstickCanvasRenderer = function() {
  
  var r = this;

  r.renderer = new THREE.WebGLRenderer({ antialias: true});
  r.renderer.setSize( 820, 195 );

  var canvas = document.getElementById("emuPreview");
  canvas.appendChild(r.renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 45, 820/195, 0.1, 1000 );
  
  scene.add(camera);
  
  var bs = new THREE.Object3D();

	var geometry = new THREE.BoxGeometry( 50, 2, 6 );
	var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
	var base = new THREE.Mesh( geometry, material );
  bs.add(base);
  
  var led = new THREE.SphereGeometry( 1.8, 32, 32 );
  var leds = [];

  for (var x = 0; x < 8; x++) {

    leds.push(new THREE.Mesh( led, new THREE.MeshBasicMaterial( {color: 0x000000} ) ));
    leds[leds.length-1].position.set(-21+(x*5.2),1.1,0);
    bs.add( leds[leds.length-1] );

  }

	scene.add( bs );

  bs.rotation.x = 1;
  bs.rotation.y = 0.2;
  bs.rotation.z = 0;

  var light = new THREE.PointLight( 0xFFFFFF );
  light.position.set( 15, 15, 15 );
  scene.add( light );

	camera.position.z = 30;

  r.setColor = function(i,r,g,b){
    
    leds[i].material.color.setRGB(r/255,g/255,b/255);
    
  };

	r.render = function () {
	  
		requestAnimationFrame( r.render );

		r.renderer.render(scene, camera);

	};

};
