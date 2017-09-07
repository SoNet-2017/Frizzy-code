'use strict';

angular.module('myApp.userProfileView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/userProfileView', {
    templateUrl: 'userProfile/userProfileView.html',
    controller: 'userProfileCtrl',
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

.controller('userProfileCtrl', ['$scope', '$rootScope', 'UsersChatService', 'Users', 'currentAuth', '$firebaseAuth', '$location', 'Evento', '$route',
function($scope, $rootScope, UsersChatService, Users, currentAuth, $firebaseAuth, $location, Evento, $route) {
    $scope.dati={};
    if (!['CLIENTE','MANAGER','WORKER'].includes($rootScope.dati.currentView)){
        $rootScope.dati.currentView = "CLIENTE";}
    console.log( $rootScope.dati.currentView);
    $scope.dati.user = UsersChatService.getUserInfo(currentAuth.uid);
    $scope.dati.eventi = Evento.getData();
    $scope.global = $rootScope;
    // function called when the "logout" button will be pressed
    $scope.logout = function () {

        //save the new status in the database (we do it before the actual logout because we can write in the database only if the user is logged in)
        Users.registerLogout(currentAuth.uid);
        //sign out
        $firebaseAuth().$signOut();
        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                console.log("User is yet signed in as:", firebaseUser.uid);
            } else {
                $location.path("/loginView");
            }
        });


    };

    $scope.changeView = function(view){
        $rootScope.dati.currentView = view;
        console.log($scope.global.dati.currentView);
        $route.reload();
    };
}]);