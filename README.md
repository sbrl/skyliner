# Skyliner

> Universal outlining engine. Generate an outline of any text-based document!

Skyliner is a regular expression based streaming document outlining engine. The goal is to support outlining as many different text-based formats as possible. It reads the input line-by-line and emits outline items.

It was born out of frustration that [Atom-IDE](https://ide.atom.io/) doesn't support half of the file formats I usually work with.

It can be used in 2 ways:

1. Through the command-line interface
2. Via the API

Eventually, the goal is to implement a plugin for Atom.


## Supported languages
The following languages are currently supported:

 - javascript

To add support for a new language, go to `src/langs` and create a new file (or copy an existing one) and create a definition for the new language. The filename must exactly match the name of the language you're adding.


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
heading     | A heading in some kind of text document (e.g. markdown)
