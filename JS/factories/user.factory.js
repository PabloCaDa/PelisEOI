(function () {
    'use strict';
    angular
        .module('PelisEOI')
        .factory('UserProvider', UserProvider);

    UserProvider.$inject = ['$http'];

    /* @ngInject */
    function UserProvider($http){
        var exports = {
            getFavorites : getFavorites
        };


        return exports;

        ////////////////

        function getFavorites() {
        }
    }
})();
