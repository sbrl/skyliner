"use strict";

import path from 'path';

import CliParser from 'applause-cli';

import settings from './settings.mjs';
import do_outline from '../actions/do_outline.mjs';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

export default async function() {
	// 1: CLI Parsing
	// ------------------------------------------------------------------------
	let cli = new CliParser(path.resolve(__dirname, "../../package.json"));
	cli.set_description("Universal outlining engine. Generate an outline of any text-based document!");
	cli.argument("lang", "Required. The language to parse the input as.", null, "string")
		.argument("input", "The input file to process (default: stdin)", null, "string")
		.argument("output", "The filepath to write the result to (default: stdout)", null, "string")
		.argument("debug", "Enable debug mode, which writes lots of extra data to the standard error (the format of this data is subject to change and should not be parsed).", false, "boolean")
		.argument("json", "Output JSON instead of human-readable text", false, "boolean")
		.argument("csv", "Output CSV instead of human-readable text", false, "boolean");
	
	// 1: Attach to main settings
	// ------------------------------------------------------------------------
	settings.cli = cli.parse(process.argv.slice(2));
	settings.format = "text";
	if(settings.cli.json) settings.format = "json";
	if(settings.cli.csv) settings.format = "csv";
	
	// 1: Execute
	// ------------------------------------------------------------------------
	await do_outline();
}
