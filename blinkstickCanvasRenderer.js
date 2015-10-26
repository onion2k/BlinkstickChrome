/**
 * A 3D visualiser for BlinkstickChrome. Creates a three.js obj, renders, etc.
 */
var BlinkstickCanvasRenderer = function() {
  
  var r = this;
  var camera, controls, light, base, bs, leds, rafId;

  /**
   * Change the color of an LED
   * @param num Index of the LED to change
   * @param num Red value (0-255)
   * @param num Green value (0-255)
   * @param num Blue value (0-255)
   */
  this.setColor = function(i,r,g,b){
    
    leds[i].material.color.setRGB(r/255,g/255,b/255);
    
  };

  /**
   * Change the color of several LEDs at once
   * @param arr Colors in [g,r,b,g,r,b,g,r,b...] format
   */
  this.setColors = function(colors){
    //TODO - change several colors at once
  };

  /**
   * Render loop
   */
	this.render = function () {
	  
		var rafId = requestAnimationFrame( r.render );
    controls.update();
		r.renderer.render(scene, camera);

	};

  /**
   * Initialise a new model.
   * @param num Number of LEDs on the Blinkstick model
   */
	this.start = function(l) {

    bs = new THREE.Object3D();
    r.createBase(l);
    r.createLeds(l);
  	scene.add( bs );

    bs.rotation.x = 1;
    bs.rotation.y = 0.2;
    bs.rotation.z = 0;

	};

  /**
   * Stop the renderer and destroy the model.
   */
	this.stop = function() {
	  
    cancelAnimationFrame(rafId);
    scene.remove(bs);
    leds = [];

	};

  /**
   * Create the base object (plastic housing?)
   * @param num Number of LEDs
   */
	this.createBase = function(l){

  	var geometry = new THREE.BoxGeometry( 50, 2, 6 );
  	var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.8 } );
  	base = new THREE.Mesh( geometry, material );
    bs.add(base);

	};

  /**
   * Create the LEDs to be controlled.
   * @param num Number of LEDs
   */
  this.createLeds = function(l){

    leds = [];
  
    for (var x = 0; x < l; x++) {
  
      leds.push(new THREE.Mesh( led, new THREE.MeshBasicMaterial( {color: 0x000000} ) ));
      leds[leds.length-1].position.set(-21+(x*5.2),1.25,0);
      bs.add( leds[leds.length-1] );
  
    }

  };

  /**
   * Add a camera to the scene
   */
	this.createCamera = function(){

    camera = new THREE.PerspectiveCamera( 60, 820/195, 0.1, 1000 );
    scene.add(camera);

  	camera.position.z = 30;

  	controls = new THREE.OrbitControls( camera, r.renderer.domElement );
  	controls.enableDamping = true;
  	controls.dampingFactor = 0.25;
  	controls.enableZoom = false;

	};

  /**
   * Add a light to the scene
   */
	this.createLight = function(){

    var light = new THREE.PointLight( 0xFFFFFF );
    light.position.set( 15, 15, 15 );
    scene.add( light );
  
    var light2 = new THREE.PointLight( 0xFFFFFF );
    light2.position.set( 15, 15, -15 );
    scene.add( light2 );

	};


  r.renderer = new THREE.WebGLRenderer({ antialias: true});
  r.renderer.setSize( 820, 195 );

  var canvas = document.getElementById("emuPreview");
  canvas.appendChild(r.renderer.domElement);
  var scene = new THREE.Scene();
  var led = new THREE.SphereGeometry( 2, 32, 32 );

  this.createCamera();
  this.createLight();

};
