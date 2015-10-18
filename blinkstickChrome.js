
var BlinkstickChrome = function(){
  
  var bsc = this;

  this.slider = function(){

    var i = this.getAttribute('rel');

    var r = document.querySelector("input.red[rel='"+i+"']").value;
    var g = document.querySelector("input.green[rel='"+i+"']").value;
    var b = document.querySelector("input.blue[rel='"+i+"']").value;

    bsc.setColor(i,r,g,b);

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
  

  this.setColor = function(i,r,g,b) {
  
    var data, arr;

    data = [0];

    if (i === 'main') {
      
      $('i.led[rel=main]').css({'color':'rgb('+r+','+g+','+b+')'});

      for (var x = 0; x < 8; x++) {

        sliderControls[x].updateSlider(r,g,b);
        sliderControls[x].updateLed(r,g,b);

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
            
            sliderControls[l].updateSlider(r,g,b);
            sliderControls[l].updateLed(r,g,b);
  
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
  
        sliderControls[i].updateSlider(r,g,b);
        sliderControls[i].updateLed(r,g,b);
  
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
        bsc.initSliders(8);
        $('.blinkstickInfo').text('Blinkstick Found');
      });
    
    });
  
  };

  this.emuButton = function(e){

        e.preventDefault();
        
        var name = $(this).attr('data-name');
        var leds = $(this).attr('data-leds');
  
        $('.blinkstickInfo').text('Emulated '+name+' Found');
  
        bsc.initSliders(leds);
        $('input[rel=main]').attr({'disabled':false});
  
  };

  this.initSliders = function(n){

    $('div.sliderControl').remove();
    
    for (var x = 0; x < n; x++) {
      sliderControls.push(new BlinkstickChromeSlider());
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
