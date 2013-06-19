define(['jquery', 'templates', 'logger'], function($, templates, logger) {
	'use strict';

	var ALBUM_CONTENT_TPL = 'albumPageContentTpl';

	var albumPageController = {
		init: function($page) {
			logger.info("Initializing ALBUM controller...");
			this.$page = $page;
		},
		render: function(album) {
			var html = templates.render(ALBUM_CONTENT_TPL, album);
			this.$page.html(html);
		}
	};

	return albumPageController;
});