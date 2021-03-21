"use strict";

import Lexer from './engine/Lexer.mjs';
import Languages from '../AutoLanguageList.mjs'; // Note that you need to run "npm run prepare" to update this
import LanguageAliases from './LanguageAliases.mjs';


class Skyliner {
	constructor() {
		this.lexers = {};
	}
	
	async __fetch_states(lang) {
		// Normalise the language code
		let lang_code = lang.replace(/[^a-zA-Z0-9_\-]+/g, "").toLowerCase();
		if(typeof LanguageAliases[lang_code] === "string")
			lang_code = LanguageAliases[lang_code];
		
		if(typeof Languages[lang_code] !== "object")
			return null;
		let result = Languages[lang_code];
		// console.log(`[DEBUG:Skyliner/__fetch_states] result`, result);
		return result;
	}
	
	/**
	 * Generates an outline for the given input.
	 * Basically an easay-to-use wrapper around .outline_iterate().
	 * @param	{string}	lang	The language of the given input.
	 * @param	{string|stream.Readable|Buffer|Array}	source	Source input to process. Passed straight to nexline (npm package), so anything that nexline supports is supported here.
	 * @return	{Promise<Object[]>|null}	An array of outline items. May potentially be nested via the children property thereon. If `null` is returned, then no definition could be found for the specified language.
	 */
	async outline(lang, source) {
		if(typeof lang !== "string")
			throw new Error(`Error: Expected lang to be a string, but got ${typeof lang}`);
		
		let outline = [],
			stack = [], i = -1;
		
		for await (let item of this.outline_iterate(lang, source)) {
			i++;
			// If the first item is null, then that means we couldn't find a definition for the specified language.
			if(i == 0 && item == null) return null;
			
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
	 * If the firsst item yielded is null, then that indicates that it couldn't find a language definition for the language you specified.
	 * @param	{string}	lang	The language of the given input.
	 * @param	{string|stream.Readable|Buffer|Array}	source	Source input to process. Passed straight to nexline (npm package), so anything that nexline supports is supported here.
	 * @return	{AsyncGenerator<Object>}	An asynchronous generator that emits outline items. Items are flat and NOT nested as with .outline().
	 */
	async *outline_iterate(lang, source) {
		if(!(this.lexers[lang] instanceof Lexer)) {
			let states = await this.__fetch_states(lang);
			// We have to yield & return in 2 separate steps here because this is an async generator
			if(states == null) { yield null; return; }
			
			this.lexers[lang] = new Lexer(states);
		}
		
		// We've gotta wrap like this because of the above await
		for await (let item of this.lexers[lang].iterate(source))
		    yield item;
	}
}

export default Skyliner;
