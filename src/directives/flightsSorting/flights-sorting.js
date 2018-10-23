var app = angular.module('app');

app.directive('flightsSorting', function () {
    return {
        scope: {
            'segment': '='
        },
        templateUrl: 'directives/flightsSorting/flights-sorting.html',
        controllerAs: 'vm',
        bindToController: true,
        controller: 'flightsSortingController'
    }
});

app.controller('flightsSortingController', ['$scope', 'utils', flightsSortingController]);

function flightsSortingController($scope, utils) {
    var vm = this;

    vm.handleSelect = handleSelect;
    vm.onlyDirect = false;
    vm.sortingVariants = [
        {
            value: 'depTime',
            name: 'По времени вылета'
        },
        {
            value: 'arrTime',
            name: 'По времени прилета'
        },
        {
            value: 'flightTime',
            name: 'По длительности перелета'
        },
        {
            value: 'cheapest',
            name: 'Сначала дешевые'
        },
        {
            value: 'connectionTime',
            name: 'По длительности пересадок'
        }
    ];
    vm.selectedSortingFilter = vm.sortingVariants[0];
    vm.handleDirectCheckboxSwitch = onlyDirectToggleHandler;

    $scope.$watch(angular.bind(this, function () {
        return vm.onlyDirect
    }), function () {
        setIsDirectPropToFlights();
    });

    function handleSelect() {
        // console.log(vm.selectedSortingFilter);
        // removeSearchResults();

        // console.log(vm.segment);

        switch (vm.selectedSortingFilter.value) {
            case 'depTime':
                sortFlightsByDepTime();
                break;
            case 'arrTime':
                sortFligtsByArrTime();
                break;
            case 'flightTime':
                sortFlightsByFlightTime();
                break;
            case 'cheapest':
                sortFlightsByPrice();
                break;

            case 'connectionTime':
                sortByConnectionTime();
                break;

            default:
                sortFlightsByDepTime();
                break;
        }
    }

    function sortFlightsByDepTime() {
        vm.segment.sort(function (segmentA, segmentB) {
            return utils.compareStringTime(segmentA.flightsInfo.departuretime, segmentB.flightsInfo.departuretime);
        });
    }

    function sortFligtsByArrTime() {
        vm.segment.sort(function (segmentA, segmentB) {
            return utils.compareStringTime(segmentA.flightsInfo.arrivaltime, segmentB.flightsInfo.arrivaltime);
        });
    }

    function sortFlightsByFlightTime() {
        vm.segment.sort(function (segmentA, segmentB) {
            return utils.compareStringTime(segmentA.flightsInfo.flighttime, segmentB.flightsInfo.flighttime);
        });
    }

    function sortFlightsByPrice() {
        vm.segment.sort(function (segmentA, segmentB) {
            return parseInt(segmentA.minPrice, 10) - parseInt(segmentB.minPrice, 10);
        });
    }

    function sortByConnectionTime() {
        vm.segment.sort(function (segmentA, segmentB) {
            if (!segmentA.flightsInfo.connections.length) {
                // segment A don't have connections
                return -1;
            } else if (!segmentB.flightsInfo.connections.length) {
                // segment B dont have connections
                return 1;
            } else if (segmentA.flightsInfo.connections.length && segmentB.flightsInfo.connections.length) {
                // compare
                return utils.compareStringTime(segmentA.flightsInfo.connections[0].time, segmentB.flightsInfo.connections[0].time);
            } else {
                // equal
                return 0;
            }
        });
    }

    function onlyDirectToggleHandler(newVal) {
        vm.onlyDirect = newVal;
        setIsDirectPropToFlights();
    }

    function setIsDirectPropToFlights() {
        // if onlyDirect is set to true, loop over flights and set correct isDirectFlight
        // property to every flight in segment
        // else, set isDirectFlight = true for every flight
        // we need it, because in template, we use:
        // ng-if="row.isDirectFlight" where row is flight
        if (vm.onlyDirect) {
            _.forEach(vm.segment, function (flight) {
                flight.isDirectFlight = !flight.flightsInfo.connections.length;
            });
        } else {
            _.forEach(vm.segment, function (flight) {
                flight.isDirectFlight = true;
            });
        }
    }
}

