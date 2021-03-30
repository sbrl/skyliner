# Skyliner

> Universal document outlining engine. Generate an outline of any text-based document!

Skyliner is a regular expression based streaming document outlining engine. The goal is to support outlining as many different text-based formats as possible. It reads the input line-by-line and emits outline items.

It was born out of frustration that [Atom-IDE](https://ide.atom.io/) doesn't support half of the file formats I usually work with.

It can be used in 2 ways:

1. Through the command-line interface
2. Via the Javascript API

Eventually, the goal is to implement a plugin for Atom.


## Supported languages
The following languages are currently supported:

 - clike (e.g. c, c++, header files, aliases: `c`, `h`, `c++`, `h++`, `cpp`, `hpp`)
 - csharp
 - go
 - ini
 - javascript (aliases: `js`, `mjs`)
 - json
 - latex (aliases: `tex`)
 - lua
 - markdown
 - php
 - rust
 - sh (including bash)
 - toml
 - xml

See below for how to add support for a new language.


## Usage

### Command Line Interface
Install via npm:

```bash
npm install --global skyliner
```

Then, call skyliner like this:

```bash
skyliner --lang <language_code> --input path/to/file
```

For example:

```bash
skyliner --lang javascript --input path/to/example.js
```

You can also pipe content in via the standard input:

```bash
curl https://example.com/example.js | skyliner --lang javascript
```

Instead of the text-based output, you can also ask Skyliner to give you JSON instead:

```
skyliner --json --lang latex <path/to/file.tex
```

See below for a list of supported languages.

#### Exit Codes
The CLI may exit with a number of different exit codes depending on the problem. Below these are catalogued.

Exit code	| Meaning
------------|------------------------------
0			| Success
1			| General error
2			| Language definition not found

### API
Skyliner also has a Javascript API you can use. To get started, install Skyliner with npm:

```bash
npm install --save skyliner
```

Then, import the `Skyliner` class and start generating outlines. Here's an example:

```js
import Skyliner from 'skyliner';

(async () => {
	"use strict";
	
	const skyliner = new Skyliner();
	
	console.log(await skyliner.outline("markdown", "# Heading 1\nThis is some text.\n"));
})();
```

This example will log an array of hierarchically-nested outline objects (see below for the spec on what they look like)

You can also stream the outline objects directly, though they won't be auto-nested for you. Here's how you do that:

```js
import Skyliner from 'skyliner';

(async () => {
	"use strict";
	
	const skyliner = new Skyliner();
	
	for await (let outline_item of skyliner.outline_iterate("markdown", "# Heading 1\nThis is some text.\n"))) {
		console.log(outline_item);
	}
})();
```

`skyliner.outline_iterate` is an [asynchronous generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) that emits outline objects.

Note also that the source to parse is passed directly to [`nexline`](https://www.npmjs.com/package/nexline), so you can pass it anything that `nexline` supports, such as:

 - A readable stream (e.g. `fs.createReadStream(filepath)`)
 - A string containing source text to iterate over
 - A buffer of source text
 - A file handle (e.g. `fs.openSync(filepath, "r")`)
 - An array of any combination of the above

Full automatically updated API documentation is coming soon.


## Specification
An outline consists of an array of items. The form of each item looks like this:

```js
{
	line,
	index,
	depth,
	type,
	text,
	children,
}
```

Each property is described below:

 - `line` (Number): The line number the item appears on.
 - `index` (Number): The index within the line the item starts at.
 - `depth` (Number): How deeply nested the item is. Note that this isn't necessarily how deeply nested within the _outline_ tree, but the document itself (e.g. brackets might mean it's more deeply nested in the document than the location in the outline).
 - `type` (string): The type of outline item this is. See the table below.
 - `text` (string): A textual string that describes the item.
 - `children`: (Array\<Object\>?): Optional. If specified, this is an array of child items.

The following list of types can currently be returned:

Type        | Meaning
------------|------------------------------------------------------------------
function    | A function
class       | A class
namespace   | A namespace or other logical grouping element
interface   | An interface that defines the functionality of a class or other logical structure
object      | An object or table containing multiple values
property    | A property on a class or object
heading     | A heading in some kind of text document (e.g. markdown)
element     | A hierarchical element of some kind (e.g. XML / HTML)


## Adding a new language
To add support for a new language, go to `src/langs` and create a new file (or copy an existing one) and create a definition for the new language. The filename must exactly match the name of the language you're adding.

_Skyliner_ works through a simple state machine based system. A file must have a default export of an object containing the different possible states the state machine can be in. All languages *must* at least define a "default" state, as this is the state that the engine begins in.

States can have one or more rules defined therein as an object, where the keys are the names of the rules, and the values are the rules attached thereto.

When you've added a new language definition file, you'll need to run this command to update the language list:

```bash
npm run prepare
```

This is because without statically defining the list of languages Skyliner would be incompatible with bundling systems like [Rollup](https://rollupjs.org/) for example.

### Rule definition
A rule is an object containing the following properties:

 - `regex`: RegExp - Regex to match with. This is the only required item.
 - `group_index`: Number - The index of the capturing group to use. By default the entire matched string is used by the Lexer.
 - `depth_delta`: Number - Delta value to add to the depth in the outline tree. Useful for handling brackets etc. to get the hierarchy in the generated outline correct.
 - `depth_delta_after`: Number - Same as `depth_delta`, but applied _after_ any outline item is emitted and any other depth handling logic.
 - `depth_set`: Number - Set the depth to this value if this rule is chosen.
 - `outline`: string - The type of outline item to generate. If not specified, no outline item will be generated.
 - `switch_state`: string - The name of the alternate state to switch to. This will happen as soon as this item is chosen by the Lexer.
 - `parent_type`: string - The type of direct parent that this rule must have to trigger at all.
 - `children`: boolean - Whether this item can have children or not. If false, then this item isn't put on the stack for computing `parent_type`.
 - `ends`: string\[\] - A list of strings naming the rule names this block is responsible for ending. If specified, if this block is picked and the item on the top of the stack matches anything in this list and the depth (after applying any changes described above) is the same as that of the item on the top of the stack, it will be removed.

Only `regex` is required.

## Writing Tests
TODO: Write a section here on how to implement tests


### TODO
This is a todo list of languages support for which support is planned. Feel free to pick any of these up after checking for an existing pull request. Don't feel limited to this list either - pull requests for other languages are also welcome.

 - html (for now use `xml` and make sure you close self-closing elements `<xml_style />`, because doing HTML will be very hard otherwise)
 - java
 - wren
 - ruby
 - prolog
 - python
 - sql?
 - asm?
 - wasm?

 
## Contributing
Contributions are very welcome - both issues and pull requests! Please mention in your pull request that you release your work under the MPL-2.0 (see below).

Please don't forget to implement some tests if you've found & fixed a bug or implemented support for a new language :-)

If you're feeling that way inclined, the sponsor button at the top of the page (if you're on GitHub) will take you to my Liberapay profile if you'd like to donate to say an extra thank you :-)


## License
Skyliner is released under the Mozilla Public License 2.0. The full license text is included in the `LICENSE` file in this repository. Tldr legal have a [great summary](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)) of the license if you're interested.
