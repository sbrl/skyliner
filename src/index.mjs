#!/usr/bin/env node

import cli from './bootstrap/cli.mjs';

(async () => {
    "use strict";
	
	await cli();
})();
