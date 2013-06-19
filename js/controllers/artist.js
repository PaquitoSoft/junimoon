define(['jquery', 'templates', 'logger'], function($, templates, logger) {
	'use strict';

	var ARTIST_CONTENT_TPL = 'artistPageContentTpl';

	var artistPageController = {
		init: function($page) {
			logger.info("Initializing ARTIST controller...");
			this.$page = $page;
		},
		render: function(artist) {
			var html = templates.render(ARTIST_CONTENT_TPL, artist);
			this.$page.html(html);
		}
	};

	return artistPageController;

});