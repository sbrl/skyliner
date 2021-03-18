"use strict";

export default {
	// Default state
	default: {
		// TODO: Figure out how to dynamically adjust the depth here
		table: {
			regex: /\[([^\[\]]+)\]/,
			group_index: 1,
			outline: "object",
			depth_set: 1
		},
		property: {
			regex: /([^;#\s]+)\s*=/,
			group_index: 1,
			outline: "property",
			depth_set: 2
		},
		comment_single: {
			regex: /[#;]|--/,
			switch_state: "comment_single"
		}
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
}
