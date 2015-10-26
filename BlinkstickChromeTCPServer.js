/**
 * A wrapper around the Google Chrome Apps tcp-server.js example that takes
 * a request, parses it as JSON, and send it to BlinkstickChrome as a message.
 */

var BlinkstickChromeTCPServer = function() {

	var tcpServer;
	var server = this;

  /**
   * The callback that runs every time there's a request.
   * @param obj tcpConnection
   * @param obj socketInfo
   */
	function onAcceptCallback(tcpConnection, socketInfo) {
	  var info="["+socketInfo.peerAddress+":"+socketInfo.peerPort+"] Connection accepted!";
	  tcpConnection.addDataReceivedListener(function(data) {
	      if (data.length>0) {

	        var d = JSON.parse(data);
	        
          chrome.runtime.sendMessage(d, function(response) {
            console.log('TCP Request completed');
          });

	      }

    });
	}

  /**
   * Fire up the server
   * @param string IP address as a string 
   * @param num Port number
   */
	this.startServer = function(addr, port) {
	  if (tcpServer) {
	    tcpServer.disconnect();
	  }
	  tcpServer = new TcpServer(addr, port);
	  tcpServer.listen(onAcceptCallback);
	};

  /**
   * Stop the server if it's running
   */
	this.stopServer = function() {
	  if (tcpServer) {
	    tcpServer.disconnect();
	    tcpServer=null;
	  }
	};

  /**
   * Check to see what the server is doing.
   */
	this.getServerState = function() {
	  if (tcpServer) {
	    return {isConnected: tcpServer.isConnected(),
	      addr: tcpServer.addr,
	      port: tcpServer.port};
	  } else {
	    return {isConnected: false};
	  }
	};

	return this;

};