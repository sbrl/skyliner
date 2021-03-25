"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		function: {
			regex: /^(?:\w[^()]*)\s*\([^)]*\)(\s*[^{}]*[^{}\s])?/,
			outline: "function",
			parent_type: null,
			children: false
		},
		class: {
			regex: /class\s+([a-zA-Z]\w*)/g,
			group_index: 1,
			outline: "class"
		},
		class_access: {
			regex: /^\s*(public|private|protected):\s*$/,
			outline: "header",
			parent_type: "class"
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
	}
}
