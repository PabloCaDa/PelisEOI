(function () {
    'use strict';
    angular
        .module('PelisEOI')
        .factory('FilmProvider', FilmProvider);

    FilmProvider.$inject = ['$http'];

    /* @ngInject */
    function FilmProvider($http) {
        var exports = {
            getDiscoverFilms: getDiscoverFilms,
            getSearchedFilms: getSearchedFilms,
            getUpcomingFilms: getUpcomingFilms,
            getGenres: getGenres,
            getFilteredFilms: getFilteredFilms,
            getOneFilm: getOneFilm,
            getRecommended: getRecommended,
            getOrdered: getOrdered,



        };


        var url = "https://api.themoviedb.org/3/";
        var apiKeyTMDB = "api_key=c7203d91c9d40cf4dc28ef5321301917";
        var lang = "language=en-US";




        return exports;

        ////////////////

        function getGenres() {
            return $http.get(url + "genre/movie/list?" + apiKeyTMDB + "&" + lang).then(loadGenres, errorMessage)
        }

        function getDiscoverFilms(page) {
            return $http.get(url + "discover/movie?" + apiKeyTMDB + "&" + lang + "&sort_by=popularity.desc&include_adult=false&include_video=false&page="+page).then(loadFilms, errorMessage);
        }

        function getUpcomingFilms(page) {
            return $http.get(url + "movie/upcoming?" + apiKeyTMDB + "&" + lang + "&page="+page).then(loadFilms, errorMessage)

        }

        function getSearchedFilms(query,page) {
            return $http.get(
                url + "search/movie?" + apiKeyTMDB + "&" + lang + "&query=" + query + "&page="+page+"&include_adult=false").then(loadFilms, errorMessage);
        }

        function getFilteredFilms(filter) {
            return $http.get(url + "discover/movie?" + apiKeyTMDB + "&" + lang + "&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&release_date.gte=" + filter.year + "&vote_average.gte=" + filter.val + "&with_genres=" + filter.genres.join("%2C")).then(loadFilteredFilms, errorMessage);
        }

        function getOneFilm(id) {
            return $http.get(url + "movie/" + id + "?" + apiKeyTMDB + "&" + lang + "&append_to_response=videos").then(loadOneFilm, errorMessage);
        }

        function getRecommended(movie) {
            return $http.get(
                url + "movie/" + movie.id + "/recommendations?" + apiKeyTMDB + "&" + lang + "&page=1").then(loadRecommended, errorMessage);
        }

        function getOrdered(method, filter) {
            return $http.get(url+"discover/movie?"+apiKeyTMDB+"&"+lang+"&sort_by="+method+"&include_adult=false&include_video=false&page=1&release_date.gte=" + filter.year + "&vote_average.gte=" + filter.val + "&with_genres=" + filter.genres.join("%2C")).then(loadOrdered, errorMessage);

        }


        function loadGenres(response) {
            return response.data.genres;
        }

        function loadFilms(response) {
            return response.data;
        }

        function loadOneFilm(response) {
            return response.data;
        }


        function loadFilteredFilms(response) {
            return response.data;
        }

        function loadRecommended(response) {
            return response.data.results;
        }

        function loadOrdered(response) {
            return response.data;
        }

        function errorMessage() {
            console.log("Conection Failure");
        }
    }
})();
