'use strict';

angular.module('example').factory('Example', ['$resource','Authentication', function($resource,Authentication) {
    return $resource('http://gsm.lujq.me/user/'+Authentication.user.username+'/starred', {
    }, {
        update: {
            method: 'get'
        }
    });
}]);