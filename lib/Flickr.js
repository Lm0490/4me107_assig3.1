//-------------------------------------------------------
//  Public class
//-------------------------------------------------------

/**
 *  This is the beginning of a JavaScript-based interface 
 *	(class) to communicate with Flickr's API.
 *
 *  @author     Henrik Andersen <henrik.andersen@lnu.se>
 *  @copyright  Copyright (c) 2013.
 *  @license    Creative Commons (BY-NC-SA)
 *  @version    1.0.
 *  @since      2013-11-11
 */
function Flickr(APIKey) {

	//---------------------------------------------------
	//  Private properties
	//---------------------------------------------------
	
	/**
	 *	API key to gain access to Flickr's API. The 
	 *	object uses a standard key if no value is 
	 *	specified at instantiation. Every Flicker 
	 *	API-based application needs its own API key.
	 *
	 *	@default {String} "b427025ca7fe41bff1a85a05e1f0206e"
	 */
	var _APIKey = APIKey || "b427025ca7fe41bff1a85a05e1f0206e";

	//---------------------------------------------------
	//  Public static methods
	//---------------------------------------------------

	/**
	 *	Search for images in Flickr's database.
	 *
	 *	@param	{Object}	Search object.
	 *	@param	{Function}	Callback function.
	 *
	 *	@return {undefined}
	 */
	Flickr.prototype.search = function(object, callback) {
		var query = buildQueryString("flickr.photos.search", object);
		$.getJSON(query, function(responseData) {
			callback(responseData);
		});
	};

	/**
	 *	Retrieves geographic information about a Flickr 
	 *	image. The call is the based on the image ID.
	 *
	 *	@param	{int}		Image id.
	 *	@param	{Function}	Callback function.
	 *
	 *	@return {undefined}
	 */
	Flickr.prototype.getLocation = function(id, callback) {
		var object = {photo_id: id};
		var query  = buildQueryString("flickr.photos.geo.getLocation", object);
		$.getJSON(query, function(responseData) {
			callback(responseData);
		});
	};

	//---------------------------------------------------
	//  Private methods
	//---------------------------------------------------

	/**
	 *	This method compiles an API string to communicate 
	 *	with Flickr's REST API.
	 *
	 *	@param	{String}	String identifying the API method to be used.
	 *	@param	{Object}	Call parameters.
	 *
	 *	@return {String}
	 */
	function buildQueryString(method, arguments) {
		var URL  = "http://www.flickr.com/services/rest/?method="+method+"&api_key="+_APIKey+"&format=json&jsoncallback=?";
		for (var property in arguments) {
			URL += "&"+property+"="+arguments[property];
		}

		return URL;
	}
}