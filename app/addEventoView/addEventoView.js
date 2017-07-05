'use strict';

angular.module('myApp.addEventoView', ['ngRoute'])

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
    }])
    .controller('addEventoViewCtrl', ['$scope', '$rootScope', 'InsertEventoService', '$firebaseStorage',
        function($scope, $rootScope, InsertEventoService, $firebaseStorage) {
            //initialize variables
            $scope.dati = {};
            //set the variable that is used in the main template to show the active button
            $rootScope.dati.currentView = "addEvento";
            $scope.dati.feedback = "";
            var ctrl = this;
            $scope.fileToUpload = null;
            $scope.imgPath= "";
            //define the function that will actually create a new record in the database
            $scope.addEvento = function() {
                //check if the user inserted all the required information
                if ($scope.dati.address!= undefined && $scope.dati.address!="" && $scope.dati.nome_evento!= undefined && $scope.dati.nome_evento!="" && $scope.dati.nome_organizzatore!=undefined && $scope.dati.nome_organizzatore!="") {
                    $scope.dati.error = "";
                    //try to upload the image: if no image was specified, we create a new event without an image
                    if ($scope.fileToUpload != null) {
                        //get the name of the file
                        var fileName = $scope.fileToUpload.name;
                        //specify the path in which the file should be saved on firebase
                        var storageRef = firebase.storage().ref("eventiImg/" + fileName);
                        $scope.storage = $firebaseStorage(storageRef);
                        var uploadTask = $scope.storage.$put($scope.fileToUpload);
                        uploadTask.$complete(function (snapshot) {
                            $scope.imgPath = snapshot.downloadURL;
                            $scope.finalEventoAddition();
                        });
                        uploadTask.$error(function (error) {
                            $scope.dati.error = error + " - the Event will be added without a descriptive image!";
                            //add the event in any case (without the image)
                            $scope.finalEventoAddition();
                        });
                    }
                    else {
                        //do not add the image
                        $scope.finalEventoAddition();

                    }
                }
                else
                {
                    //write an error message to the user
                    $scope.dati.error = "You forgot to insert one of the required information!";
                }
            };
            //initialize the function that will be called when a new file will be specified by the user
            ctrl.onChange = function onChange(fileList) {
                $scope.fileToUpload = fileList[0];
            };
            //function that will create the new record (with the event) in the Firebase storage
            $scope.finalEventoAddition = function()
            {
                InsertEventoService.insertNewEvento($scope.dati.address, $scope.dati.nome_evento, $scope.dati.nome_organizzatore, $scope.imgPath).then(function(ref) {
                    var eventoId = ref.key;
                    InsertEventoService.updateEvento(eventoId);
                    $scope.dati.feedback = "The event was successfully added";
                    $scope.dati.address = "";
                    $scope.dati.nome_evento = "";
                    $scope.dati.nome_oranizzatore = "";
                });
            }
        }]);