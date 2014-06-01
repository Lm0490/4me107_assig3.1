/**
 *	This is a dynamic class used to represent a forecast. 
 *	A forecast consists of a day-string, icon and 
 *	description-string.
 *
 *	@author		Henrik Andersen <henrik.andersen@lnu.se>
 *	@copyright	Copyright (c) 2013.
 *	@license	Creative Commons (BY-NC-SA)
 *	@version	1.0.
 *	@since		2013-11-11
 */
function WeatherWidgetResult(day, icon, description) {

	//---------------------------------------------------
	//	Public properties
	//---------------------------------------------------

	/**
	 *	Public property that contains a reference to the 
	 *	object's graphical representation. The graphical 
	 *	representation consists of an ordinary DOM 
	 *	elements (DIV).
	 *
	 *	@default {null}
	 */
	this.element = null;

	//---------------------------------------------------
	//	Private properties
	//---------------------------------------------------

	/**
	 *	
 	 *	Private reference used to reference the object 
 	 *	instance when the internal scope ine is available. 
 	 *	For example, this property can be used to access 
 	 *	the public properties and methods from private 
 	 *	class methods.
	 *
	 *	@default {null}
	 */
	var _this = this;

	/**
	 *	Reference to the DOM element used to display the 
	 *	day of the forecast.
	 *
	 *	@default {null}
	 */
	var _elmDay;

	/**
	 *	Reference to DOM element used to display the icon 
	 *	of the forecast.
	 *
	 *	@default {null}
	 */
	var _elmIcon;

	/**
	 *	Reference to DOM element used to display the 
	 *	description of the forecast.
	 *
	 *	@default {null}
	 */
	var _elmDescription;

	//---------------------------------------------------
	//	Private methods
	//---------------------------------------------------

	/**
	 *	This method serves as a constructor.
	 *
	 *	@return {undefined}
	 */
	function init() {
		initElement();
		initDay();
		initIcon();
		initDescription();
	}

	/**
	 *	This method creates the element which encloses the 
	 *	forecast instance. 
	 *
	 *	@TODO: The element type and name should 
	 *	be standardized through private constants
	 *
	 *	@return {undefined}
	 */
	function initElement() {
		_this.element = document.createElement("div");
		_this.element.setAttribute("class", "page-left-weather-forecast-day-wrapper");
	}

	/**
	 *	...
	 *
	 *	@return {undefined}
	 */
	function initDay() {
		_elmDay = document.createElement("h3");
		_elmDay.innerHTML = formatDay(day);
		_this.element.appendChild(_elmDay);
	}

	/**
	 *	This method creates icons for the forecast. 
	 *
	 *	@return {undefined}
	 */
	function initIcon() {
		_elmIcon = document.createElement("img");
		_elmIcon.setAttribute("src", icon);
		_this.element.appendChild(_elmIcon);
	}

	/**
	 *	This method creates descrptions for the forecast.
	 *
	 *	@return {undefined}
	 */
	function initDescription() {
		_elmDescription = document.createElement("p");
		_elmDescription.innerHTML = description;
		_this.element.appendChild(_elmDescription);
	}

	/**
	 *	This method converts a day string to a short 
	 *	string of three letters.
	 *
	 *	@param	{String}	The day-string to be converted.
	 *
	 *	@return {String}
	 */
	function formatDay(day) {
		result = "";
		switch (day.toUpperCase()) {
			case "MONDAY":
				 result = "Mon";
				 break;

			case "TUESDAY":
				 result = "Tue";
				 break;

			case "WEDNESDAY":
				 result = "Wed";
				 break;

			case "THURSDAY":
				 result = "Thu";
				 break;

			case "FRIDAY":
				 result = "Fri";
				 break;

			case "SATURDAY":
				 result = "Sat";
				 break;

			case "SUNDAY":
				 result = "Sun";
				 break;
		}

		return result;
	}

	init();
}