"use strict";

import path from 'path';

import Lexer from './engine/Lexer.mjs';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

class Skyliner {
	constructor() {
		this.lexers = {};
	}
	
	async __fetch_states(lang) {
		let filepath = path.join(
			__dirname,
			"../langs",
			`${lang.replace(/[^a-zA-Z0-9_\-]+/g, "").toLowerCase()}.mjs`
		);
		return (await import(filepath)).default;
	}
	
	async outline(lang, source) {
		let outline = [],
			stack = [];
		
		for await (let item of this.outline_iterate(lang, source)) {
			// Pop items from the stack while the depth of this item is less than that of the item on the top of the stack
			while(stack.length > 0 && item.depth <= stack[stack.length-1].depth) {
				stack.pop();
			}
			
			// If we've emptied the stack, then add to the top-level outline
		    if(stack.length == 0) {
				stack.push(item);
				outline.push(item);
				continue;
			}
			else {
				// The stack isn't empty - add to a parent node & push onto the stack
				let parent = stack[stack.length-1];
				if(!(parent.children instanceof Array))
					parent.children = [];
				
				parent.children.push(item);
				stack.push(item);
			}
		}
		
		return outline;
	}
	
	async *outline_iterate(lang, source) {
		if(!(this.lexers[lang] instanceof Lexer))
			this.lexers[lang] = new Lexer(await this.__fetch_states(lang));
		
		// We've gotta wrap like this because of the above await
		for await (let item of this.lexers[lang].iterate(source))
		    yield item;
	}
}

export default Skyliner;
