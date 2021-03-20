"use strict";

import path from 'path';

import Lexer from './engine/Lexer.mjs';
import LanguageAliases from './LanguageAliases.mjs';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

class Skyliner {
	constructor() {
		this.lexers = {};
	}
	
	async __fetch_states(lang) {
		// Normalise the language code
		let lang_code = lang.replace(/[^a-zA-Z0-9_\-]+/g, "").toLowerCase();
		if(typeof LanguageAliases[lang_code] === "string")
			lang_code = LanguageAliases[lang_code];
		
		let filepath = path.join(
			__dirname,
			"../langs",
			`${lang_code}.mjs`
		);
		let result = (await import(filepath)).default;
		// console.log(`[DEBUG:Skyliner/__fetch_states] result`, result);
		return result;
	}
	
	/**
	 * Generates an outline for the given input.
	 * Basically an easay-to-use wrapper around .outline_iterate().
	 * @param	{string}	lang	The language of the given input.
	 * @param	{string|stream.Readable|Buffer|Array}	source	Source input to process. Passed straight to nexline (npm package), so anything that nexline supports is supported here.
	 * @return	{Promise<Object[]>}	An array of outline items. May potentially be nested via the children property thereon.
	 */
	async outline(lang, source) {
		if(typeof lang !== "string")
			throw new Error(`Error: Expected lang to be a string, but got ${typeof lang}`);
		
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
	
	/**
	 * Generates an outline for the given input.
	 * Operates in a streaming fashion, operating line-by-line.
	 * @param	{string}	lang	The language of the given input.
	 * @param	{string|stream.Readable|Buffer|Array}	source	Source input to process. Passed straight to nexline (npm package), so anything that nexline supports is supported here.
	 * @return	{AsyncGenerator<Object>}	An asynchronous generator that emits outline items. Items are flat and NOT nested as with .outline().
	 */
	async *outline_iterate(lang, source) {
		if(!(this.lexers[lang] instanceof Lexer))
			this.lexers[lang] = new Lexer(await this.__fetch_states(lang));
		
		// We've gotta wrap like this because of the above await
		for await (let item of this.lexers[lang].iterate(source))
		    yield item;
	}
}

export default Skyliner;
