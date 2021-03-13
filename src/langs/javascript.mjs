"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		function: {
			regex: /(?:async\s+)?function\s*\*?(\s+[a-zA-Z]\w+)?\s*\([^)]*\)/g,
			outline: "function"
		},
		class: {
			regex: /class\s+([a-zA-Z]\w+)/g,
			group_index: 1,
			outline: "class"
		},
		comment_single: {
			regex: /\/\//g,
			switch_state: "comment_single",
		},
		comment_multi: {
			regex: /\/\*/g,
			switch_state: "comment_multi"
		}
	},
	// Single-line comments
	comment_single: {
		eol: {
			regex: /\n/,
			switch_state: "default"
		}
	},
	// Multi-line comments
	comment_multi: {
		end: {
			regex: /\*\//g,
			switch_state: "default"
		}
	}
}
