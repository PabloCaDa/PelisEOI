(function () {
    'use strict';
    angular
        .module('PelisEOI')
        .factory('RatingsProvider', RatingsProvider);

    RatingsProvider.$inject = ['$http'];

    /* @ngInject */
    function RatingsProvider($http){
        var exports = {
            getRating: getRating,
        };

        var apiKeyOMDB= "apikey=3370463f";

        return exports;

        ////////////////

        function getRating(movie) {
            return $http.get("http://www.omdbapi.com/?i=" + movie.imdb_id +"&"+apiKeyOMDB).then(loadRating, errorMessage);
        }

        function loadRating(response) {
            return response.data.Ratings;
        }

        function errorMessage() {
            console.log("Conection Failure");
        }
    }
})();
