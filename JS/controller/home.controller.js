(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['FilmProvider', 'UserProvider', 'RatingsProvider','$sce'];

    /* @ngInject */
    function HomeController(FilmProvider, UserProvider, RatingsProvider, $sce) {
        var homeCtrl = this;
        homeCtrl.property = 'HomeController';


        homeCtrl.genres = [];
        homeCtrl.movies = [];
        homeCtrl.movie = {};
        homeCtrl.filter = {
            year: "",
            val: "",
            genres: [],
        };
        homeCtrl.ratings = [];
        homeCtrl.modalStatus = "off";
        homeCtrl.upcomingStatus = "off";
        homeCtrl.marked = false;
        homeCtrl.orders =[
        {
            id: 1,
            title: 'Year Asc',
            reverse: false,
            method:'release_date.asc,'
        },
        {
            id: 2,
            title: 'Year Desc',
            reverse: true,
            method:'release_date.desc',
        },
        {
            id: 3,
            title: 'Valoration Asc',
            reverse: false,
            method:'vote_average.asc',
        },
        {
            id: 4,
            title: 'Valoration Desc',
            reverse: true,
            method:'vote_average.desc',
        }
    ];

        homeCtrl.order = homeCtrl.orders[0];
        homeCtrl.page=1;
        homeCtrl.query="";
        var movieCopy = {};
        var moviesCopy = [];




        homeCtrl.getDiscFilms = getDiscFilms;
        homeCtrl.getSearch = getSearch;
        homeCtrl.getProxFilms = getProxFilms;
        homeCtrl.getFilterFilms = getFilterFilms;
        homeCtrl.clearFilter = clearFilter;
        homeCtrl.getInfo = getInfo;
        homeCtrl.modalOn = modalOn;
        homeCtrl.addgenre = addgenre;
        homeCtrl.loadMovie = loadMovie;
        homeCtrl.isSelected = isSelected;
        homeCtrl.youtubeUrl = youtubeUrl;
        homeCtrl.getOrder = getOrder;


        activate();

        ////////////////

        function activate() {
            FilmProvider.getDiscoverFilms().then(displayMovies, error);
            FilmProvider.getGenres().then(displayGenres, error);

        }

        function displayMovies(movies) {
            console.log(movies);
            homeCtrl.movies = movies;
        }

        function displayGenres(genres) {
            for (var i = 0; i < genres.length; i++) {
                if (genres[i].name == "película de la televisión") {
                    genres[i].name = "TV movies";
                }
            }

            homeCtrl.genres = genres;
        }

        function displayMovie(movie) {

            setTimeout(function(){homeCtrl.movie = movie;; }, 1000);
            console.log(movie);
            homeCtrl.movie = movie;
        }

        function getDiscFilms(page) {
            FilmProvider.getDiscoverFilms(page).then(displayMovies, error);
        }

        function getProxFilms() {
            FilmProvider.getUpcomingFilms().then(displayMovies, error)
        }

        function getSearch() {
            if (homeCtrl.query == "") {
                getDiscFilms();
            } else {
                FilmProvider.getSearchedFilms(homeCtrl.query,homeCtrl.page).then(displayMovies, error);
            }
        }

        function getFilterFilms(filter) {
            FilmProvider.getFilteredFilms(filter).then(displayMovies, error);
        }

        function getInfo(id) {
            FilmProvider.getOneFilm(id).then(loadMovie, error).then(FilmProvider.getRecommended, error).then(loadRecom, error).then(displayMovie, error);
//.then(RatingsProvider.getRating, error).then(loadRatings, error)
        }

        function getOrder(method){
            FilmProvider.getOrdered(method,homeCtrl.filter).then(displayMovies,error);
        }

        function loadMovie(movie) {
            homeCtrl.movie = {};
            var arrayDate = movie.release_date.split("-");

            for (var i = 0; i < movie.genres.length; i++) {
                if (movie.genres[i].name == "película de la televisión") {
                    movie.genres[i].name = "TV movies";
                }
            }
            if (movie.videos.results.length != 0) {
                movie.youtubeUrl=  "https://www.youtube.com/embed/"+movie.videos.results[0].key;
                console.log(movie.youtubeUrl);

            }
            movie.year = arrayDate[0];
            movieCopy = movie;
            return movie;
        }

        function loadRatings(ratings) {
            var imdbRating = ratings[0].Value.split("/");
            ratings[0].Value=imdbRating[0];
            homeCtrl.ratings = ratings;
            movieCopy.ratings = ratings;
            return movieCopy;
        }

        function loadRecom(recommendations) {
            movieCopy.recommendations = recommendations;
            return movieCopy;
        }

        function modalOn() {
            homeCtrl.modalStatus = 'on'
        }

        function addgenre(id) {
            if (homeCtrl.filter.genres.length == 0) {
                homeCtrl.filter.genres.push(id);
            } else {
                for (var i = 0; i < homeCtrl.filter.genres.length; i++) {
                    if (homeCtrl.filter.genres[i] == id) {
                        homeCtrl.filter.genres.splice(i, 1);
                        return;
                    }
                }
                homeCtrl.filter.genres.push(id);
            }
        }

        function isSelected(id) {

            if (homeCtrl.filter.genres.indexOf(id) != -1) return true
            else return false

        }

        function youtubeUrl(url){

            return $sce.trustAsResourceUrl(url);
        }

        function clearFilter() {
            getDiscFilms();
            homeCtrl.filter = {
                year: "",
                val: "",
                genres: []
            }
        }

        function error() {
            console.log("Controller Error");

        }




           $(window).scroll(function () {

                if(Math.floor($(window).scrollTop() + $(window).height()) == Math.floor($(document).height()*0.9 + 1)) {
                if(homeCtrl.query != ""){
                homeCtrl.page++;
                FilmProvider.getSearchedFilms(homeCtrl.query,homeCtrl.page).then(loadNextPage,error).then(displayMovies,error);

            } else if(homeCtrl.upcomingStatus == 'on'){
                homeCtrl.page++;
                FilmProvider.getUpcomingFilms(homeCtrl.page).then(loadNextPage,error).then(displayMovies,error);


           }else{
               homeCtrl.page++;
               FilmProvider.getDiscoverFilms(homeCtrl.page).then(loadNextPage,error).then(displayMovies,error);
           }
                }

    });



        function loadNextPage(movies){
            for(var i = 0; i<movies.results.length;i++){
                homeCtrl.movies.results.push(movies.results[i]);
            }
            moviesCopy = homeCtrl.movies;
            console.log(moviesCopy);
            return moviesCopy;
        }


    }
})();
