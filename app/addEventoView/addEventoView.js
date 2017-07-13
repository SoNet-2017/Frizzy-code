'use strict';

angular.module('myApp.addEventoView',['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/addEvento', {
                templateUrl: 'addEventoView/addEventoView.html',
                controller: 'addEventoViewCtrl',
                resolve: {
                    // controller will not be loaded until $requireSignIn resolves
                    // Auth refers to our $firebaseAuth wrapper in the factory below
                    "currentAuth": ["Auth", function(Auth) {
                        // $requireSignIn returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $routeChangeError (see above)
                        return Auth.$requireSignIn();
                    }]
                }
            })
    }]).service('myService', ['InsertEventoService', function (InsertEventoService) {
            this.inserNewEvento= function(dati){
                dati.feedback = "";
                    InsertEventoService.insertNewEvento(dati.nome_evento, //$scope.dati.nome_organizzatore,
                        dati.data_evento, dati.location_evento, dati.min_invitati, dati.max_invitati, dati.prezzo).then(function(ref) {
                        var eventoId = ref.key;
                        InsertEventoService.updateEvento(eventoId);
                        dati = {};
                        dati.feedback = "The event was successfully added";
                    })
                };
        }])
    .controller('addEventoViewCtrl', ['$scope', '$rootScope', '$firebaseStorage','myService',
        function($scope, $rootScope, $firebaseStorage, myService) {
            $rootScope.dati.currentView = 'addEvento';
            console.log( $rootScope.dati.currentView);
            $scope.dati = {};
            $scope.addEvento = function() {
                myService.inserNewEvento($scope.dati)
            }
        }]);