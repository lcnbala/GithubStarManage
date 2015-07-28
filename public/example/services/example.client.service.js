'use strict';

angular.module('example').factory('Example', ['$resource','Authentication', function($resource,Authentication) {
    return $resource('http://127.0.0.1:3000/user/'+Authentication.user.username+'/starred', {
    }, {
        update: {
            method: 'get'
        }
    });
}]);