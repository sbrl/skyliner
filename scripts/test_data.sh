#!/usr/bin/env bash

lang="$1"
source="$2";

if [[ -z "${source}" ]]; then
	echo "This script regenerates the tests data output for a test input." >&2;
	echo "Usage:" >&2;
	echo "	test_data.sh <language_name> <filepath_in>";
	exit 0;
fi

source="$(readlink -f "${source}")";

# Make sure the current directory is the location of this script to simplify matters
cd "$(dirname "$(readlink -f "$0")")" || { echo "Error: Failed to cd to script directory" >&2; exit 1; };

target="${source%.*.*}.out.json";

echo "$(basename "${source}") → $(basename "${target}")" >&2;

../src/index.mjs --json --lang "${lang}" <"${source}" >"${target}";
