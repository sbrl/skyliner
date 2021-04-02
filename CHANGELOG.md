# Changelog
This is the changelog for _Skyliner_. I remembered to create this for the initial release, so it should be a complete record from then on.

Release template text:

-----

Install or update from npm:

```bash
npm install --save skyliner # For using the javascript API
# or:
npm install --global skyliner # For using the CLI globally
```

-----


## v0.4 (unreleased)
 - wasm: add language ([text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format))


## v0.3.1 (30th March 2021)
 - `Skyliner.outline()`: Add new `depth_tree` property to items


## v0.3 (30th March 2021)
 - wren: add language
 - javascript: Fix single quotes
 - go, php, rust, sh: fix single quote handling
 - Index line numbers from 0, not 1
 - Ensure that earlier Lexer sessions are not resumed after a new Lexer session begins
     - If you need to outline multiple things at once with `Skyliner.outline_iterate()`, it is advised you create multiple `Skyliner` class instances.


## v0.2.1 (25th March 2021)
 - Add aliases: (`bash` and `shell`) → `sh`
 - javascript:
     - allow underscores `_` at the start of function & class names
     - fix multiple methods in class
     - allow class methods to be generators
     - support Symbol methods with square brackets `[]`
 - markdown: fix some complex headings
 - sh: allow dashes `-` in function names


## v0.2 (21st March 2021)
 - Yield `null` if no language definition could be found
 - Make compatible with [Rollup.js](https://https://rollupjs.org/guide/en/) and other bundlers


## v0.1 (20th March 2021)
 - Initial release with 14(!) supported languages!
