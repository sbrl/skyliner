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
		
		this.verbose = process.env.DEBUG || false;
	}
	
	async *iterate(source) {
		const reader = nexline({ input: source });
		
		let stack = [];
		let line_number = 0, depth = 0;
		for await (let line of reader) {
			// console.error(`${line_number} text: '${line}'`);
			let index = 0;
			while(true) {
				let match_rule_name = null,
					match_rule = null,
					match_index,
					match_text;
				
				for(let [ rule_name, rule ] of this.sm) {
					// console.error(`rule_name`, rule_name, `rule`, rule);
					if(stack.length > 0 && typeof rule.parent_type == "string" && stack[stack.length-1].type !== rule.parent_type) continue;
					
					// Run the regex
					rule.regex.lastIndex = index;
					let match_current = rule.regex.exec(line);
					
					// If it didn't match or it isn't earlier than the current match, then we're not interested
					if(match_current == null
						|| match_index < match_current.index) continue;
					
					// Record this match
					match_rule_name = rule_name;
					match_rule = rule;
					match_index = match_current.index;
					match_text = match_current[rule.group_index || 0];
					// If we are actually matching a substring, bring the index forwards to the start of said substring
					if(typeof rule.group_index == "number" && rule.group_index > 0)
						match_index += match_current[0].indexOf(match_text);
				}
				
				
				// If we didn't match anything, then there's nothing left to do here
				if(match_rule_name == null) {
					if(this.verbose) console.error(`${line_number}:${index} No matches found, continuing to next line`);
					break;
				}
				
				if(this.verbose) console.error(`${line_number}:${index} chose ${match_rule_name}`);
				
				// We found a match, apply the depth modifier
				if(typeof match_rule.depth_delta === "number")
					depth += match_rule.depth_delta;
				// Set the depth explicitly if necessary
				if(typeof match_rule.depth_set == "number")
					depth = match_rule.depth_set;
				
				
				// Remove extras from the stack
				while(stack.length > 0 && depth <= stack[stack.length-1].depth)
					stack.pop();
				
				if(match_rule.outline) {
					if(this.verbose) console.error(`${line_number}:${index} emit ${match_rule_name} text ${match_text}`);
					// It matches! Yield it.
					let result = {
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
					yield result;
					// Push it onto the stack
					stack.push(result);
				}
				
				// If we need to switch states, do so
				if(typeof match_rule.switch_state == "string")
					this.sm.set_state(match_rule.switch_state);
				
				
				index = match_index + match_text.length;
				// If this match takes us to the end of the line, then there's no point in doing another round
				if(index >= line.length) break;
			}
			
			line_number++;
		}
	}
}

export default Lexer;
