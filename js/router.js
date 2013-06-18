define(['jquery', './models/models', 'logger'], function($, models, logger) {
	'use strict';

	var ROUTES_PAGE_REGEX = /^#([a-z-A-Z]*)/;

	var routes = {
		'home-page': 'showHome',
		'artist-page': 'showArtist',
		'album-page': 'showAlbum',
		'playlists-page': 'showPlaylists',
		'player-page': 'showPlayer',
		'settings-page': 'showSettings'
	};

	function parseQueryString(qs) {
		var match,
			pl = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			result = {};

		qs = (qs[0] === '?') ? qs.substr(1) : qs;

		while (match = search.exec(qs)) {
			result[decode(match[1])] = decode(match[2]);
		}

		return result;
	}

	var AppRouter = {

		init: function init() {
			var self = this,
				url, pageName, showFn;

			$(document).bind('pagebeforechange', function(e, data) {

				// We only want to handle changePage() calls where the caller is asking us
				// to load a page by URL
				if (typeof data.toPage === 'string') {

					// We are beign asked to load a page by URL, but we only 
					// want to handle URLs that request the data for a specific category
					url = $.mobile.path.parseUrl(data.toPage).hash,
						pageName = url.match(ROUTES_PAGE_REGEX)[1];
						// pageName = $.mobile.path.parseUrl(data.toPage);

					if (pageName) {

						showFn = self[routes[pageName]];

						if (showFn) {
							showFn.call(self, parseQueryString(url));
						} else {
							throw new Error("No show method found for route: " + pageName);
						}

						// Make sure to tell changePage() we've handled this call 
						// so it doesn't have to do anything
						e.preventDefault();
					}

				}

			});

		},

		changePage: function(pageSelector, contentBuilder) {
			var $page = $(pageSelector);

			$.mobile.loading("show");

			// Update page content
			contentBuilder($page).done(function() {
				$.mobile.changePage($page);

				$.mobile.loading("hide");
			});
		},

		showHome: function() {},
		showArtist: function(params) {
			// Get artist page from DOM
			// Get album item list template
			// Show loader
			// Lookup artist data
			// Update artist page content
			// Change page
			// Hide loader

			var artist = new models.Artist({
				externalId: params.externalId,
				name: params.name
			});

			var fn = function($page) {
				var d = $.Deferred();

				artist.getAlbums().done(function(albums) {
					var html = [];

					$page.find('header h1').text('Daft Punk'); // TODO

					data.forEach(function(album) {
						html.push(Mustache.render(albumTpl, {
							title: album.title,
							image: album.images.medium
						}));
					});

					$page.find('#albumsList').html(html.join(''));

					d.resolve();
				});

				return d.promise();
			};

			this.changePage('#artist-page', fn);
		},
		showAlbum: function() {
			// Get album page from DOM
			// Show loader
			// Lookup album data
			// Update album page content
			// Change page
			// Hide loader
		},
		showPlaylists: function() {
			// Get playlists page from DOM
			// Show loader
			// Lookup user playlists
			// Update page content
			// Change page
			// Hide loader
		},
		showPlayer: function() {
			// Get player page from DOM
			// Show loader
			// Get current playing track	???
			// Update page content			???
			// Change page
			// Hide loader
		},
		showSettings: function() {
			// Get settings page from DOM
			// Show loader
			// Lookup users settings
			// Update page content
			// Change page
			// Hide loader
		}
	};

	return AppRouter;
});