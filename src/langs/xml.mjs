"use strict";

export default {
	// Default state
	default: {
		processing_instruction: {
			regex: /<\?[^?]+\?>/,
			outline: "function", // It does essentially execute a function on the XML file..... right?,
			children: false
		},
		element_open: {
			regex: /<(\w+)(?:\s+[^\s=]+\s*=\s*(?:"[^"]*?"|'[^"]*?'|[^\s>]+))*\s*>/,
			depth_delta_after: 1,
			group_index: 1, // TODO: Make a more inteelligent system here. Perhaps a function that can be called to process the output into something pretty? Then we could output something like `img.class_name#id`
			outline: "element"
		},
		element_close: {
			regex: /<\/\s*[^>\s]+\s*>/,
			depth_delta: -1
		},
		self_closing: {
			regex: /<(\w+)(?:\s+[^\s=]+\s*=\s*(?:"[^"]*?"|'[^"]*?'|[^\s>]+))*\s*\/>/,
			group_index: 1,
			outline: "element",
		},
		comment_single: {
			regex: /<!--/g,
			switch_state: "comment",
		}
	},
	// Comments
	comment: {
		heading: {
			regex: /%%([^\s%]+)%%/,
			outline: "heading",
			group_index: 1
		},
		end: {
			regex: /-->/,
			switch_state: "default"
		}
	}
}
