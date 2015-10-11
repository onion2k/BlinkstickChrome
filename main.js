var connectionId = -1;

window.onload = function() {

  var MY_HID_VENDOR_ID = 8352;
  var MY_HID_PRODUCT_ID = 16869;
  var DEVICE_INFO = {"vendorId": MY_HID_VENDOR_ID, "productId": MY_HID_PRODUCT_ID };
  
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
  
};

document.querySelector("#off").addEventListener('click', function(){

  setColor(0,0,0,0);

});

document.querySelector("#redSlider").addEventListener('input', slider);
document.querySelector("#greenSlider").addEventListener('input', slider);
document.querySelector("#blueSlider").addEventListener('input', slider);

function slider(){

  var i = document.querySelector("input[name=channel]:checked").value;

  var r = document.querySelector("#redSlider").value;
  var g = document.querySelector("#greenSlider").value;
  var b = document.querySelector("#blueSlider").value;

  setColor(i,r,g,b);

}

function setColor(i,r,g,b) {

  var data = [0, i, r, g, b];
  var arr = new Uint8Array(data);

  chrome.hid.sendFeatureReport( connectionId, 5, arr.buffer, function(){
    //console.log('Set color');
  });


}

chrome.hid.onDeviceAdded.addListener(function(){

  console.log('Blinkstick added');

});

chrome.hid.onDeviceRemoved.addListener(function(){

  console.log('Blinkstick removed');

});