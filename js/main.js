(function() {
	'use strict';

	// Sets the requireJS configuration for oyur application
	require.config({

		// 3rd party script aliases names
		paths: {
			'jquery': 'vendor/jquery/jquery-1.9.1',
			'jquerymobile': 'vendor/jquery-mobile/jquery.mobile-1.3.1',
			'handlebars': 'vendor/handlebars/handlebars-1.0.0',
			'moment': 'vendor/moment/moment-2.0.0'
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
			}
		}
	});

	// Includes file dependencies
	require(['jquery', 'jquerymobile', 'router', 'templates', 'services/seeker'],
		function($, jMobile, appRouter, templates, seeker) {

		$('body').removeClass('invisible');

		// Prevent all anchor click handling
		// $.mobile.linkBindingEnabled = false;

		// Disabling this will prevent jQuery mobile from handling hash changes
		// $.mobile.hashListeningEnabled = false;

		// Start application router
		appRouter.init();
	});

}());