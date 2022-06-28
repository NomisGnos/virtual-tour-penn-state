
var imgInfo = new Image();
imgInfo.setAttribute('id', 'info');
imgInfo.crossOrigin = "Anonymous";
imgInfo.src = 'https://harrisburg2.vmhost.psu.edu/virtual-tours/assets/info-icon.png';

var imgPulse = new Image();
imgPulse.setAttribute('id', 'pulse');
imgPulse.crossOrigin = "Anonymous";
imgPulse.src = 'https://harrisburg2.vmhost.psu.edu/virtual-tours/assets/pulse.png';

var imgArrow = new Image();
imgArrow.setAttribute('id', 'arrow');
imgArrow.crossOrigin = "Anonymous";
imgArrow.src = 'https://harrisburg2.vmhost.psu.edu/virtual-tours/assets/arrow.png';

jQuery( document ).ready(function(){
  document.body.appendChild(imgInfo);
  document.body.appendChild(imgPulse);
  document.body.appendChild(imgArrow);
  if (jQuery('div#virtualTour').length === 1) {
    var virtualTourData = jQuery('div#virtualTour');
    var videoSphere = virtualTourData.data('aframe-videosphere');
    var videoSphereRotation = virtualTourData.data('aframe-videosphere-rotate');
    var imageSphere = virtualTourData.data('aframe-imagesphere');
    var imageSphereRotation = virtualTourData.data('aframe-image-rotate');
    var logo = virtualTourData.data('aframe-logo');
    var homepage = virtualTourData.data('aframe-homepage');
    var arrMainMenuNavigateTo = new Array();
    var mmContact, mmCampusGallery, mmVideos;

    if (typeof videoSphereRotation === 'undefined') { videoSphereRotation = 0; }
    if (typeof imageSphereRotation === 'undefined') { imageSphereRotation = 0; }
    if (typeof logo === 'undefined') { logo = 'https://visualidentity.psu.edu/sites/default/themes/penn_state/logo.png'; }
        
    // This is alternative data. Grab via JSON and populate.  If json does not exist, then move on.
    if (typeof virtualTourData.data('aframe-json-configurations') != 'undefined') {
      jQuery.getJSON(virtualTourData.data('aframe-json-configurations'), function(data) {
        if (typeof data.main_menu != 'undefined') {
          data.main_menu.forEach(arrMMJsonConf => {
            // Main Menu -- "Navigate to"
            if (typeof arrMMJsonConf.navigateto != 'undefined') {
              arrMMJsonConf.navigateto.forEach((arrData, arrIndex) => {
                if (typeof arrData.Name != 'undefined' || typeof arrData.Url != 'undefined' || typeof arrData.Imageurl != 'undefined') {
                  arrMainMenuNavigateTo[arrIndex] = arrData;
                }
                else { 
                  console.log('ERROR: Malform JSON >> "navigateto"'); 
                }
              });
            }

            try { mmContact = arrMMJsonConf.contactus[0]; } catch(e) { }
            try { mmCampusGallery = arrMMJsonConf.campusgallery[0]; } catch(e) { }
            try { mmVideos = arrMMJsonConf.videos[0]; } catch(e) { }
          });
        }
      }).always(function(){
        // RUN AFTER getJSON because it's async
        renderMainMenuNavigationTo(arrMainMenuNavigateTo); 
        renderMainMenuCampusGallery(mmCampusGallery);
        renderMainMenuContactUs(mmContact);
        renderMainMenuCampusVideo(mmVideos);
      }); //end of getJSON
    }

    // Add loading screen
    jQuery('body').prepend(`
      <div id="loadingScreen">
        <div class="loadingBoxes">
          <img src="https://harrisburg2.vmhost.psu.edu/virtual-tours/assets/loadingBoxes.gif" alt="loading..." class="loadingBoxesImg" />
          <img src="` + logo + `" class="logo" />
        </div>
      </div>
    `);

    // Add header bar
    jQuery('body').prepend(`
      <div id="vt-headerbar">
        <div class="headbar">
          <a href="` + homepage + `" title="Visit our homepage"><img src="` + logo + `" class="logo" /></a>
          <div id="nav-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="menubar">
          <a id="virtour-navigation-button" href="#" class="fas fa-map-marked">Navigate to...</a>
          <a id="virtour-helper-button" href="#" class="fas fa-question-circle">Help Me</a>
        </div>
      </div>
    `);

    jQuery('#nav-icon').click(function(){
      openCloseMenuBar();
    });

    var helperHTML = `
      <ul>
        <li>Click/tap and drag the scene around. </li>
        <li>Click/tap on an <img src="https://harrisburg2.vmhost.psu.edu/virtual-tours/assets/info-icon.png" width="10" height="10" alt="info" /> button for more information about that tour stop.</li>
        <li>Click/tap on a directional arrow <img src="https://harrisburg2.vmhost.psu.edu/virtual-tours/assets/arrow.png" width="10" height="10" alt="arrow" /> to go to the next stop.</li>
        <li>Use the <strong>Navigate to...</strong> menu to jump to any stop on the tour. </li>
      </ul>
      <p>
        <span class="fas fa-volume-up"></span>/<span class="fas fa-volume-mute"></span> turn background sound on/off <br />
        <span class="fas fa-expand"></span>/<span class="fas fa-compress"></span> open/close fullscreen mode <br />
        <span class="fas fa-play"></span>/<span class="fas fa-stop"></span> play/stop audio
      </p>
      <p>
        <button id="vt-helper-gotIt">Got it!</button>
      </p>
    `;

    // Add helper
    jQuery('body').prepend(`
      <div id="vt-helper">
        ` + helperHTML + `
      </div>
    `);

    // Add Feedback
    jQuery('body').prepend(`
      <a id="feedback" href="https://forms.office.com/r/vzKaK5Txct" title="Leave a feedback.">Feedback</a>
    `);

    // Add functions for virtual tours
    if (typeof videoSphere != 'undefined') {
      jQuery('body').prepend(`
        <div id="vt-functions">
          <a href="#" id="videoSphereSound" class="fas fa-volume-mute" title="Unmute"></a>
          <a href="#" id="fullScreenButton" class="fas fa-expand" title="Expand/Collapse Window"></a>
        </div>
      `);
    } else {
      jQuery('body').prepend(`
        <div id="vt-functions">
          <a href="#" id="fullScreenButton" class="fas fa-expand" title="Expand/Collapse Window"></a>
        </div>
      `);
    }

    // Add helper overlay
    jQuery('body').prepend(`
      <div id="vt-helperOverlay">
        <span class="fas fa-angle-double-left animateBounceLeft"></span>
        <span id="helperIcon" class="fas fa-mouse blink" title="Pan your camera by click and holding down the left mouse button and dragging the world around (desktop)."></span>
        <span class="fas fa-hand-point-up blink"></span>
        <span class="fas fa-angle-double-right animateBounceRight"></span>
      </div>
    `);
    jQuery(document.body).bind('mousemove keydown click',hideHelperOverlay);

    // [a-scene]
    var a_scene = document.createElement('a-scene');
    a_scene.setAttribute('renderer', {precision: 'mediump'});
    a_scene.setAttribute('loadingscreen', true);
    a_scene.setAttribute('vr-mode-ui', {enabled: true});

    // [a-assets]
    var a_assets = document.createElement('a-assets');
    a_assets.setAttribute('id', 'assets');

    if (typeof videoSphere != 'undefined') { 
      var a_assetsVideo = document.createElement('video');
      a_assetsVideo.setAttribute('id', 'assetsvideo');
      a_assetsVideo.setAttribute('muted', 'true');
      a_assetsVideo.setAttribute('webkit-playsinline', true);
      a_assetsVideo.setAttribute('crossorigin', 'anonymous');
      a_assetsVideo.setAttribute('playsinline', true);
      a_assetsVideo.setAttribute('autoplay', true);
      a_assetsVideo.setAttribute('loop', true);
      a_assetsVideo.setAttribute('src', videoSphere);
      a_assets.appendChild(a_assetsVideo);

      // [a-videosphere]
      var a_videoSphere = document.createElement('a-videosphere');
      a_videoSphere.setAttribute('autoplay', true);
      a_videoSphere.setAttribute('preload', 'auto');
      a_videoSphere.setAttribute('id', 'video-player');
      a_videoSphere.setAttribute('src', '#assetsvideo');
      a_videoSphere.setAttribute('rotation', '0 ' + videoSphereRotation + ' 0');
      a_scene.appendChild(a_videoSphere);
    }

    if (typeof imageSphere != 'undefined') { 
      var a_assetsImage = new Image();
      a_assetsImage.setAttribute('id', 'assetsSky');
      a_assetsImage.crossOrigin = "Anonymous";
      a_assetsImage.src = imageSphere;
      a_assets.appendChild(a_assetsImage);

      // [a-sky]
      var a_sky = document.createElement('a-sky');
      a_sky.setAttribute('src', '#assetsSky');
      a_sky.setAttribute('preload', 'auto');
      a_sky.setAttribute('rotation', '0 ' + imageSphereRotation + ' 0');
      a_scene.appendChild(a_sky);
    }

    // Standard assets (see top of code for preload)
    a_assets.appendChild(imgInfo);
    a_assets.appendChild(imgPulse);
    a_assets.appendChild(imgArrow);

    a_scene.appendChild(a_assets);

    // [a-camera]
    var a_camera = document.createElement('a-camera');
    a_camera.setAttribute('id', 'camera');
    a_camera.setAttribute('cursor', { rayOrigin: 'mouse' } );
    a_camera.setAttribute('reverse-mouse-drag', true );
    a_camera.setAttribute('zoom', '1' );
    a_camera.setAttribute('wasd-controls-enabled', false );

    var a_cameraEntityCam = document.createElement('a-entity');
    a_camera.appendChild(a_cameraEntityCam);
    a_scene.appendChild(a_camera);


    // [a-plane] INFOCARDS
    jQuery('div#virtualTour div[data-infocard-id]').each(function(){
      var a_planeInfocard = document.createElement('a-plane');
      var a_planePulse = document.createElement('a-plane');
      var a_entLabel = document.createElement('a-entity');
      
      var aplaneId = jQuery(this).data('infocard-id');
      var aplaneCoordinate = jQuery(this).data('infocard-coordinates');
      var aplaneImage = jQuery(this).data('infocard-image');
      var aplaneLabel = jQuery(this).data('infocard-label');
      var aplaneHeader = jQuery(this).data('infocard-header');
      var aplaneAudio = jQuery(this).data('infocard-audio');

      if (typeof aplaneCoordinate === 'undefined' || aplaneCoordinate === '') {
        return true;
      }

      a_planeInfocard.setAttribute('id', 'info-' + aplaneId);
      a_planeInfocard.setAttribute('position', aplaneCoordinate);
      a_planeInfocard.setAttribute('width', '.5');
      a_planeInfocard.setAttribute('height', '.5');
      a_planeInfocard.setAttribute('class', 'clickable');
      a_planeInfocard.setAttribute('look-at', '#camera');
      a_planeInfocard.setAttribute('src', '#info');
      a_planeInfocard.setAttribute('material', { transparent: true });
      a_planeInfocard.setAttribute('infocard', { target: aplaneId });

      a_planePulse.setAttribute('id', 'pulse-' + aplaneId);
      a_planePulse.setAttribute('position', '0 0 -.1');
      a_planePulse.setAttribute('animation__scale', {property: 'scale', dir: 'alternate', dur: '777', easing: 'easeInSine', loop: 'true', to: '1.3 1.3 1'});
      a_planePulse.setAttribute('width', '.5');
      a_planePulse.setAttribute('height', '.5');
      a_planePulse.setAttribute('look-at', '#camera');
      a_planePulse.setAttribute('src', '#pulse');
      a_planePulse.setAttribute('material', { transparent: true });
      a_planePulse.setAttribute('infocard', { target: aplaneId });
      a_planeInfocard.appendChild(a_planePulse);

      if (typeof aplaneLabel != 'undefined' && aplaneLabel != '') {
        a_entLabel.setAttribute('id', 'label-' + aplaneId);
        a_entLabel.setAttribute('position', '0 -.26 2');
        a_entLabel.setAttribute('geometry', {primitive: 'plane', height: '.2', width: '1.2' });
        a_entLabel.setAttribute('look-at', '#camera');
        a_entLabel.setAttribute('material', { color: '#001E44' });
        a_entLabel.setAttribute('text', {color: '#fff', align: 'center', letterSpacing: 2, lineHeight: 50, zOffset: .7, value: aplaneLabel});
        a_planeInfocard.appendChild(a_entLabel);
      }

      // Finished with planeInfocard. Attach.
      a_scene.appendChild(a_planeInfocard);

      jQuery(this).addClass('infocardContent');
      jQuery(this).wrap('<div class="infocard"></div>').wrap('<div id="'+ aplaneId +'" class="infocardHTML"></div>');

      if (aplaneImage !== undefined) {
        jQuery('div#virtualTour div#'+ aplaneId +'.infocardHTML').prepend('<img src="'+ aplaneImage +'" />');
      }
      if (aplaneHeader !== undefined) {
        jQuery('div#virtualTour div#'+ aplaneId +'.infocardHTML div.infocardContent').prepend('<p class="header">'+ aplaneHeader +'</p>');
      }

      if (aplaneAudio !== undefined) {
        $('div#virtualTour div#'+ aplaneId +'.infocardHTML div.infocardContent').append('<span class="audioInfocard speakingGuide" data-filename="' + aplaneAudio + '" title="Play/Stop recording"><button class="play fas fa-play-circle"></button></button><button class="stop fas fa-stop-circle"></button></span>');
      }
    });

    // [a-plane] NAVIGATION
    jQuery('div#virtualTour div[data-navigateTo-id]').each(function(){
      var a_planeNav = document.createElement('a-plane');
      var a_entNavLabel = document.createElement('a-entity');
      var aplaneId = jQuery(this).data('navigateto-id');
      var aplaneUrl = jQuery(this).data('navigateto-url');
      var aplaneDegrees = jQuery(this).data('navigateto-degrees');
      var aplaneNavLabel = jQuery(this).data('navigateto-label');

      a_planeNav.setAttribute('id', 'navigateTo-' + aplaneId);
      a_planeNav.setAttribute('position', calculateDegrees(aplaneDegrees, 1.21));
      a_planeNav.setAttribute('width', '.5');
      a_planeNav.setAttribute('height', '.5');
      a_planeNav.setAttribute('scale', '.35 .35 .35');
      a_planeNav.setAttribute('class', 'clickable');
      a_planeNav.setAttribute('look-at', '#camera');
      a_planeNav.setAttribute('href', aplaneUrl);
      a_planeNav.setAttribute('src', '#arrow');
      a_planeNav.setAttribute('material', { transparent: true });

      if (typeof aplaneNavLabel != 'undefined' && aplaneNavLabel != '') {
        a_entNavLabel.setAttribute('id', 'label-' + aplaneId);
        a_entNavLabel.setAttribute('position', '0 -.26 1.1');
        a_entNavLabel.setAttribute('geometry', {primitive: 'plane', height: '.2', width: '1.2' });
        a_entNavLabel.setAttribute('look-at', '#camera');
        a_entNavLabel.setAttribute('material', { color: '#001E44' });
        a_entNavLabel.setAttribute('text', {color: '#fff', align: 'center', letterSpacing: 2, lineHeight: 50, zOffset: .7, value: aplaneNavLabel});
        a_planeNav.appendChild(a_entNavLabel);
      }

      // Finished with planeNav. Attach.
      a_scene.appendChild(a_planeNav);
    });

    // Add close button infocards
    jQuery('.infocardHTML').prepend(`
      <div class="infocardFunctions">
        <a id="closeInfoCard" title="Close infocard" class="fas fa-window-close" href="#"></a>
      </div>
    `);

    // Append body
    document.body.appendChild(a_scene);

    // Timeout to autoplay video (muted of course)
    if (typeof videoSphere != 'undefined') { 
      setTimeout(e => {
        jQuery("video").prop('muted', true);
        var v = document.querySelector('#assetsvideo');
        v.play();
      }, 2000);
    }
    
    // Navigation
    jQuery('#virtour-navigation-button').click(function(){
      jQuery('.infocard').hide();
      jQuery('#vt-navigation').show();
      jQuery('#vt-helper').hide();
      openCloseMenuBar();
    });

    // Helper
    jQuery('#virtour-helper-button').click(function(){
      jQuery('.infocard').hide();
      jQuery('#vt-navigation').hide();
      jQuery('#vt-helper').show();
      openCloseMenuBar();
    });
    
    // Close out
    jQuery('a-scene, a#closeInfoCard, #nav-icon, #vt-helper-gotIt').click(function(){
      jQuery('.infocard').hide();
      jQuery('#vt-navigation').hide();
      jQuery('#vt-helper').hide();
      openCloseVTFunctions();
    });

    // Clicks on certain functions
    jQuery('a#fullScreenButton.fa-expand, a#fullScreenButton.fa-compress').click(function(){
      if (jQuery(this).hasClass('fa-expand') === true) {
        fullScreen();
        jQuery(this).removeClass('fa-expand').addClass('fa-compress');
      }
      else {
        exitFullScreen();
        jQuery(this).removeClass('fa-compress').addClass('fa-expand');
      }
    });

    jQuery('a#videoSphereSound.fa-volume-mute, a#videoSphereSound.fa-volume-up').click(function(){
      if (jQuery(this).hasClass('fa-volume-mute') === true) {
        jQuery("video").prop('muted', false);
        jQuery(this).removeClass('fa-volume-mute').addClass('fa-volume-up');
      }
      else {
        jQuery("video").prop('muted', true);
        jQuery(this).removeClass('fa-volume-up').addClass('fa-volume-mute');
      }
    });
  }
});

