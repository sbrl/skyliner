"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /\{/, depth_delta: 1 },
		brace_close: { regex: /\}/, depth_delta: -1 },
		function: {
			regex: /([a-zA-Z][\w-]+)\s*\(\)/g,
			outline: "function",
			group_index: 1
		},
		function_alt: {
			regex: /function\s+([a-zA-Z][\w-]+)(?:\s*\(\))?/,
			group_index: 1,
			outline: "function"
		},
		comment_single: {
			regex: /#/g,
			switch_state: "comment_single",
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
	},
}
