"use strict";

export default {
	// Default state
	default: {
		brace_open: {
			regex: /[\{]/,
			depth_delta: 1
		},
		brace_close: {
			regex: /[\}]/,
			depth_delta: -1
		},
		function: {
			regex: /something_here/,
			outline: "function"
		},
		foo: {
			regex: /bar/,
			switch_state: "alternate",
		}
	},
	// An alternate state
	alternate: {
		eol: {
			regex: /\n/,
			switch_state: "default"
		}
	}
}
