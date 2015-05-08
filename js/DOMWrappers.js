'use strict';

function DOMWrapperBase(element, modelId){
	if (!element instanceof HTMLElement) {
		throw new Error('Invalid DOM element');
	}
	
	
	this.element = element;
	this.modelId = modelId;
	
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
		this.element.getAttribute(attribute, value);
	}
};






function DOMWrapperInput(element, modelId){
	DOMWrapperBase.call(this, element, modelId);
	var self = this;
	this.element.addEventListener('keyup', function(){
		self.emit('update', {value : self.element.value});
	});
}
DOMWrapperInput.prototype = DOMWrapperBase.prototype;


function DOMWrapperSelect(element, modelId){
	DOMWrapperBase.apply(this, [element, modelId]);
	var self = this;
	this.element.addEventListener('change', function(){
		self.emit('update', {value : self.element.value});
	});
}

DOMWrapperSelect.prototype = DOMWrapperBase.prototype;



function DOMWrapperTextNode(element, modelId){
	DOMWrapperBase.apply(this, [element, modelId]);
	var self = this;
	if(this.element.parentNode.nodeName.toUpperCase() === 'TEXTAREA'){
		this.element.parentNode.addEventListener('keyup', function(){
			self.emit('update', {value : self.element.parentNode.value});
		});
	}
}

DOMWrapperTextNode.prototype = DOMWrapperBase.prototype;


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
