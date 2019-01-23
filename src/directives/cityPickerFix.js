/*
* Восстанавливаем старое поводение функции sustrChange Валентин удалил возможность передавать аргумент
* dontMoveFocus в эту функцию. Данная директива подменяет новую версию на старую.
* Эта директива должна быть подключена до момента пока сирена не закончит разработку
* компонента awesome-search-form
 */
var app = angular.module('app');

app.directive('cityPickerFix', function () {
    return {
        scope: false,
        bindToController: true,
        controller: 'cityPickerFixController'
    }
});

app.controller('cityPickerFixController', ['$scope', 'utils', 'backend', cityPickerFixController]);


function cityPickerFixController($scope, utils, backend) {
    backend.ready.then(function () {
        $scope.substrChange = function (dontMoveFocus) {
            $scope.filteredCitiesList = utils.filterCitiesList(
                $scope.citiesList,
                $scope.searchSubstr,
                backend.sessionParams.lang,
                backend.sessionParams.localNamePropName,
                $scope.excludeCityCode
            );
            if ($scope.filteredCitiesList.length === 1 && !dontMoveFocus) {
                $scope.selectedCity = $scope.filteredCitiesList[0];
                focusNextInput();
            }
        };
    })
}
