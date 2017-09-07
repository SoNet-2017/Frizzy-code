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
                    InsertEventoService.insertNewEvento(dati.manager, dati.nome_evento, //$scope.dati.nome_organizzatore,
                        dati.data_evento, dati.location_evento, dati.min_invitati, dati.max_invitati, dati.prezzo, dati.imgPath, dati.lista_necessita)
                };
        }])
    .controller('addEventoViewCtrl', ['$scope', '$rootScope', '$firebaseStorage','myService','Auth','$location',
        function($scope, $rootScope, $firebaseStorage, myService, Auth, $location) {
            $scope.dati = {};
            var ctrl = this;
            $rootScope.dati.currentView = 'addEvento';
            $scope.dati.manager = Auth.$getAuth().uid;
            $scope.dati.lista_necessita = [];
            $scope.dati.fileToUpload = null;
            $scope.dati.imgPath= "";

            //initialize the function that will be called when a new file will be specified by the user
            ctrl.onChange = function onChange(fileList) {
                $scope.dati.fileToUpload = fileList[0];
                console.log('Read file: '+$scope.dati.fileToUpload.name);
            };

            $scope.addEvento = function() {
                console.log('In addEvento');
                if ($scope.dati.fileToUpload !== null) {
                    var fileName = $scope.dati.fileToUpload.name;
                    //specify the path in which the file should be saved on firebase
                    var storageRef = firebase.storage().ref("eventiImg/" + fileName);
                    $scope.storage = $firebaseStorage(storageRef);
                    var uploadTask = $scope.storage.$put($scope.dati.fileToUpload);
                    console.log('Put ok');
                    uploadTask.$complete(function (snapshot) {
                        $scope.dati.imgPath = snapshot.downloadURL;
                        console.log('Load ok');
                        myService.inserNewEvento($scope.dati);
                        console.log('Upload complete imgPath: ' + $scope.dati.imgPath);
                        $location.path("#!/eventoView");
                    });
                    uploadTask.$error(function (error) {
                        console.log('Load not ok: '+error);
                        myService.inserNewEvento($scope.dati);
                        $location.path("#!/eventoView");
                    });
                }else{
                    myService.inserNewEvento($scope.dati);
                    $location.path("#!/eventoView");
                }
            };

            $scope.addWorker = function(){
                $scope.dati.lista_necessita.push($scope.itemAdd);
            };
            $scope.removeWorker = function(){
                $scope.dati.lista_necessita.splice( $scope.dati.lista_necessita.indexOf($scope.itemRemove), 1 );
            };
        }]);