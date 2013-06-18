define(['jquery', 'moment', 'models/models', 'logger'], function($, moment, models, logger) {
	'use strict';

	var LASTFM_BASE_URL = 'http://ws.audioscrobbler.com/2.0/?',
		LASTFM_API_KEY = 'b57b804c3dc371d824c9adac24b7e0a2';

	function search(query, Klass, options) {
		var d = $.Deferred(),
			resource = Klass.name.toLowerCase(),
			reqOptions = $.extend({
				method: resource + '.search',
				offset: 1,
				limit: 10,
				'api_key': LASTFM_API_KEY,
				format: 'json'
			}, options || {});

		reqOptions[resource] = query;

		$.getJSON(LASTFM_BASE_URL + $.param(reqOptions)).success(function(data/*, status, headers, config*/) {
			var rawResults, parsedResults = [];

			if (data.error) {
				console.info('Lastfm search request error: ', data);
				d.reject(new Error(data.message));
			} else {

				rawResults = data.results[resource + 'matches'][resource];

				rawResults = (!$.isArray(rawResults)) ? [rawResults] : rawResults;
				// if (!$.isArray(rawResults)) {
				//	rawResults = [rawResults];
				// }

				rawResults.forEach(function(rr) {
					parsedResults.push(new Klass(rr));
				});

				// console.log('LastFM::search# Results:', parsedResults);
				d.resolve(parsedResults);
			}

		}).error(function(data/*, status, headers, config*/) {
			console.info('Lastfm request error: ', data);
			d.reject(new Error(data.message));
		});

		return d.promise();
	}

	function getArtistAlbums(artist) {
		var d = $.Deferred(),
			albums = [],
			reqOptions = {
				page: 1,
				limit: 20,
				method: 'artist.gettopalbums',
				format: 'json',
				'api_key': LASTFM_API_KEY
			};

		if (artist.externalId) {
			reqOptions.mbid = artist.externalId;
		} else {
			reqOptions.artist = artist.name;
		}

		$.getJSON(LASTFM_BASE_URL + $.param(reqOptions)).success(function(data) {
			var rawData = data.topalbums.album;
			if (data.error) {
				d.reject(new Error(data.message));
			} else {
				if (rawData) {
					if (!$.isArray(rawData)) {
						rawData = [rawData];
					}
					rawData.forEach(function(ra) {
						albums.push(new models.Album(ra));
					});
				}
				d.resolve(albums);
			}

		}).error(function(data) {
			d.reject(new Error(data.message));
		});

		return d.promise();
	}

	function getAlbumInfo(album, options) {
		var d = $.Deferred(),
			reqOptions = $.extend(options || {}, {
				method: 'album.getinfo',
				offset: 1,
				limit: 10,
				'api_key': LASTFM_API_KEY,
				format: 'json'
			});

		if (album.externalId) {
			reqOptions.mbid = album.externalId;
		} else {
			reqOptions.album = album.title;
			reqOptions.artist = album.artist.name;
		}

		$.getJSON(LASTFM_BASE_URL + $.param(reqOptions)).success(function(data) {
			if (data.error) {
				$log.info('Lastfm get album info error: ', data);
				d.reject(new Error(data.message));
			} else {
				d.resolve(new models.Album(data.album));
			}
		}).error(function(data) {
			$log.info('Lastfm get album info error: ', data);
			d.reject(new Error(data.message));
		});

		return d.promise();
	}

	return {
		search: search,
		searchArtist: function(query, options) {
			return search(query, models.Artist, options);
		},
		searchAlbum: function(query, options) {
			return search(query, models.Album, options);
		},
		// getArtistInfo: function(artist) {},
		getArtistAlbums: getArtistAlbums,
		getAlbumInfo: getAlbumInfo
	};

});

/*
	LAST.FM Error codes

	2 : Invalid service - This service does not exist
	3 : Invalid Method - No method with that name in this package
	4 : Authentication Failed - You do not have permissions to access the service
	5 : Invalid format - This service doesn't exist in that format
	6 : Invalid parameters - Your request is missing a required parameter
	7 : Invalid resource specified
	8 : Operation failed - Something else went wrong
	9 : Invalid session key - Please re-authenticate
	10 : Invalid API key - You must be granted a valid key by last.fm
	11 : Service Offline - This service is temporarily offline. Try again later.
	13 : Invalid method signature supplied
	16 : There was a temporary error processing your request. Please try again
	26 : Suspended API key - Access for your account has been suspended, please contact Last.fm
	29 : Rate limit exceeded - Your IP has made too many requests in a short period
*/
