
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

function offButton(){

  var i = this.getAttribute('rel');

  document.querySelector("input.red[rel='"+i+"']").value = 0;
  document.querySelector("input.green[rel='"+i+"']").value = 0;
  document.querySelector("input.blue[rel='"+i+"']").value = 0;

  setColor(i,0,0,0);
  
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
  
  $('.sliderControl').remove();
  $('.blinkstickInfo').text('No Blinkstick Found');

});

function initDeviceConnection(){

  chrome.hid.getDevices(DEVICE_INFO, function(devices) {

    if (!devices || !devices.length) {
     console.log('device not found');
     return;
    }
    
    console.log(devices);

    hidDevice = devices[0].deviceId;

    chrome.hid.connect(hidDevice, function(connection) {
      connectionId = connection.connectionId;
      initSliders(8);
      $('.blinkstickInfo').text('Blinkstick Nano Found');
    });
  
  });

}

function initSliders(n) {

  for (var x = 0; x < n; x++) {

    var template = sliderTemplate(x);
    $('body').append(template);

  }

  var sliders = document.querySelectorAll("input[type=range]");
  for (var s = 0; s < sliders.length; s++) {
    sliders[s].addEventListener('input', slider);
  }
  
  var offButtons = document.querySelectorAll("button.off");
  for (var ob = 0; ob < offButtons.length; ob++) {
    offButtons[ob].addEventListener('click', offButton);
  }

  
}

function sliderTemplate(i) {

  var template = '<div class="col-sm-3 sliderControl">'+
    '<div class="panel panel-default">'+
    '  <div class="panel-heading clearfix">'+
    '     <div class="btn-group pull-right"><button class="btn btn-default btn-xs off" rel="'+i+'">Off</button></div>'+
    '    <h3 class="panel-title">LED '+i+' Control</h3>'+
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
  
}

