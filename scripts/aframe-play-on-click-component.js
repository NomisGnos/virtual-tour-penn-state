/* global AFRAME */
AFRAME.registerComponent('play-on-click', {
  init: function () {
    this.onClick = this.onClick.bind(this);
  },
  play: function () {
    window.addEventListener('click', this.onClick);
  },
  pause: function () {
    window.removeEventListener('click', this.onClick);
  },
  onClick: function (evt) {
    var videoEl = this.el.getAttribute('material').src;
    console.log(videoEl);
    if (!videoEl) { return; }
    this.el.object3D.visible = true;
    videoEl.play();
    document.getElementById('click-to-start').setAttribute('visible', false);
  }
});
