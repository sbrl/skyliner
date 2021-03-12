"use strict";

import fs from 'fs';

import settings from '../core/settings.mjs';
import Skyliner from '../lib/Skyliner.mjs';
import { write_safe, end_safe } from '../lib/io/stream_safe.mjs';

export default async function do_outline() {
	let input = process.stdin,
		output = process.stdout;
	
	if(typeof settings.cli.lang !== "string") {
		console.error(`Error: No language specified (try --lang LANGUAGE_NAME, or --help if you're confused).`);
		process.exit(1);
	}
	
	if(typeof settings.cli.input == "string") {
		if(!fs.existsSync(settings.cli.input)) {
			console.error(`Error: No such file or directory '${settings.cli.input}'.`);
			process.exit(1);
		}
		input = fs.createReadStream(settings.cli.input);
	}
	
	if(typeof settings.cli.output == "string")
		output = fs.createWriteStream(settings.cli.output);
	
	const outliner = new Skyliner();
	
	let result = await outliner.outline(settings.cli.lang, input);
	
	switch(settings.format) {
		case "text":
			console.error(`Coming soon! (try --json)`);
			break;
		case "json":
			await write_safe(output, JSON.stringify(result, null, `\t`));
			break;
	}
	await end_safe(output);
}
