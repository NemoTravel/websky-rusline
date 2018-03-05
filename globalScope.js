angular.module('app').run(['$rootScope', 'backend', function ($rootScope, backend) {
    $rootScope.getBrandProps = function (code) {
        var brand = backend.getBrandByCode(code),
            props = [];
        if (brand) {
            props = brand.props;
        }
        return props;
    }
}]);  