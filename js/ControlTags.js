'use strict';


function ControlTagLoop(node, data){
	this.source = Utils.getNestedValue(node.source);
	this.node = node;
}

ControlTagLoop.prototype.execute = function(node){
	var i, content, newContent = '', newNode;
	content = this.node.innerHTML;
	if(this.source.length){
		for(i = 0; i < this.soruce.length; i++){
			newContent += content.replace('$' + this.node.value, '$' + this.node.source[i]);
		}
	}
	
	newNode = document.createTextNode(newContent);
	
};