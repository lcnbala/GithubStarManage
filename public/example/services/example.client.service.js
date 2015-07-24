// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' service
angular.module('example').factory('Example', ['$resource','Authentication', function($resource,Authentication) {
	// Use the '$resource' service to return an article '$resource' object
    //return $resource('http://127.0.0.1:3000/user/golmic/starred', {
    return $resource('http://127.0.0.1:3000/user/'+Authentication.user.username+'/starred', {
    }, {
        update: {
            method: 'get'
        }
    });
}]);