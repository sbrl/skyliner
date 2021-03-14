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
		let line_number = 1, depth = 0;
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
					if(typeof rule.parent_type == "string" && (stack.length === 0 || stack[stack.length-1].type !== rule.parent_type)) continue;
					if(rule.parent_type === null && stack.length > 0) continue;
					
					// Run the regex
					rule.regex.lastIndex = index;
					let match_current = rule.regex.exec(line);
					
					// If it didn't match or it isn't earlier than the current match, then we're not interested
					if(match_current == null) continue;
					if(match_index < match_current.index) continue;
					
					if(match_index === match_current.index && match_text.length > match_current[rule.group_index || 0].length)
						continue;
					
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
					if(this.verbose) console.error(`${`\t`.repeat(depth)}${line_number}:${index} s${stack.length}, parent ${stack.length > 0 ? stack[stack.length-1][this.sym_debug].rule_name : null} No matches found, continuing to next line`);
					break;
				}
				
				if(this.verbose) console.error(`${`\t`.repeat(depth)}${line_number}:${index} s${stack.length} chose ${match_rule_name}, parent ${stack.length > 0 ? stack[stack.length-1][this.sym_debug].rule_name : null}`);
				
				// We found a match, apply the depth modifier
				if(typeof match_rule.depth_delta === "number")
					depth += match_rule.depth_delta;
				// Set the depth explicitly if necessary
				if(typeof match_rule.depth_set == "number")
					depth = match_rule.depth_set;
				
				if(match_rule.ends instanceof Array && stack.length > 0) {
					for(let target_rule_name of match_rule.ends) {
						if(stack[stack.length-1][this.sym_debug].rule_name === target_rule_name && stack[stack.length-1].depth <= depth) {
							stack.pop();
							break;
						}
					}
				}
				
				if(match_rule.outline) {
					if(this.verbose) console.error(`${`\t`.repeat(depth)}${line_number}:${index} s${stack.length} emit ${match_rule_name} text ${match_text}`);
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
					
					
					// Remove extras from the stack
					// console.log(`[STACK] length`, stack.length, `depth`, depth, `top_item_depth`, stack.length > 0 ? stack[stack.length-1].depth : 0);
					while(stack.length > 0 && stack[stack.length-1].depth >= depth) {
						// console.log(`[STACK:pop] length`, stack.length, `depth`, depth, `top_item_depth`, stack[stack.length-1].depth);
						stack.pop();
					}
					
					// Push it onto the stack
					if(match_rule.children !== false && (stack.length == 0 || stack[stack.length-1].depth < depth))
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
