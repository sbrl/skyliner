#!/usr/bin/env node
"use strict";

import path from 'path';
import fs from 'fs';

import Skyliner from '../src/lib/Skyliner.mjs';
import check from './check.mjs';
import test from 'ava';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

const skyliner = new Skyliner();

async function do_test(test_name, data) {
	test(test_name, async t => {
		let outline = null, target = null;
		await Promise.all([
			(async () => outline = await skyliner.outline(data.lang, fs.createReadStream(data.in)))(),
			(async () => target = JSON.parse(await fs.promises.readFile(data.out, "utf-8")))()
		]);
		check(t, outline, target);
	});
}

(async () => {
	for(let lang of (await fs.promises.readdir(__dirname))) {
		let dir = path.join(__dirname, lang);
		if(!(await fs.promises.lstat(dir)).isDirectory()) continue;
		
		let files = (await fs.promises.readdir(dir))
			.map((el) => { let m = el.match(/([^.]+)\.(in|out)/); return [ m[1], m[2], el ]});
		
		let grouped = {};
		for(let [ test_name, file_type, filename ] of files) {
			if(typeof grouped[test_name] !== "object")
				grouped[test_name] = { lang };
			
			grouped[test_name][file_type] = path.join(dir, filename);
		}
		
		let promises = [];
		for(let test_name in grouped) {
			promises.push(do_test(`${lang}:${test_name}`, grouped[test_name]));
		}
		await Promise.all(promises);
	}
})();
