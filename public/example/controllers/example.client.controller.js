angular.module('example').controller('ExampleController', ['$scope', '$filter', '$routeParams',
    'Authentication', 'Example',
    function($scope, $filter, $routeParams, Authentication, Example) {
        $scope.user = Authentication.user ? Authentication.user : 'MEAN Application';
        /*$scope.find = function() {
            $scope.repos = Example.query();
        };*/
        $scope.remote = Example.query();
        $scope.predicates = ['name', 'description', 'language','tags'];
        $scope.selectedPredicate = $scope.predicates[0];
    }
]);
angular.module('example').directive('csSelect', function () {
    return {
        require: '^stTable',
        template: '<input type="checkbox" name="_ids" value="{{row._id}}"/>',
        scope: {
            row: '=csSelect'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind('change', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });

            scope.$watch('row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    element.parent().addClass('st-selected');
                } else {
                    element.parent().removeClass('st-selected');
                }
            });
        }
    };
});