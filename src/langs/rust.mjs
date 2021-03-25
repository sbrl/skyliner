"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		function: {
			regex: /((?:(?:extern\s+"[^"]+?"|async|unsafe|pub)\s+)*?fn\s+[a-z]\w+\s*\([^)]*\)(?:\s*->\s*[^{]+)?)\s*/gi,
			group_index: 1,
			outline: "function"
		},
		impl: {
			regex: /impl\s+([a-z]\w+)(\s+for\s+[a-z]\w+)?/gi,
			outline: "class"
		},
		struct: {
			regex: /struct\s+([a-z]\w+)/gi,
			outline: "class"
		},
		trait: {
			regex: /trait\s+([a-z][\w:]+(\s*<[^>]+>)?)(\s+for\s+[a-z]\w+)?/gi,
			outline: "interface"
		},
		mod: {
			regex: /(?:pub\s+)?mod\s+(?:[a-z]+\w+)/i
		},
		comment_single: {
			regex: /\/\//g,
			switch_state: "comment_single",
		},
		comment_multi: {
			regex: /\/\*/g,
			switch_state: "comment_multi"
		},
		string_double: { regex: /"/g, switch_state: "string_double" },
		string_single: { regex: /'/g, switch_state: "string_single" }
	},
	// Single-line comments
	comment_single: {
		heading: {
			regex: /%%([^\s%]+)%%/,
			outline: "heading",
			group_index: 1
		},
		eol: {
			regex: /$/,
			switch_state: "default"
		}
	},
	// Multi-line comments
	comment_multi: {
		heading: {
			regex: /%%([^\s%]+)%%/,
			outline: "heading",
			group_index: 1
		},
		end: {
			regex: /\*\//g,
			switch_state: "default"
		}
	},
	string_double: {
		end: {
			regex: /"/g,
			switch_state: "default"
		}
	},
	string_single: {
		end: {
			regex: /"/g,
			switch_state: "default"
		}
	}
}
