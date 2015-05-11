'use strict';


function ControlTagLoop(node, data){
	this.sourceKey = node.getAttribute('source');
	this.source = Utils.getNestedValue(this.sourceKey, data);
	this.data = data;;
	this.node = node;
}

ControlTagLoop.prototype.execute = function(){
	var i, content, newContent = '', newNode;
	var value = this.node.getAttribute('value');
	var regx = new RegExp('\\$' + value, 'ig');
	
	content = this.node.innerHTML;
	
	if(this.source.length){
		for(i = 0; i < this.source.length; i++){
			newContent += content.replace(regx, '$' + this.sourceKey +  '.' + i);
		}
	}
	

	newNode = document.createElement('template');
	newNode.innerHTML = newContent;
	this.node.parentNode.insertBefore(newNode.content, this.node);
	this.node.parentNode.removeChild(this.node);
	
};









function ControlTagFactory(){}

ControlTagFactory.tags = ['LOOP', 'IF', 'ELSE'];

ControlTagFactory.create = function(node, data){
	
	var name = node.nodeName.toUpperCase();
	switch (name){
		case 'LOOP' : 
			return new ControlTagLoop(node, data);
		break;
		case 'IF' : 
			return new ControlTagIf(node, data);
		break;
		case 'ELSE' : 
			return new ControlTagElse(node, data);
		break;
	}
};