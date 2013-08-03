/*
(function(L, $) {
	
	L.init({
		name: 'Playing with Lungo.js'
	});

}(Lungo, Zepto));
*/
(function() {
	'use strict';

	// Sets the requireJS configuration for oyur application
	require.config({

		// 3rd party script aliases names
		paths: {
			// 'zepto': '../components/zepto/zepto.min',
			'jquery': 'vendor/jquery/jquery-1.9.1',
			'moment': 'vendor/moment/moment-2.0.0',

			// 'quo': '../components/quojs/quo.debug',
			// 'lungo': '../components/lungo/lungo',
			'handlebars': 'vendor/handlebars/handlebars-1.0.0'
		},

		// Sets the configuration for 3rd party libraries that are not AMD compliant
		/*shim: {
			'backbone': {
				'deps': ['underscore', 'jquery'],
				'exports': 'Backbone' // attaches 'Backbone' to the window object
			},
			'underscore': {
				'exports': '_'
			}
		}
		*/
		shim: {
			'handlebars': {
				'exports': 'Handlebars'
			}/*,
			'quo': {
				'exports': 'Quo'
			},
			'lungo': {
				'deps': ['quo'],
				'exports': 'Lungo'
			}*/
		}
	});

	// Includes file dependencies
	require(['jquery', 'templates', 'services/seeker'],
		function($, templates, seeker) {

		Lungo.init({
			name: 'JuniMoon'
		});

		var $home = $('#home'),
			$resultsList = $('#searchResults'),
			MIN_CHARS_TO_SEARCH = 3,
			SEARCH_TYPE_DELAY = 500,
			keystrokeTimeout;

		$('#searchTerm').on('keyup', function(e) {
			var searchTerm = $(this).val();
			if (searchTerm && searchTerm.length > MIN_CHARS_TO_SEARCH) {

				clearTimeout(keystrokeTimeout);

				keystrokeTimeout = setTimeout(function() {
					// Lungo.Notification.show();
					searchArtist(searchTerm);
				}, SEARCH_TYPE_DELAY);
			}
		});

		$resultsList.on('click', 'li', function() {
			var $listItem = $(this);
			if ($listItem.hasClass('_artist')) {
				searchAlbums({
					externalId: $listItem.attr('data-extId'),
					name: $('._artistName', $listItem).text().trim()
				});
			} else if ($listItem.hasClass('_album')) {
				searchTracks({
					externalId: $listItem.attr('data-extId'),
					title: $('._albumTitle', $listItem).text().trim(),
					artist: {
						name: $('._artistName', $listItem).text().trim()
					}
				});
			}
		});

		function searchArtist(query) {
			seeker.searchArtist(query, {limit: 5}).done(function(data) {
				$resultsList.html(templates.render('artistsListTpl', {artists: data}));
			});
		}

		function searchAlbums(artist) {
			seeker.getArtistAlbums(artist).done(function(albums) {
				artist.albums = albums;
				console.log(artist);
				$resultsList.html(templates.render('albumsListTpl', artist));
			});
		}

		function searchTracks(album) {
			seeker.getAlbumInfo(album).done(function(data) {
				console.log(data);
				$resultsList.html(templates.render('tracksListTpl', data));
			});
		}

		/*
		Lungo.dom('#search').on('load', function(event) {
			console.log("Home page loaded!");
			console.log(arguments);
			console.log(this);
		});
		Lungo.dom('#search').on('unload', function(event) {
			console.log("Home page UNloaded!");
			console.log(arguments);
			console.log(this);
		});
		*/
	});

}());