$(function() {
  var audioTags = [];

  function stop(audioTag, $audio) {
    audioTag.pause();
    audioTag.currentTime = 0;
    $('.play', $audio).show();
    $('.stop', $audio).hide();
  }

  function stopAll($audio) {
    audioTags.forEach(function(audioTag) {
      stop(audioTag);
    });
  }

  function addListeners(audioTag, $audio) {
    $('.play', $audio).click(function() {
      stopAll($audio);
      $('.play', $audio).hide();
      $('.stop', $audio).show();
      audioTag.play();
      audioTag.addEventListener('ended', function() {
        audioTag.currentTime = 0;
        audioTag.pause();
        $('.play', $audio).show();
        $('.stop', $audio).hide();
      }, false);
    });

    $('.stop', $audio).click(function() {
      stop(audioTag, $audio);
    });
  }

  function getAudioTag(src) {
    var audioTag = document.createElement('audio');
    audioTag.setAttribute('src', src);
    return audioTag;
  }

  $(".speakingGuide").each(function() {
    var audioTag = getAudioTag($(this).data('filename'));
    $audio = $(this);

    $('.play', $audio).show();
    $('.stop', $audio).hide();

    addListeners(audioTag, $audio);
    audioTags.push(audioTag);
    $audio.append(audioTag);
  });
});

