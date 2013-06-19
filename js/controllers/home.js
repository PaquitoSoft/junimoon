define(['jquery', 'services/seeker', 'templates', 'logger'], function($, seeker, templates, logger) {
	'use strict';

	var MIN_CHARS_TO_SEARCH = 2,
		SEARCH_TYPE_DELAY = 300, // milliseconds
		templatesMap = {
			artists: 'artistListItemTpl',
			albums: 'albumListItemTpl',
			tracks: 'albumListItemTpl'
		};

	var homePageController = {

		init: function($page) {
			logger.info("Initializing HOME controller...");
			var self = this,
				keystrokeTimeout;

			this.$resultsListContainer = $page.find('#autocomplete');

			this.$resultsListContainer.on('listviewbeforefilter', function(e, data) {
				var searchTerm = $(data.input).val();

				if (searchTerm && searchTerm.length > MIN_CHARS_TO_SEARCH) {

					clearTimeout(keystrokeTimeout);

					keystrokeTimeout = setTimeout(function() {
						$.mobile.loading("show");

						// TODO Seach the right entity
						seeker.searchArtist(searchTerm, {limit: 5}).done(function(data) {
							self.render(data, 'artists');
							$.mobile.loading("hide");
						});
					}, SEARCH_TYPE_DELAY);
				}

			});

		},

		render: function(searchResults, type) {
			var resultsHtml = [];

			if (searchResults) {
				searchResults.forEach(function(val) {
					resultsHtml.push(templates.render(templatesMap[type], {
						name: val.name,
						image: val.images.medium
					}));

				});
				this.$resultsListContainer.html(resultsHtml.join(''));
				this.$resultsListContainer.listview('refresh');
				this.$resultsListContainer.trigger('updatelayout');
			}
		}
	};

	return homePageController;

});