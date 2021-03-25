"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		function: {
			regex: /(local\s+)?function\s+([a-zA-Z][a-zA-Z0-9_.]+)\s*\([^)]*\)/g,
			outline: "function",
			depth_delta: 1
		},
		end: {
			regex: /end/,
			depth_delta: -1
		},
		comment_single: {
			regex: /--/g,
			switch_state: "comment_single",
		},
		comment_multi: {
			regex: /--\[\[/g,
			switch_state: "comment_multi"
		}
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
			regex: /\]\]/g,
			switch_state: "default"
		}
	}
}
