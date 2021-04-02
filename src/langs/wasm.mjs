"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /\(/, depth_delta: 1 },
		brace_close: {
			regex: /\)/, depth_delta: -1,
			ends: [ "module", "function" ]
		},
		module: {
			regex: /\(\s*(module)/,
			depth_delta_after: 1,
			group_index: 1,
			outline: "namespace"
		},
		function: {
			regex: /\(\s*(func\s+(?:(?:\$[a-z_]\w*\s+)?\((?:param|result|local|export)\s+[^)]+\)\s*)*)/gi,
			outline: "function",
			depth_delta_after: 1
		},
		comment_single: {
			regex: /;;/g,
			switch_state: "comment_single",
		},
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
}
