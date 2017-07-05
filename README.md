## Pizza++ with Firebase (AngularFire) ##

1. Open your project (imported from [https://github.com/SoNet-2017/angularjs-lab7/releases/tag/SoluzioneEs2](https://github.com/SoNet-2017/angularjs-lab7/releases/tag/SoluzioneEs2)

2. Go in the folder /data and open the file pizza.json

3. Modify the structure to have something similar to this one:
    ```
    {
        "pizzas":
        {
            "amiciNostriDiavola":
            {
                "id" : "amiciNostriDiavola",
                "nome_pizza" : "Diavola",
                "nome_pizzeria" : "Amici Nostri",
                "img_url" : "images/amici-nostri-diavola.jpg",
                "img_alt" : "Diavola di Amici Nostri"
            },
            "amiciNostriMargherita":
            {
                "id" : "amiciNostriMargherita",
                "nome_pizza" : "Margherita",
                "nome_pizzeria" : "Amici Nostri",
                "img_url" : "images/amici-nostri-margherita.jpg",
                "img_alt" : "Margherita di Amici Nostri"
            },
            ...
        }
    }
    ```

4. Save the file

5. Open your browser and connect to Firebase (on [http://firebase.com](http://firebase.com))

6. Create new project

7. Open the view "Database" and import data you created at point 3

8. Go in the "Rules" tab and modify the access rules to:
    ```
    {
      "rules": {
        ".read": true,
        ".write": "auth != null"
      }
    }
    ```

9. Press "Publish"

10. Come back to WebStorm

11. Add the Firebase and AngularFire libraries to index.html
    ```
    <!-- Firebase -->
    <script src="https://www.gstatic.com/firebasejs/3.6.6/firebase.js"></script>

    <!-- AngularFire -->
    <script src="https://cdn.firebase.com/libs/angularfire/2.3.0/angularfire.min.js"></script>
    ```

12. Initialize firebase in app.js by adding the following code at the beginning (after "user 'strict'")
    ```
    // Initialize the Firebase SDK
      var config = {
        apiKey: '<your-api-key>',
        authDomain: '<your-auth-domain>',
        databaseURL: '<your-database-url>',
        storageBucket: '<your-storage-bucket>'
      };
      firebase.initializeApp(config);
    ```

13. Now it's time to substitute the keys with yours: connect to firebase.com and enter your project. Then click on the gear icon to access project settings and click on "Add Firebase to your web app"

14. Come back to WebStorm and paste the code obtained on the Firebase website

15. Edit the `Pizza` service to get all pizzas from the Firebase app instance.
    ```
    angular.module(...).factory('Pizza', function($firebaseArray) {
        var pizzaService = {
           getData: function () {
               var ref = firebase.database().ref().child("pizzas");
               // download the data into a local object
               return $firebaseArray(ref);
           }
        };
        return pizzaService;
    });
    ```

16. Call the `getPizzas()` function from the `eventoView.js` controller instead of the "old" service:
    ```
    angular.module(...) ... .controller('View1Ctrl', ['$scope','Pizza',function($scope,Pizza) {
        $scope.dati={};
        $scope.dati.pizzas = Pizza.getData();
    }]);
    ```

17. Update the `SinglePizza` service to get single pizza information from the Firebase app instance.
    ```
    angular.module(...).factory('SinglePizza', function($firebaseObject) {
       var singlePizzaService = {
           getSinglePizza: function (pizzaId) {
               var ref = firebase.database().ref().child("pizzas").child(pizzaId);
               // download the data into a local object
               return $firebaseObject(ref);
           }
       };
       return singlePizzaService;
    });
    ```

18. Consequently, call the `getSinglePizza()` function from the `detailsView.js` controller.
    ```
    angular.module(...).controller('detailsViewCtrl', ['$scope', '$routeParams', 'SinglePizza',
        function($scope, $routeParams, SinglePizza) {
            $scope.dati = {};
            $scope.dati.pizza = SinglePizza.getSinglePizza($routeParams.pizzaId);
        }]);
