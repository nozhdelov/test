'use strict';

function DOMWrapperBase(element, modelId){
	if (element instanceof HTMLElement) {
		this.element = element;
		
	}
	this.modelId = modelId;
	this.attributeValues = {};
	
}

DOMWrapperBase.prototype = new EventEmitter();

DOMWrapperBase.prototype.DOMEvents = ['click', 'mousemove', 'mousedown', 'mouseup', 'keydown', 'keypress', 'keyup', 'keydown', 'change'];

DOMWrapperBase.prototype.setElement = function(element){
	this.element = element;
};

DOMWrapperBase.prototype.getElement = function(){
	return this.element;
};

DOMWrapperBase.prototype.on = function(event, handler){
	if(this.DOMEvents.indexOf(event) >= 0){
		this.element.addEventListener(event, handler, false);
	} else {
		EventEmitter.prototype.on.call(this, event, handler);
	}
};


DOMWrapperBase.prototype.getAttribute = function(attribute){
	if(attribute === 'value' || attribute === 'nodeValue'){
		return this.element[attribute];
	} else {
		return this.element.getAttribute(attribute);
	}
};


DOMWrapperBase.prototype.setAttribute = function(attribute, value){
	if(attribute === 'value' || attribute === 'nodeValue'){
		this.element[attribute] = value;
	} else {
		this.element.setAttribute(attribute, value);
	}
};



DOMWrapperBase.prototype.getElementType = function(){
	return this.elment.nodeType;
};






function DOMWrapperInput(element, modelId){
	this.element = element;
	this.modelId = modelId;
	var self = this;
	this.element.addEventListener('keyup', function(){
		self.emit('update', {value : self.element.value});
	});
}
DOMWrapperInput.prototype = new DOMWrapperBase();


function DOMWrapperSelect(element, modelId){
	this.element = element;
	this.modelId = modelId;
	var self = this;
	this.element.addEventListener('change', function(){
		self.emit('update', {value : self.element.value});
	});
}

DOMWrapperSelect.prototype = new DOMWrapperBase();



function DOMWrapperTextNode(element, modelId){
	this.element = element;
	this.modelId = modelId;
	var self = this;
	if(this.element.parentNode && this.element.parentNode.nodeName.toUpperCase() === 'TEXTAREA'){
		this.element.parentNode.addEventListener('keyup', function(){
			self.emit('update', {value : self.element.parentNode.value});
		});
	}
}

DOMWrapperTextNode.prototype = new DOMWrapperBase();


DOMWrapperTextNode.prototype.setAttribute = function(attribute, value){
	if(attribute === 'value' || attribute === 'nodeValue'){
		this.element[attribute] = value;
	} else {
		this.element.getAttribute(attribute, value);
	}
	if(this.element.parentNode.nodeName.toUpperCase() === 'TEXTAREA'){
		this.element.parentNode.value = value;
	}
};



function DOMWrapperFactory(){}

DOMWrapperFactory.create = function(node, modelId){
	var name = node.nodeName.toUpperCase();
	if(node.nodeType === 3){
		return new DOMWrapperTextNode(node, modelId);
	} else {
		switch(name){
			case 'INPUT' : 
				return new DOMWrapperInput(node, modelId);
			break;
			
			case 'SELECT' :
				return new DOMWrapperSelect(node, modelId);
			break;
			
			default :
				return new DOMWrapperBase(node, modelId);
			break;
		}
	}
};
