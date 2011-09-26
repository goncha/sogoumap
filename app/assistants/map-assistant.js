function MapAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

MapAssistant.prototype.setup = function() {
    this.searchInputModel = {};
    this.controller.setupWidget("map-search-input", {
				    modelProperty: "value",
				    textFieldName: "searchInput",
				    hintText: "Input Location"
				}, this.searchInputModel);

    Mojo.Event.listen(this.controller.get("map-current"),
    		      Mojo.Event.tap,
    		      this.handleCurrentButton.bind(this));

    this.centerCurrentPosition({errorCode:0,latitude:39.99226610365429,longitude:116.32591408950312,heading:120});
};

MapAssistant.prototype.activate = function(event) {
    this.controller.serviceRequest("palm://com.palm.location/", {
                                       method: "getCurrentPosition",
                                       parameters: {
					   // subscribe: true,
					   accuracy: 1,
					   maximumAge: 0,
					   responseTime: 1
				       },
                                       onSuccess: this.centerCurrentPosition.bind(this)
                                   });
};

MapAssistant.prototype.deactivate = function(event) {
};

MapAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

MapAssistant.prototype.handleCurrentButton = function(event) {
    this.controller.serviceRequest("palm://com.palm.location/", {
                                   method: "getCurrentPosition",
                                   parameters: {
				       accuracy: 1,
				       maximumAge: 0,
				       responseTime: 1
				   },
                                   onSuccess: this.centerCurrentPosition.bind(this)
                                 });  
};

MapAssistant.prototype.createMap = function(position) {
    var center = new sogou.maps.LatLng(position.latitude, position.longitude);
    var mapNode = this.controller.get("map-canvas");
    var options = {
	zoom: 15,
	center : center,
	mapTypeId: sogou.maps.MapTypeId.ROADMAP,
	mapControl: false
    };
    this.map = new sogou.maps.Map(mapNode, options);
    window.map = this.map;
    // var navIconImg = new sogou.maps.MarkerImage("images/googlemaps.clear.gif",
    // 						new sogou.maps.Size(12,12),
    // 						new sogou.maps.Point(654,26),
    // 						new sogou.maps.Point(6,6),
    // 					       new sogou.maps.Size(12,12));
    this.map.navMarker = new sogou.maps.Marker({disableLabel: true,
						draggable: false,
						// icon: navIconImg,
						icon: "images/heading.png",
						map: this.map,
						position: center});
};

MapAssistant.prototype.centerCurrentPosition = function(position) {
   Mojo.Log.info("SogouMap GPS position: %j", position);
    if (position.errorCode == 0) {
	if (!this.map) {
	    this.createMap(position);
	}

	if (!this.map.navMarkerImg && this.map.navMarker.container.childNodes.length == 0) {
	    this.centerCurrentPosition.bind(this).delay(1, position);
	} else {
	    if (!this.map.navMarkerImg) {
	    	// var images = this.map.navMarker.container.childNodes;
	    	// images[0].childNodes[0].style.background = "url(\"images/googlemaps.png\") no-repeat -654px -26px";
	    	// images[0].childNodes[0].style.left = "";
	    	// images[0].childNodes[0].style.top = "";
	    	// images[0].style.display = "inline-block";
	    	// images[1].childNodes[0].style.background = "url(\"images/googlemaps.png\") no-repeat -666px -26px";
	    	// images[1].childNodes[0].style.left = "";
	    	// images[1].childNodes[0].style.top = "";
	    	// images[1].childNodes[0].style.opacity = 1.0;
	    	// images[1].style.display = "none";
	    	
		
	    	// this.map.navMarker.flash = function () {
	    	//     var images = this.container.childNodes;
	    	//     var fd = images[0].style.display;
	    	//     images[0].style.display = images[1].style.display;
	    	//     images[1].style.display = fd;
	    	//     this.flash.bind(this).delay(1);
	    	// };
	    	// this.map.navMarker.flashable = true;
	    	// this.map.navMarker.flash();
		
		this.map.navMarkerImg = this.map.navMarker.container.childNodes[0].childNodes[0];
	    }
	    var center = new sogou.maps.LatLng(position.latitude, position.longitude);
	    this.map.navMarker.setPosition(center);
	    this.map.navMarkerImg.style.webkitTransform = "rotate(" + position.heading +"deg)";
	    this.map.setCenter(center);
	}
    }
};
