'use strict';

function ViewModel(DOMTree, data) {
    this.DOMTree = DOMTree;

    if (!this.DOMTree instanceof HTMLElement) {
        throw new Error('Invalid DOM element');
    }

    this.bindings = {};
    this.bindingsByNodes = {};
    this.data = data || {};
    this.nodesCount = 0;

    this.traverse(this.DOMTree);

}


ViewModel.prototype.traverse = function (elem) {
    var node = elem.firstChild;
    if(!node){
	    return;
    }
    this.scanNode(node);

    while (node) {
        this.traverse(node);
        node = node.nextSibling;
    }

};


ViewModel.prototype.scanNode = function (node) {
    var self = this;
    
    node.modelId = this.nodesCount++;
    
    if(node.nodeType === 3){
        (node.nodeValue.match(/{\$(\w+)}/ig) || []).map(function (elem) {
            return elem.replace(/{\$/, '').replace('}', '');
        }).forEach(function (elem) {
            self.bindings[elem] = new Binding(elem, node, 'nodeValue', node.nodeValue);
        });
        return;
    }
    
    node.attributes.forEach(function (att) {
        att = att.split('=');
        (att[1].match(/{\$(\w+)}/ig) || []).map(function (elem) {
            return elem.replace(/{\$/, '').replace('}', '');
        }).forEach(function (elem) {
            self.bindings[elem] = new Binding(elem, node, att[0], att[1]); 
        });

    });
    
};



ViewModel.prototype.addBinding = function(name, node, accessProperty, value){
	var binding = new Binding(name, node, accessProperty, value); 
	this.bindings[name] = binding;
	//this.
};


ViewModel.prototype.set = function(name, value){
	var i;
	if(typeof name === 'object'){
		for(i in name){
			if(!name.hasOwnProperty(i)){
				continue;
			}
			this.data[i] = name[i];
		}
	} else {
		this.data[name] = value;
	}
	
	this.render();
};


ViewModel.prototype.render = function(){
	var i, node, accessProperty;
	var chengeList = [], forceUpdate;
	
	for(i in this.data){
		if(!this.data.hasOwnProperty(i)){
			continue;
		}
		
		if(this.bindings[i] === undefined){
			continue;
		}
		
		node = this.bindings[i].getNode();
		
		if(this.data[i] !== this.bindings[i].getValue() &&  chengeList.indexOf(node) < 0){
			chengeList.push(node);
		}
		
		
		accessProperty = this.bindings[i].getAccessProperty();
		
		if(this.data[i] !== this.bindings[i].getValue() ){
			this.bindings[i].setValue(this.data[i]);
			if(!chengeList[accessProperty]){
				chengeList[accessProperty] = [];
			}
			chengeList[accessProperty].push(node);
		} else if(chengeList[accessProperty] !== undefined && chengeList[accessProperty].indexOf(node) >= 0){
			this.bindings[i].updateNode();
		}
	}
	
	chengeList.forEach(function(binding){
		
	});
};