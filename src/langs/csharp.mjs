"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		namespace: {
			regex: /namespace\s+(\S+)/,
			group_index: 1,
			outline: "namespace"
		},
		class: {
			regex: /(?:(?:public|private|protected)\s+)?class\s+([a-zA-Z]\w+)(?:\s*:\s*\S+)?/g,
			outline: "class"
		},
		class_property: {
			regex: /(?:(?:public|private|protected)\s+)[a-zA-Z][a-zA-Z0-9_<>]*\s+[a-zA-Z]\w*/,
			parent_type: "class",
			outline: "property",
			children: false
		},
		method: {
			// IEnumerator IEnumerable.GetEnumerator()
			regex: /((?:public|private|protected)\s+)([a-zA-Z]\w*)\s+([a-zA-Z]\w*(\.[a-zA-Z]\S*)?)(\s*\([^)]*\))/g,
			parent_type: "class",
			outline: "function",
			children: false
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
