angular.module('userApp')

    .controller('mainController', function( $rootScope, $location, Authorization ) {

                    var vm = this;

                    // get info if a person is logged in
                    vm.isLoggedIn = Authorization.isLoggedIn();

                    /*
                     Using $scope.$emit will fire an event up the $scope.
                     Using $scope.$broadcast will fire an event down the $scope.
                     Using $scope.$on is how we listen for these events.
                     check to see if a user is logged in on every request
                     $on is part of the Angular event system
                     */
                    $rootScope.$on('$routeChangeStart', function() {
                        vm.loggedIn = Authorization.isLoggedIn();
                    });

                    // get user information on page load
                    Authorization.getUser()

                        .then(function( data ) {
                                     vm.user = data;
                                 });

                    // function to handle the login form
                    vm.doLogin = function() {

                        vm.processing = true;

                        /*
                        Need to try the code with this block to see if Angular
                        takes care of the declaration for"loginData"
                        */
                        vm.loginData = {
                            username: '',
                            password: ''
                        };

                        // clear the error
                        vm.error = '';

                        // call the Authorization.login() function
                        Authorization.login(vm.loginData.username, vm.loginData.password)
                            .success(function( data ) {
                                         vm.processing = false;

                                         // get user information on page load
                                         Authorization.getUser()
                                             .then(function( data ) {
                                                       vm.user = data.data;
                                                   });

                                         // if a user successfully logs in, redirect to the users page
                                         if ( data.success ) {
                                             $location.path('/users');
                                         }
                                         else {
                                             vm.error = data.message;
                                         }
                                     });
                    };

                    vm.doLogout = function() {
                        Authorization.logout();
                        $location.path('/');
                    };
                });
