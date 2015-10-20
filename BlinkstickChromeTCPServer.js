
var BlinkstickChromeTCPServer = function() {

	var tcpServer;
	var server = this;

	function onAcceptCallback(tcpConnection, socketInfo) {
	  var info="["+socketInfo.peerAddress+":"+socketInfo.peerPort+"] Connection accepted!";
	  tcpConnection.addDataReceivedListener(function(data) {
	      if (data.length>0) {

	        var d = JSON.parse(data);
	        
	        console.log(d);
	        
          chrome.runtime.sendMessage(d, function(response) {
            console.log('Done');
          });

	      }

    });
	}

	this.startServer = function(addr, port) {
	  if (tcpServer) {
	    tcpServer.disconnect();
	  }
	  tcpServer = new TcpServer(addr, port);
	  tcpServer.listen(onAcceptCallback);
	};


	this.stopServer = function() {
	  if (tcpServer) {
	    tcpServer.disconnect();
	    tcpServer=null;
	  }
	};


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