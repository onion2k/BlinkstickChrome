# BlinkstickChrome
A Chrome app to control a blinkstick.

Requires Chrome dev channel to access chrome.hid, and a version newer than Chrome 41 in order to access onDeviceAdded and onDeviceRemoved events.

# Running BlinkstickChrome
You can install the latest stable version of BsC from the Chrome Web App Store. 

To run the most up-to-date version of BsC, clone the repo, then open your Chrome extensions page (chrome://extensions) and switch on Developer mode by checking the tickbox at the top right. Then use the "Load Unpacked Extension..." button to find BsC's folder and install it as an app.

# Using a Blinkstick
When the app is running plug in a Blinkstick and it'll be detected automatically. Note: BsC doesn't yet detect the number of available LEDs, so you'll get 8 controls. Using controls for LEDs that don't exist will throw out errors.

# Emulating a Blinkstick
You don't actually need a Blinkstick to use BsC. Click on the Emulators menu at the top of the app, then select a device type to emulate. A 3D visualisation of the device will be displayed, and all the controls will work with it.

# The Bridge
BsC includes a small server instance that accepts basic controls for the Blinkstick. To use it, connect to 127.0.0.1:8888 and send a JSON string in the format of {i:<index>,r:<red>,g:<green>,b:<blue>} eg {i:0,r:255,g:0,:b:0} to turn the 0th LED red.

The advantage of using the bridge is that you can control a Blinkstick using any programming language that can send a TCP packet.