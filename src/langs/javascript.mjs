"use strict";
/*
We export here an object containing the different possible states. All languages *must* at least define a "default" state, as this is the state that the engine begins in.

States can have one or more rules defined therein. 
 */

/* Rule definition:
{
	regex: RegExp,			// Regex to match with. This is the only required item.
	group_index: Number,	// The index of the capturing group to use. By default the entire matched string is used by the Lexer.
	depth_delta: Number,	// Delta value to add to the depth in the outline tree. Useful for handling brackets etc. to get the hierarchy in the generated outline correct.
	outline: string,		// The type of outline item to generate. If not specified, no outline item will be generated.
	switch_state: string,	// The name of the alternate state to switch to. This will happen as soon as this item is chosen by the Lexer.
}

 */

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		function: {
			regex: /function\s*\([^)]+\)/g,
			outline: "function"
		},
		class: {
			regex: /class\s+([a-zA-Z]\w+)/g,
			group_index: 1,
			outline: "class"
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
		eol: {
			regex: /\n/,
			switch_state: "default"
		}
	},
	// Multi-line comments
	comment_multi: {
		end: {
			regex: /\*\//g,
			switch_state: "default"
		}
	}
}
