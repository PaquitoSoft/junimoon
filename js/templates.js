define(['jquery', 'handlebars', 'logger'], function($, H, logger) {
	'use strict';

	var templates = {};

	function render(tplName, context) {
		if (!templates[tplName]) {
			templates[tplName] = H.compile($('#' + tplName).html());
		}
		return templates[tplName](context);
	}

	return {
		render: render
	};

});