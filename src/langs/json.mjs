"use strict";

export default {
	// Default state
	default: {
		brace_open: { regex: /[\{]/, depth_delta: 1 },
		brace_close: { regex: /[\}]/, depth_delta: -1 },
		
		property: {
			regex: /"([^"]+)":/,
			group_index: 1,
			outline: "property"
		}
	}
}
