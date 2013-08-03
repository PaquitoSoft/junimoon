define(['jquery', 'handlebars', 'logger'], function($, H, logger) {
	'use strict';

	var templates = {};

	function render(tplName, context) {
		if (!templates[tplName]) {
			// TODO Check that template exists in the document before using it (dev flow problem)
			templates[tplName] = H.compile($('#' + tplName).html());
		}
		return templates[tplName](context);
	}

	return {
		render: render
	};

});