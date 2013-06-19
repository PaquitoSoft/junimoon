define(['jquery'], function($) {
	'use strict';

	return {
		log: function(msg) {
			console.log(msg);
		},
		info: function(msg) {
			console.info(msg);
		},
		error: function(msg) {
			console.error(msg);
		}
	};
});