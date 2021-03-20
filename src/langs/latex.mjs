"use strict";

export default {
	// Default state
	default: {
		// Ref https://www.overleaf.com/learn/latex/Sections_and_chapters
		part: {
			regex: /\\part\*?\{(.*)\}/, group_index: 1,
			outline: "heading", depth_set: 0
		},
		chapter: {
			regex: /\\chapter\*?\{(.*)\}/, group_index: 1,
			outline: "heading", depth_set: 1
		},
		section: {
			regex: /\\section\*?\{(.*)\}/, group_index: 1,
			outline: "heading", depth_set: 2
		},
		subsection: {
			regex: /\\subsection\*?\{(.*)\}/, group_index: 1,
			outline: "heading", depth_set: 3
		},
		subsubsection: {
			regex: /\\subsubsection\*?\{(.*)\}/, group_index: 1,
			outline: "heading", depth_set: 4
		},
		paragraph: {
			regex: /\\paragraph\*?\{(.*)\}/, group_index: 1,
			outline: "heading", depth_set: 5
		},
		subparagraph: {
			regex: /\\subparagraph\*?\{(.*)\}/, group_index: 1,
			outline: "heading", depth_set: 6
		},
	}
}
