"use strict";

import CliParser from 'applause-cli';

import settings from './settings.mjs';
import do_outline from '../actions/do_outline.mjs';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

export default async function() {
	// 1: CLI Parsing
	// ------------------------------------------------------------------------
	let cli = new CliParser(path.resolve(__dirname, "../../package.json"));
	cli.argument("input", "The input file to process (default: stdin)", null, "string")
		.argument("output", "The filepath to write the result to (default: stdout)", null, "string");
	
	// 1: Attach to main settings
	// ------------------------------------------------------------------------
	settings.cli = cli.parse(process.argv.slice(2));
	
	// 1: Execute
	// ------------------------------------------------------------------------
	await do_outline();
}
