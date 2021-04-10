"use strict";

export default {
	// Default state
	default: {
		from: {
			regex: /FROM\s+\S+(\s+AS\s+\S+)?/,
			depth_set: 0,
			outline: "function"
		},
		single: {
			regex: /(USER)\s+\S+/,
			depth_set: 0,
			outline: "function"
		},
		generic: {
			regex: /(?:ARG|RUN|COPY|ADD|ENTRYPOINT|CMD|ENV|WORKDIR)\s+.*/,
			depth_set: 0,
			outline: "function"
		},
		comment_single: {
			regex: /#/g,
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
