
var connectionId = -1;
var MY_HID_VENDOR_ID = 8352;
var MY_HID_PRODUCT_ID = 16869;
var DEVICE_INFO = {"vendorId": MY_HID_VENDOR_ID, "productId": MY_HID_PRODUCT_ID };

var linked = {
  0: {r:0,g:0,b:0,f:0,pattern:[],link:false},
  1: {r:0,g:0,b:0,f:0,pattern:[],link:false},
  2: {r:0,g:0,b:0,f:0,pattern:[],link:false},
  3: {r:0,g:0,b:0,f:0,pattern:[],link:false},
  4: {r:0,g:0,b:0,f:0,pattern:[],link:false},
  5: {r:0,g:0,b:0,f:0,pattern:[],link:false},
  6: {r:0,g:0,b:0,f:0,pattern:[],link:false},
  7: {r:0,g:0,b:0,f:0,pattern:[],link:false}
};

var sliderControls = [];

var bsc = new BlinkstickChrome();
window.onload = function() { bsc.initDeviceConnection(); };

var renderer = new BlinkstickCanvasRenderer();
renderer.render();
