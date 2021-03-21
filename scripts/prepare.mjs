#!/usr/bin/env node
"use strict";

/*
This script generates src/AutolanguageList.mjs, which imports all the language definitions
and exports a single object.
This is necessary because if we use a dynamic import, then it makes Skyliner incompatible with bundlers like Rollup.
 */

import fs from 'fs';
import path from 'path';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

(async () => {
    "use strict";
	
	console.error(`>>> Generating src/AutoLanguageList.mjs`);
	let target_dir = path.join(__dirname, "../src/langs");
	
	let imports = [], objs = [];
    
    for(let def_file of await fs.promises.readdir(target_dir)) {
		let lang_name =  def_file.replace(/\.[a-z]+$/i, "");
		imports.push(`import ${lang_name} from './langs/${def_file}';\n`);
		objs.push(`\t${lang_name}`);
	}
	
	await fs.promises.writeFile(path.join(__dirname, "../src/AutoLanguageList.mjs"), `"use strict";
/* This file is generated AUTOMATICALLY. Do NOT edit it - run "npm run prepare" in your terminal instead (though this should have been done automatically).
If this file is wrong, then it's probably because your language definition file is either:

1. In the wrong place
2. Not the exact name of the language it's for */

${imports.join("")}

export default {
${objs.join(",\n")}
};
`);
	
	console.error(`>>> Complete, ${imports.length} languages detected`);
})();
