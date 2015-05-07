'use strict';

function Binding(name, node, accessProperty, value) {
	this.name = name;
	this.node = node;
	this.accessProperty = accessProperty;
	this.value = value;
	this.originalContent = node.nodeType === 3 ? node.nodeValue : node.getAttribute(this.accessProperty);
}


Binding.prototype = EventEmitter.prototype;



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
	var oldValue = this.value;
	this.value = value;


	if (this.node) {
		this.updateNode();
	}

	this.emit('change', {value: this.valie, oldValue: oldValue});
};


Binding.prototype.getValue = function () {
	return this.value;
};


Binding.prototype.updateNode = function () {
	var currentContent = this.node.nodeType === 3 ? this.node.nodeValue : this.node.getAttribute(this.accessProperty);
	var content;
	if(currentContent.indexOf('{$' + this.name + '}') < 0){
		content = this.originalContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	} else {
		content = currentContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	}

	
	if (this.node.nodeType === 3) {
		this.node.nodeValue = content;
	} else {
		this.node.setAttribute(this.accessProperty, this.value);
	}
};