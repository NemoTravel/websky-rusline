var app = angular.module('app');

app.filter('airplaneRename', function () {
    return function (airplaneName) {
        if (_.contains(['CANADAIR REGIONAL JET', 'КАНАДЭР РЕГИОН ДЖЕТ'], airplaneName)) {
            return 'CRJ-100/200';
        }
        return airplaneName;
    }
});

