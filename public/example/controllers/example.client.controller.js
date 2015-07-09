angular.module('example').controller('ExampleController', ['$scope', '$routeParams' ,
    'Authentication','Example',
    function($scope,$routeParams, Authentication,Example) {
        $scope.name = Authentication.user ? Authentication.user.username : 'MEAN Application';
        $scope.find = function() {
        	$scope.repos = Example.query();
        };
        /*$scope.find = $resource.query('https://api.github.com/users/golmic').
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            return "stat";
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            return "status";
        });*/

    }
]);



/*
angular.module('articles').factory('Articles', ['$resource',
    function($resource) {
        return $resource('api/articles/:articleId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);*/
