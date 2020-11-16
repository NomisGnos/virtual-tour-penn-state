AFRAME.registerComponent('loadingscreen', {
  init: function() {
    if (typeof jQuery == 'function') {
      jQuery("#loadingScreen").fadeOut("slow");
    }
  }
});