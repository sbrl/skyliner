"use strict";

export default function(outline, depth = 0) {
	let result = [];
	
	for(let item of outline) {
		result.push(`\t`.repeat(depth));
		result.push(`+ ${item.line}:${item.index} ${item.text}\n`);
		if(item.children instanceof Array)
			result.push(this.render(item.children, depth + 1));
	}
	return result.join("");
}
