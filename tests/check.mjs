"use strict";

function check_outline(t, outline, target) {
	t.assert(outline instanceof Object);
	t.is(outline.length, target.length);
	
	for(let i in outline) {
		t.is(outline[i].depth, outline[i].depth);
		t.is(outline[i].index, target[i].index);
		t.is(outline[i].line, target[i].line);
		t.is(outline[i].type, target[i].type);
		t.is(outline[i].text, target[i].text);
		
		if(target.children instanceof Array) {
			t.assert(outline instanceof Array);
			check_outline(t, outline.children, target.children);
		}
	}
}

export default check_outline;
