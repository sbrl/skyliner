"use strict";

function outline_render_text(outline, depth = 0) {
	let result = [];
	
	for(let item of outline) {
		result.push(`\t`.repeat(depth));
		result.push(`${item.line}:${item.index} ${item.text}\n`);
		if(item.children instanceof Array)
			result.push(outline_render_text(item.children, depth + 1));
	}
	return result.join("");
}

export default outline_render_text
