"use strict";

import nexline from 'nexline';

import RulesetStateMachine from './RulesetStateMachine.mjs';
import a from '../io/Ansi.mjs';

class Lexer {
	constructor(states) {
		if(!(states instanceof RulesetStateMachine))
			states = new RulesetStateMachine(states);
		
		/**
		 * The 
		 * @type {[type]}
		 */
		this.current_run = null;
		
		/**
		 * The state machine that holds the rules that we match against.
		 * @type {RulesetStateMachine}
		 */
		this.sm = states;
		/**
		 * The current depth at which the Lexer is at.
		 * This value is controlled by the instructions the state definitions
		 * we wwere initialised with provide.
		 * @type {Number}
		 */
		this.depth = null;
		/**
		 * The current zero-indexed line number the Lexer is scanning.
		 * @type {Number}
		 */
		this.line_number = null;
		/**
		 * The current zero-indexed index into the current line the Lexer is scanning.
		 * @type {Number}
		 */
		this.index = null;
		/**
		 * The current stack of items.
		 * Note that this stack is INTERNAL, and is NOT THE SAME as the actual
		 * depth emitted by the main Skyliner class.
		 * @type {Array}
		 */
		this.stack = [];
		
		this.sym_debug = Symbol.for("__LEXER_DEBUG_DATA__");
		
		this.verbose = process.env.DEBUG || false;
	}
	
	async *iterate(source) {
		let sym_run = Symbol("lexer_run"); // Even creating this multiple times, values will *always* be different.
		this.stack.length = 0;	// Empty the stack
		this.line_number = 0;	// Reset the line counter
		this.depth = 0;			// Reset the depth counter
		
		const reader = nexline({ input: source });
		for await (let line of reader) {
			// this.__log(`next line, text: '${line}'`);
			this.index = 0;
			while(true) {
				let match_rule_name = null,
					match_rule = null,
					match_index,
					match_text;
				
				for(let [ rule_name, rule ] of this.sm) {
					// this.__log(`rule_name`, rule_name, `rule`, rule);
					if(typeof rule.parent_type == "string" && (this.stack.length === 0 || this.stack[this.stack.length-1].type !== rule.parent_type)) continue;
					if(rule.parent_type === null && this.stack.length > 0) continue;
					
					// Run the regex
					rule.regex.lastIndex = this.index;
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
					if(this.verbose) this.__log(`${a.locol}No matches found, continuing to next line${a.reset}`);
					break;
				}
				
				if(this.verbose) this.__log(`${a.hicol}${a.fmagenta}choose${a.reset} ${match_rule_name}`);
				
				// We found a match, apply the this.depth modifier
				if(typeof match_rule.depth_delta === "number")
					this.depth += match_rule.depth_delta;
				// Set the depth explicitly if necessary
				if(typeof match_rule.depth_set == "number")
					this.depth = match_rule.depth_set;
				
				if(match_rule.ends instanceof Array && this.stack.length > 0) {
					for(let target_rule_name of match_rule.ends) {
						if(this.stack[this.stack.length-1][this.sym_debug].rule_name === target_rule_name && this.stack[this.stack.length-1].depth >= this.depth) {
							if(this.verbose) this.__log(`${a.fred}pop${a.reset} rule_name ${this.stack[this.stack.length-1][this.sym_debug].rule_name} depth ${this.stack[this.stack.length-1].depth} reason:manual_ends`);
							this.stack.pop();
							break;
						}
					}
				}
				
				if(match_rule.outline) {
					if(this.verbose) this.__log(`${a.hicol}${a.fgreen}emit${a.reset} ${match_rule_name} text ${match_text}`);
					// It matches! Yield it.
					let result = {
						depth: this.depth,
						line: this.line_number,
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
					// this.__log(`[STACK] length`, this.stack.length, `depth`, depth, `top_item_depth`, this.stack.length > 0 ? this.stack[this.stack.length-1].depth : 0);
					while(this.stack.length > 0 && this.stack[this.stack.length-1].depth >= this.depth) {
						// this.__log(`[STACK:pop] length`, this.stack.length, `depth`, depth, `top_item_depth`, this.stack[this.stack.length-1].depth);
						if(this.verbose) this.__log(`${a.fred}pop${a.reset} rule_name ${this.stack[this.stack.length-1][this.sym_debug].rule_name} depth ${this.stack[this.stack.length-1].depth} reason:auto`);
						this.stack.pop();
					}
					
					// Push it onto the stack
					if(match_rule.children !== false && (this.stack.length == 0 || this.stack[this.stack.length-1].depth < this.depth))
						this.stack.push(result);
				}
				
				// Apply the post-emit depth_delta_after if it's specified
				if(typeof match_rule.depth_delta_after == "number")
					this.depth += match_rule.depth_delta_after;
				
				// If we need to switch states, do so
				if(typeof match_rule.switch_state == "string") {
					if(this.verbose) this.__log(`${a.hicol}${a.fyellow}change_state${a.reset} ${match_rule.switch_state}`);
					this.sm.set_state(match_rule.switch_state);
				}
				
				
				this.index = match_index + match_text.length;
				// If this match takes us to the end of the line, then there's no point in doing another round
				if(this.index >= line.length) break;
			}
			
			this.line_number++;
		}
	}
	
	__log(...msg) {
		let parent = this.stack.length > 0 ? this.stack[this.stack.length-1][this.sym_debug].rule_name : `${a.locol}null${a.reset}`;
		
		console.error([ `${`\t`.repeat(this.depth)}${this.line_number.toString().padStart(4)}:${this.index.toString().padEnd(3)} ${a.locol}s:${a.reset}${this.stack.length}${a.locol}:${a.reset}${parent} ${a.locol}st:${a.reset}${this.sm.state.padEnd(15)}`, ...msg ].join(" "));
	}
}

export default Lexer;
