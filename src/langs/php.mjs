"use strict";

export default {
	default: {
		php: {
			regex: /<\?(php)?/,
			switch_state: "php"
		}
	},
	php: {
		nophp: { regex: /\?>/, switch_state: "default" },
		brace_open: { regex: /\{/, depth_delta: 1 },
		brace_close: {
			regex: /\}/, depth_delta: -1,
			ends: [ "function" ]
		},
		namespace: {
			regex: /namespace\s+[a-zA-Z]\w+\s*;/g,
			outline: "namespace",
			children: false
		},
		function: {
			regex: /function\s*\*?(\s+[a-zA-Z]\w+)?\s*\([^)]*\)(\s*:\s*[a-zA-Z]\w+)?(\s+use\s*\([^)]+?\))?/g,
			outline: "function"
		},
		class: {
			regex: /class\s+([a-zA-Z]\w+)(\s+(extends|implements)\s+[a-zA-Z]\w+)*/g,
			group_index: 1,
			outline: "class"
		},
		class_function: {
			regex: /((?:public|private|protected)\s+)?function\s*\*?(\s+[a-zA-Z]\w*)?\s*\([^)]*\)(\s*:\s*[a-zA-Z]\w+)?/g,
			parent_type: "class",
			outline: "function"
		},
		class_property: {
			regex: /((?:public|private|protected)\s+)[a-zA-Z]\w*/,
			parent_type: "class",
			outline: "property",
			children: false
		},
		comment_single: {
			regex: /\/\/|#/g,
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
			switch_state: "php"
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
			switch_state: "php"
		}
	},
	string_double: {
		end: {
			regex: /"/g,
			switch_state: "php"
		}
	},
	string_single: {
		end: {
			regex: /"/g,
			switch_state: "php"
		}
	}
}
