'use strict';

function ViewModel(DOMTree, data) {
	var self = this;
	this.DOMTree = DOMTree;
	
	if (!this.DOMTree instanceof HTMLElement) {
		throw new Error('Invalid DOM element');
	}

	this.bindings = {};
	this.bindingsByNodes = {};
	this.data = data || {};
	this.nodesCount = 0;
	
	this.traverse(this.DOMTree, function(node){
		self.scanForContorlTags(node);
	});

	this.traverse(this.DOMTree, function(node){
		self.scanNode(node);
	});
	
	this.render();
}





ViewModel.prototype.traverse = function (node, callback) {
	//var node = elem.firstChild;//? elem.firstChild : elem.nextSibling;
	if (node) {
		callback(node);
	}
	node = node.firstChild;
	
	if(!node){
		return;
	}
	
	//callback(node);

	while (node) {
		this.traverse(node, callback);
		node = node.nextSibling;
	}

};


ViewModel.prototype.scanNode = function (node) {
	var self = this, i, attName, attValue;

	if (node.nodeType === 3) {
		(node.nodeValue.match(/{\$(\w+((.|)\w+(.|)|)\w+)}/ig) || []).map(function (elem) {
			return elem.replace(/{\$/, '').replace('}', '');
		}).forEach(function (elem) {
			self.addBinding(elem, node, 'nodeValue', node.nodeValue);
		});
		return;
	}
	
	
	
	for(i = 0; i < node.attributes.length; i++){
		attValue = node.attributes[i].value;
		attName = node.attributes[i].nodeName;
	
		
		(attValue.match(/{\$(\w+((.|)\w+(.|)|)\w+)}/ig) || []).map(function (elem) {
			return elem.replace(/{\$/, '').replace('}', '');
		}).forEach(function (elem) {
			self.addBinding(elem, node, attName, attValue);
		});

	}

};


ViewModel.prototype.scanForContorlTags = function(node){
	var self = this;
	var name = node.nodeName.toUpperCase();
	if(ControlTagFactory.tags.indexOf(name) >= 0){
		ControlTagFactory.create(node, this.data).execute();
	}
	
};


ViewModel.prototype.addBinding = function (name, node, accessProperty, value) {
	var binding;
	var self = this;
	var modelId = 'node_' + this.nodesCount++;
	
	node = DOMWrapperFactory.create(node, modelId);
	binding = new Binding(name, node, accessProperty, value);;
	
	
	node.on('update', function(data){
		self.setValue(name, data.value);
	});
	
	
	if(!this.bindings[name]){
		this.bindings[name] = [];
	}
	if (!this.bindingsByNodes[node.modelId]) {
		this.bindingsByNodes[node.modelId] = [];
	}
	this.bindings[name].push(binding);
	this.bindingsByNodes[node.modelId].push(binding);
};


ViewModel.prototype.setValue = function (name, value) {
	var i;
	this.data[name] = value;
	
	this.render();
};

ViewModel.prototype.setData = function (data) {
	var i;
	if (typeof data !== 'object') {
		return;
	}
	for (i in data) {
		if (!data.hasOwnProperty(i)) {
			continue;
		}
		this.data[i] = data[i];
	}
	this.render();
};


ViewModel.prototype.render = function () {
	var i, node, accessProperty;
	var self = this;
	var chengeList = [], changeKey;

	
	var executeData = function(key, data){
		var i, value;
		if(Utils.isArray(data)){
			data.forEach(function(elem, idx){
				var k = key + '.' + idx;
				executeData(k, elem);
			});
		} else if(data && typeof data === 'object') {
			Object.keys(data).forEach(function(elem, idx){
				var k = key + '.'  + elem;
				executeData(k, data[elem]);
			});
		} else {
			if (self.bindings[key] === undefined) {
				return;
			}	
			
			value = Utils.getNestedValue(key, self.data);
			
			self.bindings[key].forEach(function(binding){
				node = binding.getNode();
				accessProperty = binding.getAccessProperty();
				changeKey = node.modelId + '_' + accessProperty;
				
				if (self.data[key] !== binding.getValue() && chengeList.indexOf(changeKey) < 0) {
					chengeList.push(changeKey);
					self.bindingsByNodes[node.modelId].forEach(function (binding) {
						
						if (binding.getAccessProperty() === accessProperty) {
							binding.setValue(value);
						}
					});
				}
			});
		}
	};

	for (i in this.data) {
		if (!this.data.hasOwnProperty(i)) {
			continue;
		}

		executeData(i, this.data[i]);
		

	}

};