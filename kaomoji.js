"use strict"

var _ = require('lodash');

class Kaomoji {
	constructor(parts){
		this.parts = parts;
	}
	toString(){
		return this.render();
	}
	render(){
		var parts = this.parts
		var normalized = {
			outerLeft: '',
			left: '',
			innerLeft: '',
			middle: '',
			innerRight: '',
			right: '',
			outerRight: ''
		};

		normalized.middle = parts.mouth.content.value;
		normalized.left = parts.cheeks.content.left;
		normalized.right = parts.cheeks.content.right;

		_.each(parts.arms.content, function(arm,position){
			if(position == 'left'){
				if(parts.arms.meta.isLeftInner){
					normalized.innerLeft = arm
				}else{
					normalized.outerLeft = arm
				}
			}else{
				if(parts.arms.meta.isRightInner){
					normalized.innerRight = arm
				}else{
					normalized.outerRight = arm
				}
			}
		});

		var leftEye = parts.eyes.content.left 
		var rightEye = parts.eyes.content.right 

		normalized.innerLeft += leftEye;
		normalized.innerRight += rightEye + normalized.innerRight;

		var template = _.template('<%=outerLeft%><%=left%><%=innerLeft%><%=middle%><%=innerRight%><%=right%><%=outerRight%>')
		var str = template(normalized);
		return str;

	}
}

module.exports = Kaomoji;