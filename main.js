
var connectionId = -1;
var MY_HID_VENDOR_ID = 8352;
var MY_HID_PRODUCT_ID = 16869;
var DEVICE_INFO = {"vendorId": MY_HID_VENDOR_ID, "productId": MY_HID_PRODUCT_ID };

window.onload = function() { initDeviceConnection(); };

function slider(){

  var i = this.getAttribute('rel');
  
  var r = document.querySelector("input.red[rel='"+i+"']").value;
  var g = document.querySelector("input.green[rel='"+i+"']").value;
  var b = document.querySelector("input.blue[rel='"+i+"']").value;

  setColor(i,r,g,b);

}

function setColor(i,r,g,b) {
  
  if (connectionId) {

    var data = [0, i, r, g, b];
    var arr = new Uint8Array(data);
  
    chrome.hid.sendFeatureReport( connectionId, 5, arr.buffer, function(){
      //console.log('Set color');
    });

  }

}

chrome.hid.onDeviceAdded.addListener(function(){

  console.log('Blinkstick added');
  initDeviceConnection();

});

chrome.hid.onDeviceRemoved.addListener(function(){

  console.log('Blinkstick removed');

});

function initDeviceConnection(){

  chrome.hid.getDevices(DEVICE_INFO, function(devices) {

    if (!devices || !devices.length) {
     console.log('device not found');
     return;
    }

    hidDevice = devices[0].deviceId;

    chrome.hid.connect(hidDevice, function(connection) {
       connectionId = connection.connectionId;
    });
  
  });

  for (var x = 0; x < 2; x++) {

    var template = sliderTemplate(x);
    $('body').append(template);

  }

  var sliders = document.querySelectorAll("input[type=range]");
  for (var s = 0; s < sliders.length; s++) {
    sliders[s].addEventListener('input', slider);
  }

  
}

function sliderTemplate(i) {

  var template = '<div class="col-sm-2">'+
    '<div class="panel panel-default">'+
    '  <div class="panel-heading">'+
    '    <h3 class="panel-title">LED '+i+' Control</h3>'+
    '  </div>'+
    '  <div class="panel-body">'+

    '      <div class="row">'+
    '        <div class="col-xs-3" style="text-align: center;">'+
    '          <input class="red" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 200px;" orient="vertical" />'+
    '          R'+
    '        </div>'+
    '        <div class="col-xs-3" style="text-align: center;">'+
    '          <input class="green" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 200px;" orient="vertical" />'+
    '          G'+
    '        </div>'+
    '        <div class="col-xs-3" style="text-align: center;">'+
    '          <input class="blue" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 200px;" orient="vertical" />'+
    '          B'+
    '        </div>'+
    '        <div class="col-xs-3" style="text-align: center;">'+
    '          <input class="lum" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 200px;" orient="vertical" />'+
    '          F'+
    '        </div>'+
    '      </div>'+

    '  </div>'+
    ' </div>'+
    '</div>';

    return template;
  
}

