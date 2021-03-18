#!/usr/bin/env bash

test_function() {
	subfunc() {
		travel_to --region alola;
	}
	
	
	do_stuff --awesome | subfunc;
}