function renderMainMenuNavigationTo(arrMainMenuNavigateTo) {
  var mmNavToHTML = '';
  arrMainMenuNavigateTo.forEach(element => {
    //Validate each json
    if ('Name' in element === false) { console.log('ERROR: MainMenu >> NavigationTo has no "Name" in the json (must be exact).'); return false; }
    if ('Imageurl' in element === false) { console.log('ERROR: MainMenu >> NavigationTo has no "Imageurl" in the json (must be exact).'); return false; }
    if ('Url' in element === false) { console.log('ERROR: MainMenu >> NavigationTo has no "Url" in the json (must be exact).'); return false; }
    
    mmNavToHTML += '<a href="' + element.Url + '" class="location" title="Click to navigate to ' + element.Name + '"><img src="' + element.Imageurl + '" alt="Thumbnail of ' + element.Name + '" />' + element.Name + '</a>';
  });
  
  // Add fadeout if more than 3.
  if (arrMainMenuNavigateTo.length > 3) {
    mmNavToHTML += '<div class="fadeout"></div>';
  }

  // Add navigation
  jQuery('body').prepend(`
    <div id="vt-navigation">
      ` + mmNavToHTML + `
    </div>
  `);
}

function renderMainMenuContactUs(mmJsonData) {
  var mmHTML = '';
  try {
    mmHTML += '<a href="' + mmJsonData.Url + '" class="fas fa-envelope">Contact Us</a>'; 
    jQuery('#vt-headerbar .menubar').prepend(mmHTML);    
  } catch (error) {
    console.log('ERROR: MainMenu >> campus gallery has no "Url" in the json (must be exact).');
  }
}

