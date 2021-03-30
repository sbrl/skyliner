"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: {
			regex: /[\}]/, depth_delta: -1,
			ends: [
				"function", "fiber",
				"class", "class_method", "class_getter", "class_setter"
			]
		},
		function: {
			regex: /Fn\.new/gi,
			outline: "function"
		},
		fiber: {
			regex: /Fiber\.new/gi,
			outline: "function"
		},
		class: {
			regex: /class\s+([a-z_]\w+(?:\s+is\s+[a-z_]\w*)?)/gi,
			group_index: 1,
			outline: "class"
		},
		class_method: {
			regex: /[a-z_]\w+\s*\([^())]*\)(?=\s*\{)/i,
			parent_type: "class",
			outline: "function"
		},
		class_getter: {
			regex: /[a-z_]\w+=(?=\s*\{)*/i,
			parent_type: "class",
			outline: "property"
		},
		class_setter: {
			regex: /([a-z_]\w+=)\s*\([^)]*\)/i,
			group_index: 1,
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
		// TODO: Add support for nested multiline comments
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
			regex: /'/g,
			switch_state: "default"
		}
	}
}
