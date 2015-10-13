
var connectionId = -1;
var MY_HID_VENDOR_ID = 8352;
var MY_HID_PRODUCT_ID = 16869;
var DEVICE_INFO = {"vendorId": MY_HID_VENDOR_ID, "productId": MY_HID_PRODUCT_ID };

var BlinkstickChrome = function(){
  
  var bsc = this;

  this.slider = function(){
  
    var i = this.getAttribute('rel');
    
    var r = document.querySelector("input.red[rel='"+i+"']").value;
    var g = document.querySelector("input.green[rel='"+i+"']").value;
    var b = document.querySelector("input.blue[rel='"+i+"']").value;
    
    $(this).closest('.panel').find('.led').css({'color':'rgb('+r+','+g+','+b+')'});
  
    bsc.setColor(i,r,g,b);
  
  };
  
  this.offButton = function(){
  
    var i = this.getAttribute('rel');
  
    document.querySelector("input.red[rel='"+i+"']").value = 0;
    document.querySelector("input.green[rel='"+i+"']").value = 0;
    document.querySelector("input.blue[rel='"+i+"']").value = 0;

    $(this).closest('.panel').find('.led').css({'color':'rgb(0,0,0)'});

    bsc.setColor(i,0,0,0);
    
  };
  
  this.setColor = function(i,r,g,b) {
    
    if (connectionId) {
  
      var data = [0, i, r, g, b];
      var arr = new Uint8Array(data);
    
      chrome.hid.sendFeatureReport( connectionId, 5, arr.buffer, function(){
        //console.log('Set color');
      });
  
    }
  
  };

  this.initDeviceConnection = function(){
  
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
  
  this.initSliders = function(n){
  
    for (var x = 0; x < n; x++) {
      var template = bsc.sliderTemplate(x);
      $('body').append(template);
    }
  
    var sliders = document.querySelectorAll("input[type=range]");
    for (var s = 0; s < sliders.length; s++) {
      sliders[s].addEventListener('input', bsc.slider);
    }
    
    var offButtons = document.querySelectorAll("button.off");
    for (var ob = 0; ob < offButtons.length; ob++) {
      offButtons[ob].addEventListener('click', bsc.offButton);
    }
    
  };
  
  this.sliderTemplate = function(i) {
  
    var template = '<div class="col-sm-3 sliderControl">'+
      '<div class="panel panel-default">'+
      '  <div class="panel-heading clearfix">'+
      '     <div class="btn-group pull-right">'+
      '       <button class="btn btn-default btn-xs link" rel="'+i+'">Link</button>'+
      '       <button class="btn btn-default btn-xs off" rel="'+i+'">Off</button>'+
      '     </div>'+
      '    <h3 class="panel-title"><i class="glyphicon glyphicon-cd led"></i> LED '+i+' Control</h3>'+
      '  </div>'+
      '  <div class="panel-body">'+
  
      '      <div class="row">'+
      '        <div class="col-xs-3" style="text-align: center;">'+
      '          <input class="red" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 150px;" orient="vertical" />'+
      '          R'+
      '        </div>'+
      '        <div class="col-xs-3" style="text-align: center;">'+
      '          <input class="green" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 150px;" orient="vertical" />'+
      '          G'+
      '        </div>'+
      '        <div class="col-xs-3" style="text-align: center;">'+
      '          <input class="blue" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 150px;" orient="vertical" />'+
      '          B'+
      '        </div>'+
      '        <div class="col-xs-3" style="text-align: center;">'+
      '          <input class="lum" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 150px;" orient="vertical" disabled />'+
      '          F'+
      '        </div>'+
      '      </div>'+
  
      '  </div>'+
      ' </div>'+
      '</div>';
  
      return template;

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

var bsc = new BlinkstickChrome();
window.onload = function() { bsc.initDeviceConnection(); };