function renderMainMenuCampusGallery(mmJsonData) {
  var mmHTML = '';
  try {
    mmHTML += '<a href="' + mmJsonData.Url + '" class="fas fa-images">Campus Gallery</a>'; 
    jQuery('#vt-headerbar .menubar').prepend(mmHTML);    
  } catch (error) {
    console.log('ERROR: MainMenu >> campus gallery has no "Url" in the json (must be exact).');
  }
}

function renderMainMenuCampusVideo(mmJsonData) {
  var mmHTML = '';
  try {
    mmHTML += '<a href="' + mmJsonData.Url + '" class="fas fa-video">Campus Video</a>'; 
    jQuery('#vt-headerbar .menubar').prepend(mmHTML);    
  } catch (error) {
    console.log('ERROR: MainMenu >> campus gallery has no "Url" in the json (must be exact).');
  }
}


/*
 * HideHelperOverlay
 */
function hideHelperOverlay() {
  jQuery('#vt-helperOverlay').fadeOut(800);
  setTimerForHelperOverlay();
}

/*
 * ShowHelperOverlay
 */
function showHelperOverlay() {
  jQuery('#vt-helperOverlay').fadeIn(1600);
}

/*
 * Timer for Helper Overlay
 */
var idleTimer;
function setTimerForHelperOverlay() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(showHelperOverlay,15*1000);
}
jQuery(document.body).bind('mousemove keydown click',setTimerForHelperOverlay); //space separated events list that we want to monitor
setTimerForHelperOverlay(); // Start the timer when the page loads

