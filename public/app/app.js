/* =============================================================================================
    This is a high level overview of our entire application. We are bringing in:
    • ngAnimate to add animations to all of our Angular directives (specifically ngShow/ngHide)
    • appRoutes will be the routing for our application
    • authorizationService is the service file created in chapter 16
    • mainCtrl will be a brand new controller we create that will encompass our main view
    • userCtrl will have the controllers for all our user management pages
    • userService is the service file created in chapter 15
============================================================================================= */
angular.module('userApp', [
    'ngAnimate',
    'ngRoute'
]);
