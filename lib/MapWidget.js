/**
 *	This class handles the communication between Google 
 *	Maps API and the Flickr API. This class still needs 
 *	more work, but it's an ok start.
 *
 *	@author		Henrik Andersen <henrik.andersen@lnu.se>
 *	@copyright	Copyright (c) 2013.
 *	@license	Creative Commons (BY-NC-SA)
 *	@version	1.0.
 *	@since		2013-11-11
 */
function MapWidget() {

	//---------------------------------------------------
	//	Private properties
	//---------------------------------------------------

	/**
	 *	Reference to Google Maps object.
	 *
	 *	@default {google.maps.Map}
	 */
	var _map;

	/**
	 *	Reference to the DOM element that the Google Map 
	 *	is presented in.
	 *
	 *	@default {DOMElement}
	 */
	var _mapElement = document.getElementById("page-middle-map-wrapper");

	/**
	 *	Reference to a JavaScript-based interface for the 
	 *	Flickr's API.
	 *
	 *	@default {Flickr}
	 */
	var _flickr = new Flickr();

	//---------------------------------------------------
	//	Private constants
	//---------------------------------------------------

	/**
	 *	The default zoom value for the Google Maps 
	 *	object.
	 *
	 *	@default {number} 12
	 */
	var DEFAULT_MAP_ZOOM = 12;

	/**
	 *	Google map's default position in latitude.
	 *
	 *	@default {number} 56.8770413
	 */
	var DEFAULT_MAP_LAT = 56.8770413;

	/**
	 *	Google map's default position in longitude.
	 *
	 *	@default {number} 14.8092744
	 */
	var DEFAULT_MAP_LNG = 14.8092744;

	//---------------------------------------------------
	//	Private methods
	//---------------------------------------------------

	/**
	 *	The class constructor.
	 *
	 *	@return {undefined}
	 */
	function init() {
		initMap();
		initFlickr();
	}

	/**
	 *	Creates and initializes the map object.
	 *
	 *	@return {undefined}
	 */
	function initMap() {
		_map = new google.maps.Map(_mapElement, getDefaultMapSettings());
		_map.setCenter(new google.maps.LatLng(DEFAULT_MAP_LAT, DEFAULT_MAP_LNG));
	}

	/**
	 *	This method is meant to set the map settings.
	 *
	 *	@return {Object}
	 */
	function getDefaultMapSettings() {
		return {
			zoom: DEFAULT_MAP_ZOOM,
			MapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};
	}

	/**
	 *	This method uses the Flickr object to search for 
	 *	images with "växjö" in its title. The search tries 
	 *	to find 100 pictures that can be presented on the 
	 *	map.
	 *
	 *	@return {undefined}
	 */
	function initFlickr() {
		arguments = {
			text: "växjö",
			per_page: 100,
			has_geo: true
		}

		_flickr.search(arguments, onFlickerSearchComplete);
	}

	/**
	 *	This method is activated when the Flickr search is 
	 *	completed. The method iterates the results and presents 
	 *	as many pictures as possible. JQuery is used only to 
	 *	simplify reference management during the iteration. 
	 *	The this- and i-variable will change during iteration.
	 *
	 *	@param	{String}	The search result.
	 *
	 *	@return {undefined}
	 */
	function onFlickerSearchComplete(data) {
		$.each(data.photos.photo, function(i, item) {
			_flickr.getLocation(item.id, function(response) {
				appendToMap(item, response);
			});
		});
	}

	/**
	 *	This method is responsible for placing the markers on 
	 *	the map. Each marker is connected to a photo from 
	 *	Flickr's API. This method is a typical example of the 
	 *	method that is responsible for more than it should. 
	 *	The abstraction level is completely wrong and the 
	 *	method should be rewritten.
	 *
	 *	@param	Object 	Object containing information about a Flickr image.
	 *	@param 	Object 	Object containing information about a Flickr image's geographic position.
	 *
	 *	@return {undefined}
	 */
	function appendToMap(item, geoInfo) {
		var infoWindow = new google.maps.InfoWindow();
		var marker = new google.maps.Marker({
			map: _map,
			position: new google.maps.LatLng(geoInfo.photo.location.latitude, geoInfo.photo.location.longitude),
			title: item.title
		});

		var wrapper = document.createElement("div");
		var image   = document.createElement("img");
			image.src = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_q.jpg";

		wrapper.appendChild(image);

		google.maps.event.addListener(marker, 'click', function(event) {
			infoWindow.setContent(wrapper.innerHTML);
			infoWindow.open(_map, marker);
			_map.setCenter(marker.getPosition());
		});
	}

	init();
}