/*
 * Center Camera
 */
function centerCamera(camera,vector) {
  //Based on: https://codepen.io/wosevision/pen/JWRMyK
  camera.object3D.lookAt(vector);
  camera.object3D.updateMatrix();    

  //Based on: https://stackoverflow.com/questions/36809207/aframe-threejs-camera-manual-rotation
  var rotation = camera.getAttribute('rotation');
  camera.components['look-controls'].pitchObject.rotation.x = THREE.Math.degToRad(rotation.x);
  camera.components['look-controls'].yawObject.rotation.y = THREE.Math.degToRad(rotation.y);
}


/*
 * GetVector
 */
function getVector(camera,targetObject) {  
  var entityPosition = new THREE.Vector3();
  targetObject.object3D.getWorldPosition(entityPosition);
  
  var cameraPosition = new THREE.Vector3();
  camera.object3D.getWorldPosition(cameraPosition);
  
  //Based on:  https://github.com/supermedium/superframe/blob/master/components/look-at/index.js
  var vector = new THREE.Vector3(entityPosition.x, entityPosition.y, entityPosition.z); 
  vector.subVectors(cameraPosition, vector).add(cameraPosition);
  return vector;
}

/*
 * Full screen
 */
function fullScreen() {
  var docElm = document.documentElement;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  }
  else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  }
  else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  }
  else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  }
}
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// VT Open Close Functions
function openCloseVTFunctions() {
  if (jQuery('.infocard:visible').length === 1) {
    jQuery('div#vt-functions').hide();
  }
  else {
    jQuery('div#vt-functions').show();
  }
}

