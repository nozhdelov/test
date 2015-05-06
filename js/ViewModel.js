'use strict';

function ViewModel(DOMTree) {
    this.DOMTree = DOMTree;

    if (!this.DOMTree instanceof HTMLElement) {
        throw new Error('Invalid DOM element');
    }

    this.bindings = {};

    this.traverse(this.DOMTree);

}


ViewModel.prototype.traverse = function (elem) {
    var node = elem.firstChild;
    this.scanNode(node);

    while (node) {
        this.traverse(node);
        node = node.nextSibling;
    }

};


ViewModel.prototype.scanNode = function (node) {
    var self = this;
    
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



ViewModel.prototype.set = function(name, value){
    if(this.bindings[name]){
        this.bindings[name].value = value;
       // this.bindings[name].node.[this.bindings[name].accessProperty]
    }
};