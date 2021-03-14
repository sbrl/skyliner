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
		class_function: {
			regex: /(?:async\s+)?[a-zA-Z]\w+\s*\([^())]*\)(?=\s*\{)/,
			parent_type: "class",
			outline: "function"
		},
		class_property: {
			regex: /(?:get|set)\s+[a-zA-Z]\w+\s*\([^)]*\)/,
			parent_type: "class",
			outline: "property"
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
		string_single: { regex: /'/g, switch_state: "string_single" },
		string_backtick: { regex: /`/g, switch_state: "string_backtick" }
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
	},
	string_backtick: {
		end: {
			regex: /`/g,
			switch_state: "default"
		}
	}
}
