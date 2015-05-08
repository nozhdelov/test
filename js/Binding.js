'use strict';

function Binding(name, node, accessProperty, value) {
	this.name = name;
	this.node = node;
	this.accessProperty = accessProperty;
	this.value = value;
	this.originalContent = node.nodeType === 3 ? node.nodeValue : node.getAttribute(this.accessProperty);
	
	this.assignHandlers();
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
	var oldValue = this.value;
	this.value = value;


	if (this.node) {
		this.updateNodes();
	}

};


Binding.prototype.getValue = function () {
	return this.value;
};


Binding.prototype.updateNodes = function () {
	var currentContent = this.node.nodeType === 3 ? this.node.nodeValue : this.node.getAttribute(this.accessProperty);
	var content;
	if(currentContent.indexOf('{$' + this.name + '}') < 0) {
		content = this.originalContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	} else {
		content = currentContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	}

	
	if (this.node.nodeType === 3) {
		this.node.nodeValue = content;
		if(this.node.parentNode && this.node.parentNode.nodeName.toUpperCase() === 'TEXTAREA'){
			this.node.parentNode.value = content;
		}
	} else {
		//this.node.setAttribute(this.accessProperty, this.value);
		this.node[this.accessProperty] = this.value;
	}
};


Binding.prototype.assignHandlers = function(){
	var self = this;
	var nodeName = this.node.nodeName.toUpperCase();

	
	if(this.node.nodeType === 3){ // fucking textarea :(
		if(this.node.parentNode.nodeName === 'TEXTAREA'){
			this.node.parentNode.addEventListener('keyup', function(){
				self.emit('change', {value : self.node.parentNode.value});
			});
		}
		
	} else {
		if(nodeName === 'INPUT'){
			this.node.addEventListener('keyup', function(){
				self.emit('change', {value : self.node.value});
			});
		}
		if(nodeName === 'SELECT'){
			this.node.addEventListener('change', function(){
				self.emit('change', {value : self.node.value});
			});
		}
	}
	
	
};