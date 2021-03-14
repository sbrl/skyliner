<?php

function FunctionName($value='')
{
	bar(function ($value) {
	    yay($value);
	}, function($another_value) {
		$f = floor(5 / $another_value);
		return $f * 2;
	});
}
