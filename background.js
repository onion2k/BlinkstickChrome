
chrome.app.runtime.onLaunched.addListener(function(launchData) {

	chrome.app.window.create(
		'index.html',
		{
			id: 'mainWindow',
			bounds: {width: 1280, height: 800}
		}
	);

  var tcp = new BlinkstickChromeTCPServer();
  tcp.startServer("127.0.0.1", 8888);

});