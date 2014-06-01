/**
 *	Class that handles the site's weather widget. The 
 *	widget is based on predefined DOM elements 
 *	contained in the page's HTML structure.
 *
 *	@author		Henrik Andersen <henrik.andersen@lnu.se>
 *	@copyright	Copyright (c) 2013.
 *	@license	Creative Commons (BY-NC-SA)
 *	@version	1.0.
 *	@since		2013-11-11
 */
function WeatherWidget() {

	//---------------------------------------------------
	//	Private properties
	//---------------------------------------------------

	/**
	 *	Referns to the predefined DOM element that 
	 *	encloses the widget. The application will get 
	 *	runtime errors if this element can not be found 
	 *	in the HTML structure.
	 *
	 *	@default {HotelWidgetResult}
	 */
	var _forecastWrapper = document.getElementById("page-left-weather-forecast-wrapper");

	/**
	 *	List containing the forecast objects 
	 *	(WeatherWidgetResult). This property is useful 
	 *	for deallocation.
	 *
	 *	@default {Array}
	 */
	var _forecasts = [];

	//---------------------------------------------------
	//	Private methods
	//---------------------------------------------------

	/**
	 *	This method serves as a constructor and activates 
	 *	all components to be activated during class 
	 *	initialization.
	 *
	 *	@return {undefined}
	 */
	function init() {
		initServiceCall();
	}

	/**
	 *	Method that retrieves the weather forecast in 
	 *	jsonp format. The method uses jQuery to make 
	 *	the ajax call to the server. jQuery is used 
	 *	primarily (in this project) to improve web 
	 *	compatibility.
	 *
	 *	@return {undefined}
	 */
	function initServiceCall() {
		$.ajax({
			url: "http://api.wunderground.com/api/a679a6412c05d468/forecast/q/Sweden/Kronoberg.json",
			dataType : "jsonp", 
			success: onServiceCallComplete
		});
	}

	/**
	 *	This method handles obtained weather data. The 
	 *	data is iterated and transformed into graphical 
	 *	representations in the form of 
	 *	WeatherWidgetResult-objects. Each object is 
	 *	added to the DOM structure to be rendered by the 
	 *	browser. All objects are stored in a list, in 
	 *	order to avoid memory leaks. Since all memory 
	 *	references are listed, it is easy to deallocate 
	 *	memory when needed.
	 *
	 *	@param	{JSON}	Weather data in JSON format.
	 *
	 *	@return {undefined}
	 */
	function onServiceCallComplete(data) {
		data = data.forecast.txt_forecast.forecastday;
		for (var i = 0; i < data.length; i += 2) { // +2 Are used to avoid printing of night weather.
			var forecast = new WeatherWidgetResult(data[i].title, data[i].icon_url, data[i].fcttext_metric);
			_forecasts.push(forecast);
			_forecastWrapper.appendChild(forecast.element);
		}
	}

	init();
}