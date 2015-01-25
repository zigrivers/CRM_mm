angular.module('userApp')

// ===================================================
// authorization factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================

.factory('Authorization', function( $http, $q, AuthorizationToken ) {

    // create an authorization factory object
    var authorizationFactory = {};

    authorizationFactory.login = function( username, password ) {

        // return the promise object and its data
        return $http.post('/api/authenticate', {
            username: username,
            password: password
        })

            .success(function( data ) {
               AuthorizationToken.setToken(data.token);
               return data;
            });
    };

    // log a user out by clearing the token
    authorizationFactory.logout = function() {
        // clear the token
        AuthorizationToken.setToken();
    };

    // check if a user is logged in and check if there is a local token
    authorizationFactory.isLoggedIn = function() {
        /* Old code
        if ( AuthorizationToken.getToken() ) {
            return true;
        } else {
            return false;
        }
        */
        return AuthorizationToken.getToken();
    };

    // get the logged in user
    authorizationFactory.getUser = function() {
        if ( AuthorizationToken.getToken() ) {
            return $http.get('/api/me');
        } else {
            return $q.reject({
                message: 'User has no token.'
            });
        }
    };

    // return the authorization factory object
    return authorizationFactory;
})

// ==================================================
// factory for handling tokens
// inject $window to store token client-side
// ==================================================
.factory('AuthorizationToken', function( $window ) {
    var authorizationTokenFactory = {};

    // get teh token out of local storage
    authorizationTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    // function to set token or clear token
    // if a token is passed, set the token
    // if there is no token, clear it from local storage (server-side)
    authorizationTokenFactory.setToken = function( token ) {
        if ( token ) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    };

    return authorizationTokenFactory;
})

// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthorizationInterceptor', function( $q, $location, AuthorizationToken ) {

    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = function( config ) {

        // grab the token
        var token = AuthorizationToken.getToken();

        // if the token exists, add it to the header as x-access-token
        if ( token ) {
            config.headers['x-access-token'] = token;
        }

        return config;
    };

    interceptorFactory.responseError = function( response ) {

        // if our server returns a 403 forbidden response
        if ( response.status == 403 ) {
            $location.path('login');
        }

        return $q.reject(response);
    };
});