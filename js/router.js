define(['jquery', 'models/models', 'services/seeker', 'controllers/home', 'controllers/artist', 'controllers/album'],
	function($, models, seeker, homeController, artistController, albumController) {
	'use strict';

	var ROUTES_PAGE_REGEX = /^#([a-z-A-Z]*)/;

	var config = {
		'home-page': {
			handler: 'showHome',
			controller: homeController
		},
		'artist-page': {
			handler: 'showArtist',
			controller: artistController
		},
		'album-page': {
			handler: 'showAlbum',
			controller: albumController
		},
		'playlists-page': {
			handler: 'showPlaylists'
		},
		'player-page': {
			handler: 'showPlayer'
		},
		'settings-page': {
			handler: 'showSettings'
		}
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

			// $(document).on('pageinit', function(event) {
			// 	var $page = $(event.target),
			// 		controller = config[$page.attr('id')].controller;

			// 	if (controller) {
			// 		controller.init($page);
			// 	}
			// });

			// TODO Try to initialize all controllers here?
			Object.keys(config).forEach(function(key) {
				var c = config[key].controller;
				if (c) {
					c.init($('#' + key));
				}
			});

			$(document).bind('pagebeforechange', function(e, data) {

				// When first loaded (home page), data.toPage is the jQuey home-page element

				// We only want to handle changePage() calls where the caller is asking us
				// to load a page by URL
				if (typeof data.toPage === 'string') {

					// We are beign asked to load a page by URL, but we only 
					// want to handle URLs that request the data for a specific category
					url = $.mobile.path.parseUrl(data.toPage).hash,
						pageName = url.match(ROUTES_PAGE_REGEX)[1];

					if (pageName) {

						showFn = self[config[pageName].handler];

						if (showFn) {
							showFn.call(self, parseQueryString($.mobile.path.parseUrl(url.substr(1)).search), config[pageName].controller);
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

		showHome: function() {
			// $.mobile.changePage('#home-page');
		},
		showArtist: function(params, controller) {
			var artist = new models.Artist({
				name: params.name
			});

			// TODO Should receive pageId in params
			this.changePage('#artist-page', function($page) {
				var d = $.Deferred();

				seeker.getArtistAlbums(artist).done(function(albums) {
					artist.albums = albums;
					controller.render(artist); // TODO This does not smell quite well
					d.resolve();
				});

				return d.promise();
			});
		},
		showAlbum: function(params, controller) {
			this.changePage('#album-page', function() {
				var d = $.Deferred();

				seeker.getAlbumInfo({externalId: params.albumId}).done(function(album) {
					controller.render(album);
					d.resolve();
				});

				return d.promise();
			});
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