AFRAME.registerComponent('infocard', {
  schema: {
    target: {default: 'infocard-default'},
  },
  init: function() {
    var self = this;
    var camera = document.querySelector("a-camera");
    
    self.el.addEventListener('click', function (e) {
      if (typeof jQuery == 'function') {
        if (jQuery('#' + self.data.target + '.infocardHTML').is(":visible") === true) {
          jQuery('#' + self.data.target + '.infocardHTML').parent('.infocard').hide('slide', { direction: "down"}, 100);
        }
        else {
          jQuery('#' + self.data.target + '.infocardHTML').parent('.infocard').show('slide', { direction: "down"}, 100);
          // Force look
          camera.setAttribute("look-controls", {enabled: false});
          let pointTarget = getVector(camera, self.el);
          centerCamera(camera,pointTarget);  
          camera.setAttribute("look-controls", {enabled: true});
        }
        setTimeout(function() { openCloseVTFunctions(); }, 101);
        e.stopPropagation();
        e.preventDefault();
      }
      else {
        console.log('!IMPORTANT! jQuery not loaded');
      }
    }, false);
  }
});