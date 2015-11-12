
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

var bsc = new BlinkstickChrome();
window.onload = function() { 
  
  bsc.initUIListeners();
  bsc.initHid();

};

var renderer = new BlinkstickCanvasRenderer();

var messageListener = chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    renderer.setColor(request.i,request.r,request.g,request.b);

    sendResponse({"response": "done"});

});
