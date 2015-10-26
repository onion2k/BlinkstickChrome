  /**
   * Main obj for BlinkstickChrome
   */
var BlinkstickChrome = function(){
  
  var bsc = this;

  var timer = new Timer();
  var p = 10000 * 1000;
  var pE = 0;
  var elapsedTotal = 0;

  timer.stop();

  timer = new Timer({
    tick    : 0.01,
    ontick  : function(s) {

      elapsed = p-s;
      elapsedTotal += elapsed;
      p = s;
      
      //console.log(pE);
      
      for (var i = 0; i < leds.length; i++) {

        if (leds[i].frequency > 0) {
          
          if (elapsedTotal - leds[i].lastTick > 1000 / leds[i].frequency) {

            leds[i].slider.toggle();
            leds[i].lastTick = elapsedTotal;

          }

        }

      }      

    }
  });
  
  timer.start(10000);


  var leds = [];

  this.slider = function(){

    var i = this.getAttribute('rel');

    var r = document.querySelector("input.red[rel='"+i+"']").value;
    var g = document.querySelector("input.green[rel='"+i+"']").value;
    var b = document.querySelector("input.blue[rel='"+i+"']").value;

    bsc.setColor(i,r,g,b);

    if (i !== 'main') {

      var flash = document.querySelector("input.flash[rel='"+i+"']").value;
      
      leds[i].frequency = flash;

    }

  };
  
  this.offButton = function(){
  
    var i = this.getAttribute('rel');
    bsc.setColor(i,0,0,0);
    
  };

  this.linkButton = function(){
    
    var chk = $(this).find('input');
    var i   = $(chk).attr('rel');

    linked[i].link = !$(chk).is(':checked');

  };
  
  this.syncButton = function(){
    
    console.log('sync');

    for (var x = 0; x < leds.length; x++) {
      leds[x].lastTick = 0;
      leds[x].slider.toggle(true);
    }    

  };
  
  this.setColor = function(i,r,g,b) {
  
    var data, arr;

    data = [0];

    if (i === 'main') {
      
      $('i.led[rel=main]').css({'color':'rgb('+r+','+g+','+b+')'});

      for (var x = 0; x < 8; x++) {

        leds[x].slider.updateSlider(r,g,b);
        leds[x].slider.updateLed(r,g,b);

        data.push(g);
        data.push(r);
        data.push(b);

      }

      arr = new Uint8Array(data);
    
      if (connectionId > -1) {
        chrome.hid.sendFeatureReport( connectionId, 6, arr.buffer, function(){
          //console.log('Set color');
        });
      }

    } else {

      if (linked[i].link) {
  
        for (var l = 0; l < 8; l++) {
  
          if (linked[l].link === true && i !== l) {
            
            leds[l].slider.updateSlider(r,g,b);
            leds[l].slider.updateLed(r,g,b);
  
            data.push(g);
            data.push(r);
            data.push(b);
  
          } else {
  
            data.push(0);
            data.push(0);
            data.push(0);
  
          }
  
        }
  
        arr = new Uint8Array(data);
      
        if (connectionId > -1) {
          chrome.hid.sendFeatureReport( connectionId, 6, arr.buffer, function(){
            //console.log('Set color');
          });
        }
  
      } else {
  
        leds[i].slider.updateSlider(r,g,b);
        leds[i].slider.updateLed(r,g,b);
  
        data = [0, i, r, g, b];
        arr = new Uint8Array(data);
      
        if (connectionId > -1) {
          chrome.hid.sendFeatureReport( connectionId, 5, arr.buffer, function(){
            //console.log('Set color');
          }); 
        }
  
      }
      
    }
  
  };




  this.initDeviceConnection = function(){
    
    var emuButtons = document.querySelectorAll("a.emu");

    for (var s = 0; s < emuButtons.length; s++) {
      emuButtons[s].addEventListener('click', bsc.emuButton);
    }

    chrome.hid.getDevices(DEVICE_INFO, function(devices) {
  
      if (!devices || !devices.length) {
       console.log('device not found');
       return;
      }
      
      hidDevice = devices[0].deviceId;
  
      chrome.hid.connect(hidDevice, function(connection) {
        connectionId = connection.connectionId;
        //Default to 8 but this needs to be detected later
        bsc.initSliders(8);
        $('.blinkstickInfo').text('Blinkstick Found');
      });
    
    });
  
  };

  this.emuButton = function(e){

    e.preventDefault();
    
    leds = [];
    
    var name = $(this).attr('data-name');
    var ledCount = $(this).attr('data-leds');
    
    if (ledCount > 0) {

      renderer.start(ledCount);

      $('.blinkstickInfo').text('Emulated '+name+' Found');

      bsc.initSliders(ledCount);
      $('input[rel=main]').attr({'disabled':false});
      $('#sliderControlMain').show();
      $('#emuPreview').show();
      renderer.render();

    } else {

      $('.blinkstickInfo').text('No Blinkstick Found');

      bsc.initSliders(0);
      $('input[rel=main]').attr({'disabled':true});
      $('#sliderControlMain').hide();
      $('#emuPreview').hide();
      
      renderer.stop();
      
    }

  };

  this.initSliders = function(n){

    $('div.sliderControl').remove();

    for (var x = 0; x < n; x++) {
      leds.push({
        led: {},
        slider: new BlinkstickChromeSlider(x),
        frequency: 0,
        pulse: 0,
        pattern: [],
        onoff: false,
        lastTick: 0
      });
    }

    var sliders = document.querySelectorAll("input[type=range]");
    for (var s = 0; s < sliders.length; s++) {
      sliders[s].addEventListener('input', bsc.slider);
    }

    var offButtons = document.querySelectorAll("button.off");
    for (var ob = 0; ob < offButtons.length; ob++) {
      offButtons[ob].addEventListener('click', bsc.offButton);
    }
    
    var linkButtons = document.querySelectorAll("div.headButtons label.link");
    for (var lb = 0; lb < linkButtons.length; lb++) {
      linkButtons[lb].addEventListener('click', bsc.linkButton);
    }
    
    var syncButtons = document.querySelectorAll("button.sync");
    for (var sb = 0; sb < syncButtons.length; sb++) {
      syncButtons[sb].addEventListener('click', bsc.syncButton);
    }

  };

  chrome.hid.onDeviceAdded.addListener(function(){
  
    console.log('Blinkstick added');
  
    bsc.initDeviceConnection();
  
  });
  
  chrome.hid.onDeviceRemoved.addListener(function(){
  
    console.log('Blinkstick removed');
    
    $('.sliderControl').remove();
    $('.blinkstickInfo').text('No Blinkstick Found');
  
  });

  return bsc;

};
