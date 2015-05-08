'use strict';

function Binding(name, node, accessProperty, value) {
	this.name = name;
	this.node = node;
	this.accessProperty = accessProperty;
	this.value = value;
	this.originalContent = node.nodeType === 3 ? node.nodeValue : node.getAttribute(this.accessProperty);
	
	
	var self = this;
	this.node.on('update', function(data){
		//self.emit('chenge', data);
	});
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



Binding.prototype.setValue = function (value) {console.log(value);
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
	var currentContent = this.node.getAttribute(this.accessProperty);
	var content;
	if(currentContent.indexOf('{$' + this.name + '}') < 0) {
		content = this.originalContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	} else {
		content = currentContent.replace(new RegExp('{\\$' + this.name + '}', 'ig'), this.value);
	}

	
	this.node.setAttribute(this.accessProperty, content);
	return;
	
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


