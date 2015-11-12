
var BlinkstickHIDInterface = function(bsc) {

  var connectionId = -1;
  var MY_HID_VENDOR_ID = 8352;
  var MY_HID_PRODUCT_ID = 16869;
  var DEVICE_INFO = {"vendorId": MY_HID_VENDOR_ID, "productId": MY_HID_PRODUCT_ID };

  var hid = this;
  this.bsc = bsc;

  chrome.hid.onDeviceAdded.addListener(function(){
  
    hid.initDeviceConnection();

  });
  
  chrome.hid.onDeviceRemoved.addListener(function(){
  
    console.log('Blinkstick removed');
    bsc.stop();
  
  });

  this.initDeviceConnection = function(){
    
    chrome.hid.getDevices(DEVICE_INFO, function(devices) {
  
      if (!devices || !devices.length) {
       console.log('device not found');
       return;
      }
      
      hidDevice = devices[0].deviceId;
  
      chrome.hid.connect(hidDevice, function(connection) {
        connectionId = connection.connectionId;

        console.log('Blinkstick connected');
        bsc.start('blinkStrip', 8);

      });
    
    });

  };

  this.setColor = function(i,r,g,b) {
  
    data = [0, i, r, g, b];
    arr = new Uint8Array(data);

    if (connectionId > -1) {
      chrome.hid.sendFeatureReport( connectionId, 5, arr.buffer, function(){
        //console.log('Set color');
      }); 
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

};