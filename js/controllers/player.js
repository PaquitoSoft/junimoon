define(['jquery', 'templates', 'logger'], function($, templates, logger) {
	'use strict';

	var PLAYER_TPL = 'playerTpl';

	var playerPageController = {
		init: function($page) {
			logger.info("Initializing PLAYER controller...");
			this.$page = $page;
		},
		render: function(track) {
			var html = templates.render(PLAYER_TPL, track);
			this.$page.find('.ui-content').html(html);
		}
	};

	return playerPageController;
});