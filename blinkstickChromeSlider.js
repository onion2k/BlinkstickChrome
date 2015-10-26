/**
 * Slider controls for an LED (r,g,b,frequency)
 */
var BlinkstickChromeSlider = function(id) {

  var slider = this;
  var _id, el;
  var r,g,b,pattern,onoff;

  /**
   * Get the color set for an LED
   * @return arr [r,g,b] array
   */
  this.getColor = function() {

    var r = document.querySelector("input.red[rel='"+_id+"']").value;
    var g = document.querySelector("input.green[rel='"+_id+"']").value;
    var b = document.querySelector("input.blue[rel='"+_id+"']").value;
    
    return [r,g,b];

  };

  /**
   * Set the sliders all to 0
   */
  this.off = function(){
    this.update(0,0,0);    
    this.onoff = false;
  };

  /**
   * Set the sliders all to 0
   */
  this.toggle = function(onoff){
    console.log(onoff);
    onoff = onoff || this.onoff;
    if (onoff === true) {
      this.onoff = false;
      this.updateLed(0,0,0);
    } else {
      this.onoff = true;
      var c = this.getColor();
      this.updateLed(c[0],c[1],c[2]);
    }
  };

  /**
   * Set all the sliders and the LED icon to a specific color
   * @param num Red value (0-255)
   * @param num Green value (0-255)
   * @param num Blue value (0-255)
   */
  this.update = function(r,g,b) {
    this.updateSlider(r,g,b);
    this.updateLed(r,g,b);
    this.onoff = true;
  };

  /**
   * Update the sliders for the LED
   * @param num Red value (0-255)
   * @param num Green value (0-255)
   * @param num Blue value (0-255)
   */
  this.updateSlider = function(r,g,b) {

    $('input.red[type=range][rel='+_id+']').val(r);
    $('input.green[type=range][rel='+_id+']').val(g);
    $('input.blue[type=range][rel='+_id+']').val(b);

  };
  
  /**
   * Update the LED icon
   * @param num Red value (0-255)
   * @param num Green value (0-255)
   * @param num Blue value (0-255)
   */
  this.updateLed = function(r,g,b) {

    $('i.led[rel='+_id+']').css({'color':'rgb('+r+','+g+','+b+')'});
    renderer.setColor(_id,r,g,b);

  };

  /**
   * Build the HTML for the slider control
   * @param num LED ID
   */
  this.sliderTemplate = function(i) {
  
    var template = '<div class="col-sm-3 sliderControl">'+
      '<div class="panel panel-default">'+
      '  <div class="panel-heading clearfix">'+
      '     <div class="btn-group pull-right headButtons" data-toggle="buttons">'+
      '       <label class="btn btn-default btn-xs link"><input type="checkbox" name="link" class="link" rel="'+i+'">Link</button></label>'+
      '       <button class="btn btn-default btn-xs pattern" rel="'+i+'">Pattern</button>'+
      '       <button class="btn btn-default btn-xs off" rel="'+i+'">Off</button>'+
      '     </div>'+
      '    <h3 class="panel-title"><i class="glyphicon glyphicon-cd led" rel="'+i+'"></i> LED '+i+'</h3>'+
      '  </div>'+
      '  <div class="panel-body">'+
  
      '      <div class="row">'+
      '        <div class="col-xs-2" style="text-align: center;">'+
      '          <input class="red" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 70px;" orient="vertical" />'+
      '          R'+
      '        </div>'+
      '        <div class="col-xs-2" style="text-align: center;">'+
      '          <input class="green" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 70px;" orient="vertical" />'+
      '          G'+
      '        </div>'+
      '        <div class="col-xs-2" style="text-align: center;">'+
      '          <input class="blue" rel="'+i+'" type="range" min=0 max=255 step=1 value=0 style="height: 70px;" orient="vertical" />'+
      '          B'+
      '        </div>'+
      '        <div class="col-xs-2" style="text-align: center;">'+
      '          <input class="flash" rel="'+i+'" type="range" min=0 max=20 step=1 value=0 style="height: 70px;" orient="vertical" />'+
      '          F'+
      '        </div>'+
      '        <div class="col-xs-2" style="text-align: center;">'+
      '          <input class="pulse" rel="'+i+'" type="range" min=0 max=100 step=1 value=0 style="height: 70px;" orient="vertical" disabled />'+
      '          P'+
      '        </div>'+
      '        <div class="col-xs-2" style="text-align: center;">'+
      '          <input class="pattern" rel="'+i+'" type="range" min=0 max=100 step=1 value=0 style="height: 70px;" orient="vertical" disabled />'+
      '          Pa'+
      '        </div>'+
      '      </div>'+
  
      '  </div>'+
      ' </div>'+
      '</div>';
  
      return template;

  };

  _id = id || sliderControls.length;
  el = slider.sliderTemplate(_id);
  if (id !== 'main') {
    $('div#ledSliders').append(el);
  }

  return slider;

};