// menubar
function openCloseMenuBar() {
  if (jQuery('.menubar:visible').length === 1) {
    jQuery('#nav-icon').removeClass('opened');
    jQuery('.menubar').removeClass('opened');
  }
  else {
    jQuery('#nav-icon').addClass('opened');
    jQuery('.menubar').addClass('opened');
  }
}

function calculateDegrees(degrees, limiter) { 
  degrees = parseInt(degrees);
  limiter = parseFloat(limiter);

  // Validation
  if (isNaN(degrees) || isNaN(limiter) || degrees < 0 || degrees > 360) {
    console.log('ERROR: calculateDegrees() > parseInt/parseFloat not valid OR degrees is out of bounds. degrees = ' + degrees );
    return "0 0 0";
  }

  // Validation passed. Proceed.
  var coordinates, x, y = limiter, z, fromX = 0, fromZ = 0, degreeOffset, towardsX = 1, towardsZ = 1;

  if (degrees >= 0 && degrees <= 90) {
    fromZ = -1;
    degreeOffset = degrees - 0;
  }
  else if (degrees > 90 && degrees <= 180) {
    fromX = 1;
    towardsX = -1;
    degreeOffset = degrees - 90;
  }
  else if (degrees > 180 && degrees <= 270) {
    fromZ = 1;
    towardsZ = -1;
    towardsX = -1;
    degreeOffset = degrees - 180;
  }
  else if (degrees > 270 && degrees < 360) {
    towardsZ = -1;
    fromX = -1;
    degreeOffset = degrees - 270;
  }

  x = limiter * (fromX + (towardsX * (degreeOffset / 90)));
  z = limiter * (fromZ - (-towardsZ * (degreeOffset / 90)));

  coordinates = x + " " + y + " " + z;
  return coordinates;
}
