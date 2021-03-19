"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		function: {
			regex: /func(\s+[a-z]\w*)?\s*\([^)]*\)(\s+(?:[^\s{(]+|\([^){]+\)))?/g,
			outline: "function"
		},
		package: {
			regex: /package\s+\S+/gi,
			outline: "namespace",
			children: false
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
			regex: /%%(\S+)%%/,
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
			regex: /%%(\S+)%%/,
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
