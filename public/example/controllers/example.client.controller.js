angular.module('example').controller('ExampleController', ['$scope', '$routeParams',
    'Authentication', 'Example',
    function($scope, $routeParams, Authentication, Example) {
        $scope.name = Authentication.user ? Authentication.user._id : 'MEAN Application';
        $scope.find = function() {
            $scope.repos = Example.query();
        };
    }
]);