// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' service
angular.module('example').factory('Example', ['$resource', function($resource) {
	// Use the '$resource' service to return an article '$resource' object
    return $resource('http://127.0.0.1:3000/user/7007115/starred', {
    }, {
        update: {
            method: 'get'
        }
    });
}]);