  /**
   * Main obj for BlinkstickChrome
   */
var BlinkstickChrome = function(){
  
  var bsc = this;

  var timer = new Timer();
  var p = 10000 * 1000;
  var pE = 0;
  var elapsedTotal = 0;
  var data;

  timer.stop();

  timer = new Timer({
    tick    : 1/50,
    ontick  : function(s) {

      elapsed = p-s;
      elapsedTotal += elapsed;
      p = s;
      data = [0];

      for (var i = 0; i < leds.length; i++) {

        if (leds[i].frequency > 0) {

          if (elapsedTotal - leds[i].lastTick > 1000 / leds[i].frequency) {

            leds[i].slider.toggle();
            leds[i].lastTick = elapsedTotal;

          }

        } else if (leds[i].patternLength > 0) {

          for (var pp = 0; pp < leds[i].pattern.length; pp++) {

            if (leds[i].patternElapsed < leds[i].patternIndex[pp]) {

              var effectElapsed = leds[i].patternIndex[pp] - leds[i].patternElapsed;

              if (typeof leds[i].pattern[pp] === 'object') {
                switch (leds[i].pattern[pp].type) {
                  case "pulse":
                    //start, end and time

                    //get the elapsed time for this effect
                    //convert to percentage
                    //get r/g/b percentages
                    //Push to led

                      var pE = ((effectElapsed/leds[i].pattern[pp].t) * 100);

                      var g = leds[i].pattern[pp].end.g - (((leds[i].pattern[pp].end.g - leds[i].pattern[pp].start.g) / 100) * pE);
                      var r = leds[i].pattern[pp].end.r - (((leds[i].pattern[pp].end.r - leds[i].pattern[pp].start.r) / 100) * pE);
                      var b = leds[i].pattern[pp].end.b - (((leds[i].pattern[pp].end.b - leds[i].pattern[pp].start.b) / 100) * pE);

                      data.push(g);
                      data.push(r);
                      data.push(b);

                    break;
                  default:
                    //r,g,b and time
                    data.push(leds[i].pattern[pp].g);
                    data.push(leds[i].pattern[pp].r);
                    data.push(leds[i].pattern[pp].b);
                    break;
                }
              } else {
                data.push(0);
                data.push(0);
                data.push(0);
              }
              break;

            }

          }

          if (leds[i].patternElapsed > leds[i].patternLength-((1/15)*1000)) { //minus tick length
            leds[i].patternElapsed = 0;
          }

        }

        leds[i].patternElapsed += elapsed;

      }      

      if (data.length === 25) {
        bsc.setColors(data);
      }

      i = 0;
      for (var d = 1; d < data.length; d+=3) {
        var r = data[d+1];
        var g = data[d];
        var b = data[d+2];
        leds[i++].slider.update(r,g,b);
      }


    }

  });
  
  timer.start(10000);

  var leds = [];

  this.slider = function(){

    var i = this.getAttribute('rel');

    var r,g,b,flash;

    if (i !== 'main') {

      r = document.querySelector("input.red[rel='"+i+"']").value;
      g = document.querySelector("input.green[rel='"+i+"']").value;
      b = document.querySelector("input.blue[rel='"+i+"']").value;
  
      leds[i].slider.update(r,g,b);

      flash = document.querySelector("input.flash[rel='"+i+"']").value;
      leds[i].frequency = flash;

    } else {

      r = document.querySelector("input.red[rel='"+i+"']").value;
      g = document.querySelector("input.green[rel='"+i+"']").value;
      b = document.querySelector("input.blue[rel='"+i+"']").value;
  
      for (var x = 0; x < leds.length; x++) {
        leds[x].slider.update(r,g,b);
      }

    }

  };
  
  this.offButton = function(){

    var i = this.getAttribute('rel');
    leds[i].slider.update(0,0,0);

  };

  this.linkButton = function(){
    
    var chk = $(this).find('input');
    var i   = $(chk).attr('rel');

    linked[i].link = !$(chk).is(':checked');

  };
  
  this.syncButton = function(){

    for (var i = 0; i < leds.length; i++) {
      leds[i].lastTick = 0;
      leds[i].slider.toggle(true);
    }    

  };

  this.setColor = function(i,r,g,b) {
  
    var data, arr;

    data = [0];

    if (i === 'main') {
      
      $('i.led[rel=main]').css({'color':'rgb('+r+','+g+','+b+')'});

      for (var x = 0; x < 8; x++) {

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


  this.setColors = function(data){

    arr = new Uint8Array(data);
  
    if (connectionId > -1) {
      chrome.hid.sendFeatureReport( connectionId, 6, arr.buffer, function(){
        //console.log('Set color');
      });
    }

  };


  this.initDeviceConnection = function(){
    
    var emuButtons = document.querySelectorAll("a.emu");
    for (var s = 0; s < emuButtons.length; s++) {
      emuButtons[s].addEventListener('click', bsc.emuButton);
    }

    var patternButtons = document.querySelectorAll("a.pattern");
    for (var p = 0; p < patternButtons.length; p++) {
      patternButtons[p].addEventListener('click', bsc.patternButton);
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

        bsc.start('blinkStrip', 8);

      });
    
    });
  
  };

  this.emuButton = function(e){

    e.preventDefault();
    
    leds = [];
    
    var name = $(this).attr('data-name');
    var ledCount = $(this).attr('data-leds');
    
    bsc.start(name,ledCount);

  };

  this.patternButton = function(e){

    e.preventDefault();

    var pattern = $(this).attr('data-pattern');
    
    bsc.initPattern(pattern);

  };

  this.start = function(name, ledCount) {

    if (ledCount === "0") {

      $('.blinkstickInfo').text('No Blinkstick Found');

      bsc.initSliders(0);
      $('input[rel=main]').attr({'disabled':true});
      $('#sliderControlMain').hide();
      $('#emuPreview').hide();
      
      renderer.stop();

    } else {

      renderer.start(ledCount);

      $('.blinkstickInfo').text('Emulated '+name+' Found');

      bsc.initSliders(ledCount);
      $('input[rel=main]').attr({'disabled':false});
      $('#sliderControlMain').show();
      $('#emuPreview').show();
      renderer.render();
      
      bsc.initPattern("chase");

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
        patternLength: 0,
        patternElapsed: 0,
        patternIndex: [],
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
  
  this.initPattern = function(pattern) {

    var ledCount = 8;
    var l;
    var t = 50;
    var t2 = t*2;
    var t3 = t*3;
    var lC = ledCount-1;

    switch (pattern) {
      case "chase":
        for (l = 0; l < ledCount; l++) {
          leds[l].pattern = [ 250*l, {r:255,g:0,b:0,t:250}, {r:0,g:255,b:0,t:250}, {r:0,g:0,b:255,t:250}, 250*ledCount - 250*l ];
        }
        break;

      case "bounce":
        for (l = 0; l < ledCount; l++) {
          leds[l].pattern = [ t*l, {r:255,g:0,b:0,t:t3}, t*lC - t*l ];
        }
        for (l = 0; l < ledCount; l++) {
          leds[l].pattern.push(t*(lC-l));
          leds[l].pattern.push({r:255,g:0,b:0,t:t3});
          leds[l].pattern.push(t*lC- t*(lC-l));
        }
        break;

      case "party":
        break;

      case "spectrum":

        for (l = 0; l < ledCount; l++) {
          leds[l].pattern = [ 
              750*l,
              {start:{r:0,g:0,b:0},end:{r:255,g:0,b:0},t:2500,type:"pulse"},
              {start:{r:255,g:0,b:0},end:{r:255,g:255,b:0},t:2500,type:"pulse"},
              {start:{r:255,g:255,b:0},end:{r:0,g:255,b:0},t:2500,type:"pulse"},
              {start:{r:0,g:255,b:0},end:{r:0,g:0,b:0},t:2500,type:"pulse"},
              750*ledCount - 750*l
            ];
        }


        break;

    }

    for (l = 0; l < ledCount; l++) {
      var pTotal = 0;
      for (var pl = 0; pl < leds[l].pattern.length; pl++) {
        if (typeof leds[l].pattern[pl] === 'object') {
          pTotal += leds[l].pattern[pl].t;
        } else {
          pTotal += leds[l].pattern[pl];
        }
        leds[l].patternIndex[pl] = pTotal;
      }
      leds[l].patternLength = pTotal;
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
