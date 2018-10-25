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

app.controller('flightsSortingController', ['$scope', 'utils', 'backend', flightsSortingController]);

function flightsSortingController($scope, utils, backend) {
    var vm = this;

    vm.handleSelect = handleSelect;
    vm.onlyDirect = false;
    vm.handleDirectCheckboxSwitch = onlyDirectToggleHandler;
    vm.sortingVariants = [];
    vm.selectedSortingFilter = vm.sortingVariants[0];

    backend.ready.then(function () {
        vm.sortingVariants = [
            {
                value: 'depTime',
                name: backend.getAlias('web.sortingNames.departureTime')
            },
            {
                value: 'arrTime',
                name: backend.getAlias('web.sortingNames.arrivalTime')
            },
            {
                value: 'flightTime',
                name: backend.getAlias('web.sortingNames.flightTime')
            },
            {
                value: 'cheapest',
                name: backend.getAlias('web.sortingNames.cheapest')
            },
            {
                value: 'connectionTime',
                name: backend.getAlias('web.sortingNames.connectionTime')
            }
        ];

        vm.selectedSortingFilter = vm.sortingVariants[0];
        // sort by default when aliases load
        sortFlights();
    });

    $scope.$watch(angular.bind(this, function () {
        return vm.onlyDirect
    }), function () {
        setIsDirectPropToFlights();
    });

    // helper function with more
    // convenient name for use inside controller
    function sortFlights() {
        handleSelect();
    }

    function handleSelect() {

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

