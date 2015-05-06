'use strict';

function Binding(name, node, accessProperty, value){
    this.name = name;
    this.node = node;
    this.accessProperty = accessProperty;
    this.value = value;
    this.content = node.nodeType === 3 ? node.nodeValue : node.getAttribute(this.accessProperty);
}


Binding.prototype = EventEmiter.prototype;

Binding.prototype.setValue = function(value){
    if(value === this.value){
        return;
    }
    var oldValue = this.value;
    this.value = value;
   
    
    if(this.node){
        this.updateNode();
    }
    
    this.emit('change', {value : this.valie, oldValue : oldValue});
};


Binding.prototype.getValue = function(){
    return this.value;
};


Binding.prototype.updateNode = function(){
     var content = this.content.replace(new Regex('{$' + this.name + '}', 'ig'), this.value);
     if(this.node.nodeType === 3){
        this.node.nodeValue = content;
    } else {
        this.node.setAttribute(this.accessProperty, this.value);
    }
};