'use strict';

function Binding(name, node, accessProperty, value) {
	this.name = name;
	this.node = node;
	this.accessProperty = accessProperty;
	this.value = value;
	this.originalContent = node.nodeType === 3 ? node.nodeValue : node.getAttribute(this.accessProperty);
	
	
}


Binding.prototype = EventEmitter.prototype;


Binding.prototype.getName = function(){
	return this.name;
};


Binding.prototype.getNode = function(){
	return this.node;
};


Binding.prototype.getAccessProperty = function(){
	return this.accessProperty;
};



Binding.prototype.setValue = function (value) {
	if (value === this.value) {
		//return;
	}
	this.value = value;

	this.updateNodes();
	

};


Binding.prototype.getValue = function () {
	return this.value;
};


Binding.prototype.updateNodes = function () {
	var currentContent = this.node.getAttribute(this.accessProperty);
	var content;
	if(currentContent.indexOf('{$' + this.name + '}') < 0) {
		content = this.originalContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	} else {
		content = currentContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	}

console.log(content);
	this.node.setAttribute(this.accessProperty, content);
	
};


