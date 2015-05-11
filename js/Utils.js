'use strict';

var Utils = {};

Utils.getNestedValue = function(key, struct){
	var parts = key.split("."), i;
	var value;
	
	value = struct;
	for(i = 0; i < parts.length; i++){
		value = value[parts[i]];
	}
	return value;
};


Utils.isArray = function(arr){
	if (Array.isArray) {
		return Array.isArray(arr);
	} else {
		return Object.prototype.toString.call(arr) === '[object Array]';
	}
 
};