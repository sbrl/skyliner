"use strict";

import nexline from 'nexline';

import RulesetStateMachine from './RulesetStateMachine.mjs';

class Lexer {
	constructor(states) {
		if(!(states instanceof RulesetStateMachine))
			states = new RulesetStateMachine(states);
		
		/**
		 * The state machine that holds the rules that we match against.
		 * @type {RulesetStateMachine}
		 */
		this.sm = states;
		
		this.sym_debug = Symbol.for("__LEXER_DEBUG_DATA__");
	}
	
	async *iterate(source) {
		const reader = nexline({ input: source });
		
		let line_number = 0, depth = 0;
		for await (let line of reader) {
			let index = 0;
			while(true) {
				let match_rule_name = null,
					match_rule = null,
					match_index,
					match_text;
				
				for(let [ rule_name, rule ] of this.sm) {
					regex.lastIndex = index;
					let match_current = regex.exec(line);
					if(match_current == null
						|| match_index < match_current.index) continue;
					
					match_rule_name = rule_name;
					match_rule = rule;
					match_index = match_current.index;
					match_text = match_current[regex.group_index || 0];
					// If we are actually matching a substring, bring the index forwards to the start of said substring
					if(typeof regex.group_index == "number" && regex.group_index > 0)
						match_index += match_current[0].indexOf(match_text);
				}
				
				// If we didn't match anything, then there's nothing left to do here
				if(match_rule_name == null) break;
				
				// We found a match, apply the depth modifier
				if(typeof match_rule.depth_delta === "number")
					depth += match_rule.depth_delta;
				
				if(match_rule.outline) {
					yield {
						depth,
						line: line_number,
						index: match_index,
						type: match_rule.outline,
						
						text: match_text,
						
						// Debug data
						[this.sym_debug]: {
							rule_name: match_rule_name,
							rule: match_rule
						}
					};
				}
				
				index = match_index + match_text.length;
				// If this match takes us to the end of the line, then there's no point in doing another round
				if(index >= line.length) break;
			}
			
			line_number++;
		}
	}
}

export default Lexer;
