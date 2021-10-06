# Virtual Tours for PSU
Virtual Tour for the Penn State commonwealth campuses + more via Aframe

# Getting Started (hard version)
* You can download the project or do a git clone of my project on your website, however the downfall is if you download the files and host them yourself, you will run into version issues and will forfiet any new features.  Git clone is a good option but reguluarly doing an update yourself would be an inconvience.  I recommend just pointing to the files via EASY VERSION.  

# Getting Started (easy version)
* Start up a sites.psu.edu website
* Use Wordpress theme called Genesis.  If you use something else, you would require google tag manager because (as of 6/2/21) Genesis theme allows you to customize the header (head tag) and footer (before the closing body tag).
* Access the admin pages for your newly created wordpress site, hover over Genesis on the left hand side and click "THEME SETTINGS"
* Add the following code to the "Header Script":
```
<script src="https://cdn.jsdelivr.net/npm/jquery@latest/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jquery-ui-dist@latest/jquery-ui.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/NomisGnos/virtual-tour-penn-state@latest/scripts/virtual-tour.js"></script>

<script src="https://cdn.jsdelivr.net/npm/aframe@1.0.4/dist/aframe-master.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/aframe-event-set-component@latest/dist/aframe-event-set-component.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/aframe-html-shader@latest/dist/aframe-html-shader.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/aframe-href-component@latest/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/aframe-look-at-component@latest/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/NomisGnos/virtual-tour-penn-state@latest/scripts/aframe-loading-screen-component.js"></script>
<script src="https://cdn.jsdelivr.net/gh/NomisGnos/virtual-tour-penn-state@latest/scripts/aframe-infocard-component.js"></script>
<script src="https://cdn.jsdelivr.net/gh/NomisGnos/virtual-tour-penn-state@latest/scripts/aframe-autoplay-component.js"></script>
```
* Add the following to the "Footer Scripts"
```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/NomisGnos/virtual-tour-penn-state@latest/css/virtual-tours.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-awesome@latest/css/font-awesome.min.css">
```

# How to generate your own 360 images
Google Street view app [Google Play](https://play.google.com/store/apps/details?id=com.google.android.street&hl=en_US&gl=US) / [iOS App store](https://apps.apple.com/us/app/google-street-view/id904418768)

# How to generate your own 360 videos
Camera MADV 360/GoPro Fusion/GoPro Max. Check with TLT because they may have 360 camcorders/cameras.  
Tripod, sandbags, SD cards recommended

# Generate your own JSON file to create a "Navigate to..."
(needs more instructions) 
You can start by looking at our example https://harrisburg2.vmhost.psu.edu/virtual-tours/harrisburg/configurations.json you can create your own using the same format. There is no limit to how many you can add.
Recommendation: Host your the JSON file on the same site where the virtual tour is located.  Otherwise you will need to deal with CORS policy (as web developer/IT if you are doing this)

# Configure a virtual tour, add hotspots, and navigation
### Configure a virtual tour
* Create a blank page and use this template:
```
<div id="virtualTour"
      data-aframe-videosphere="/hbgvirtualtour/files/2020/10/Biofuels-Lab-Copy-01.mp4"
      data-aframe-videosphere-rotate="0"
      data-aframe-logo="https://harrisburg.psu.edu/sites/harrisburg/files/logos/psu_hbo_rgb_2c_3x_1.png"
      data-aframe-json-configurations="https://harrisburg2.vmhost.psu.edu/virtual-tours/harrisburg/configurations.json"
      data-aframe-homepage="/"
>
<!--see ADD HOTSPOTS and ADD NAVIGATION BUTTON and add your own hotspots and nav items BELOW this and MUST BE BEFORE THE CLOSING DIV --->
</div>
```
* `data-aframe-videosphere` OR `data-aframe-imageSphere` is the location of your video file or image file. Supports full URL or relative url.
* `data-aframe-videosphere-rotate` OR `data-aframe-imageSphere-rotate` starting from 0 and ends with 360 (degrees) where do you want the user to see first when they load. This rotates the world.
* `data-aframe-logo` location of your logo image.  It will do it's best to FIT the image within the desired location but try to use a medium size image (not too large that a user needs to download hours for and not to small that it looks pixellated)
* `data-aframe-json-configurations` location of your JSON file.  See "Generate Your own JSON File to create a 'Navigate to...'" for more info
* `data-aframe-homepage` when you click on the logo, it will lead you to this url (full/relative url)
* Close it with `</div>` see template above.
* IMPORTANT: Before the closing `</div>` you add in your HOTSPOTS and NAVIGATION buttons (see below for more info)

### Add Hotspots (infocard)
* Use this template:
```
<div data-infocard-id="cub" 
     data-infocard-header="Capital Union Building (CUB)" 
     data-infocard-label="Capital Union Building (CUB)" 
     data-infocard-image="/hbgvirtualtour/files/2020/10/cub.jpg"
     data-infocard-audio="https://harrisburg2.vmhost.psu.edu/virtual-tours/harrisburg/audio/CUB.mp3" 
     data-infocard-coordinates="-0.45 0.7 -3.9">
     
<p>Many students unwind, relax and take a break from their studies in the Capital Union Building, or "the CUB." The CUB is home to our pool and fitness center, shown here, as well as our gym and courts for volleyball and racquetball. Student Health Services and offices for intercollegiate athletics, intramural sports and recreation, and a kinesiology lab are also in the CUB.</p>

</div>
```
* `data-infocard-id` unique name of what you want.  Does not display. It does not matter what you put in here as long as it's unique.
* `data-infocard-header` (optional) This is the title that displays when you click on the hotspot
* `data-infocard-label` (optional) This is the label before clicking the hotspot (white text - blue box)
* `data-infocard-image` (optional) This is the image of your hotspot. 
* `data-infocard-audio` (optional) Location of the mp3
* `data-infocard-coordinates` Coordinate X Y Z where the hotspot is located
* Within `<p>` and `</p>` You add in your information.  It supports other HTML tags (links, images) but I don't recommend straying too far off.
* Close it with `</div>` see template above.
* Add as many as you want, just repeat the process and place another infocard after the closing `</div>`

### Add Navigation buttons
* Use this template:
```
<div data-navigateTo-url="/hbgvirtualtour/ziegler-commons/" 
     data-navigateTo-id="ziegler-commons" 
     data-navigateTo-label="6. Ziegler Commons" 
     data-navigateTo-degrees="300">
</div>
```
* `data-navigateTo-url` URL to the next stop
* `data-navigateTo-id` Unique name (does not display any where)
* `data-navigateTo-label` Label before you click the nav item (white text - blue box)
* `data-navigateTo-degrees` In degrees where does it display (0-360)
* Close it with `</div>` see template above.

# Contact
sys106 at psu dot edu

# Words of Wisdom
* This is still a WIP project.  I recommend referencing your site to our assets (i.e., JS and CSS files) because if I make any changes to the project, you WILL get an updated version.  
* Let us know you are using this, forking it, etc.  Together we can make improvements.

# Things to come
* Turn VR back on for google cardboard and oculus/HTC VIVE/etc. with minor adjustments.
* A tool to easily add hotspots, nav items, audio files, 360 videos/images.  The tool that will generate, copy, and paste the necessary code. This would elimiate the use of the AFRAME inspector to get coordinates, figuring out how to generate json data for "Navigate To...", knoweldge to use HTML tags, etc.
* Something else goes here.
