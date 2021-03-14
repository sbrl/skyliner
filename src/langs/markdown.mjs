"use strict";

export default {
	// Default state
	default: {
		h1: {
			regex: /^#\s*(.*)$/, group_index: 1,
			outline: "heading", depth_set: 1
		},
		h2: {
			regex: /^##\s*(.*)$/, group_index: 1,
			outline: "heading", depth_set: 2
		},
		h3: {
			regex: /^###\s*(.*)$/, group_index: 1,
			outline: "heading", depth_set: 3
		},
		h4: {
			regex: /^####\s*(.*)$/, group_index: 1,
			outline: "heading", depth_set: 4
		},
		h5: {
			regex: /^#####\s*(.*)$/, group_index: 1,
			outline: "heading", depth_set: 5
		},
		h6: {
			regex: /^######\s*(.*)$/, group_index: 1,
			outline: "heading", depth_set: 6
		}
	}
}
