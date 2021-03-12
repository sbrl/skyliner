"use strict";

class RulesetStateMachine {
	constructor(states) {
		this.states = states;
		if(typeof this.states.default === "undefined")
			throw new Error(`Error: The given states object doesn't contain a default state`);
		this.state = "default";
		
		this.__check();
	}
	
	/**
	 * Checks all the states & regular expressions and ensures they are all
	 * consistent and have the right flags.
	 * For example, all regexes need to have the sticky (y) flag, because the
	 * lexer makes use of lastIndex.
	 * @return	{void}
	 */
	__check() {
		for(let state_name in this.states) {
			for(let rule_name in this.states[state_name]) {
				if(this.states[state_name][rule_name] instanceof RegExp) {
					this.states[state_name][rule_name] = {
						regex: this.states[state_name][rule_name]
					};
				}
				let obj = this.states[state_name][rule_name];
				// Make sure the regex is marked as global, since we'll need that functionality later
				if(!obj.regex.global)
					obj.regex = new RegExp(obj.regex, `${obj.regex.flags}g`);
				// If it's marked as sticky, it diesn't work properly
				if(obj.regex.sticky)
					obj.regex = new RegExp(obj.regex, obj.regex.flags.replace("y", ""));
			}
		}
	}
	
	*[Symbol.iterator]() {
		for(let rule_name in this.states[this.state])
			yield [ rule_name, this.states[this.state][rule_name] ];
	}
}

export default RulesetStateMachine;
