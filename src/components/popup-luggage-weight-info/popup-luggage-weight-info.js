angular.module('app').component('popupLuggageWeightInfo', {
    templateUrl: 'components/popup-luggage-weight-info/popup-luggage-weight-info.html',
    controller: ['fancyboxTools', PopupRemarkController],
    controllerAs: 'vm'
});

function PopupRemarkController() {

    const vm = this;
    vm.close = jQuery.fancybox.close;

    console.log(vm);
}
