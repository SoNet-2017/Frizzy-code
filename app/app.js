'use strict';

// Initialize the Firebase SDK
var config = {
    apiKey: "AIzaSyCqVP5fLNwraKgKpDA1GE-_3EFmL_Sf9tk",
    authDomain: "frizzy-db697.firebaseapp.com",
    databaseURL: "https://frizzy-db697.firebaseio.com",
    projectId: "frizzy-db697",
    storageBucket: "frizzy-db697.appspot.com",
    messagingSenderId: "437509073990"
};
firebase.initializeApp(config);

// Declare app level module which depends on views, and components
angular.module('myApp', [
    "firebase",
    'ngRoute',
    'myApp.eventoView',
    'myApp.evento',
    'myApp.loginView',
    'myApp.users',
    'myApp.usersListView',
    'myApp.chatView',
    'myApp.userProfileView',
    'myApp.addEventoView',
    'myApp.authentication',
    'myApp.userRegistrationView',
    'myApp.fileUpload'
])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/eventoView'});
    }])
    .run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/loginView");
            }
        });
    }])
    .controller('MainCtrl', ['$scope','$route', '$rootScope', '$firebaseAuth', function($scope,$route, $rootScope, $firebaseAuth) {
        //this controller only declares a function to get information about the user status (logged in / out)
        //it is used to show menu buttons only when the user is logged
        //set the variable that is used in the main template to show the active button
        $rootScope.dati = {};
        $rootScope.dati.currentView = 'NOW';
        $scope.changeView = function(view){
            $rootScope.dati.currentView = view;
            $route.reload();
        };
        $scope.isLogged = function()
        {
            if ($firebaseAuth().$getAuth())
                return true;
            else
                return false;
        }
    }]);