angular.module('userApp')

    .config(function( $routeProvider, $locationProvider ) {
                $routeProvider
                    .when('/', {
                              templateUrl : '/app/views/home.html'
                          })
                    // login page
                    .when('/login', {
                              templateUrl  : '/app/views/login.html',
                              controller   : 'mainController',
                              controllerAs : 'login'
                          });

                   /* // show all users
                    .when('/users', {
                              templateUrl  : 'app/views/users/all.html',
                              controller   : 'userController',
                              controllerAs : 'user'
                          })

                    // form to create a new user
                    // same view as edit page
                    .when('/users/create', {
                              templateUrl  : 'app/views/users/single.html',
                              controller   : 'userCreateController',
                              controllerAs : 'user'
                          })

                    // page to edit a user
                    .when('/users/:user_id', {
                              templateUrl  : 'app/views/users/single.html',
                              controller   : 'userEditController',
                              controllerAs : 'user'
                          })
                    .otherwise({
                                   template : 'This page does not exist'
                               });*/
                // get rid of the hash in the URL
                $locationProvider.html5Mode(true);
            });
