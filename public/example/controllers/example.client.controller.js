angular.module('example').controller('ExampleController', ['$scope', '$routeParams',
    'Authentication', 'Example',
    function($scope, $routeParams, Authentication, Example) {
        $scope.user = Authentication.user ? Authentication.user : 'MEAN Application';
        $scope.find = function() {
            $scope.repos = Example.query();
        };
    }
]);