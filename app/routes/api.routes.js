var bodyParser = require('body-parser');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

// try changing the function from an anonymous one to a named one function myRoutes( app, express )
module.exports = function( app, express ) {
    var apiRouter = express.Router();

    /* ===========================================================
     route for authenticating users - use before middleware
     This is where we wll be creating the JSON Web Token and returning
     it to our user:
     1) Check to make sure a user with that username exists
     2) Check to make sure that the user has the correct password (by comparing their password to
     the hashed one saved in the database)
     3) Create a token if all is well
     (POST http://localhost:8080/api/authenticate)
     =========================================================== */
    // route to authenticate a user (POST HTTP://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function( req, res ) {
        console.log(req.body.username);

        // find the user
        // select the password explicitly since mongoose is not returning it by default
        User.findOne({
            username: req.body.username
        })

        .select('password')

        .exec(function( err, user ) {
            if ( err ) {
                throw err;
            }

            if ( !user ) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {
                //check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if ( !validPassword ) {
                    res.json({
                         success : false,
                         message : 'Authentication failed. Wrong password.'
                    });
                } else {
                    // if user is found and password is right create a token
                    jwt.sign(user, superSecret, {
                        expiresInMinutes: 1440 //expire in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });

    // route middleware to verify a token
    apiRouter.use(function( req, res, next ) {
        // do logging
        console.log('Somebody just came to our app');
        
        // check header or url parameters or post parameters for token
        var token = req.body.token ||  req.param('token') || req.headers['x-access-token'];
        
        // decode token
        if ( token ) {
            // verifies secret and checks exp
            jwt.verify(token, superSecret, function( err, decoded ) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {

                    req.decoded = decoded;
                }
            });
        } else {
            // if there is no token return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });
        }
        next(); // make sure we go to the next routes and don't stop here
    });

    // test route to make sure everything is working
    // accessed at GET http://localhost: 8080/api
    apiRouter.get('/', function( req, res ) {
        res.json({
            message: 'Hooray! Welcome to our API!'
        });
    });

    /* ===========================================================
     Returns an instance of a single route which can then be used
     to handle HTTP verbs with optional middleware.
     Using router.route() is a recommended approach to avoiding
     duplicate route naming and thus typo errors.
     =========================================================== */
    apiRouter.route('/users')
        .post(function( req, res ) {
             // create a new instance of the User model
             var user = new User(); // create a new instance of the User model
             user.name = req.body.name; // set the user's name from the request
             user.username = req.body.username; // set user's name from request
             user.password = req.body.password; // set user's password from request
             user.save(function( err ) {
                 if ( err ) {
                     res.send(err);
                 }
             });
        })
        .get(function( req, res ) {
            User.find(function( err, users ) {
                if ( err ) {
                    res.send(err);
                }

                /* ===========================================================
                 Send a JSON response. This method is identical to res.send()
                 when an object or array is passed. However, it may be used for
                 explicit JSON conversion of non-objects, such as null,
                 undefined, etc. (although these are technically not valid JSON).
                 =========================================================== */
                // return the users
                res.json(users);
            });
        });

    apiRouter.route('/users/:user_id')
        // get the user with the id
        .get(function( req, res ) {
            User.findById(req.params.user_id, function(err, user) {
                if ( err ) {
                    res.send(err);
                }

                res.json(user);
            });
        })
        .put(function( req, res ) {
            User.findById(req.params.user_id, function( err, user ) {
                if ( err ) {
                    res.send(err);
                }
                if ( req.body.name ) {
                    user.name = req.body.name;
                }
                if (req.body.username) {
                    user.username = req.body.username;
                }
                if ( req.user.password ) {
                    user.password = req.body.password;
                }

                // save the user
                user.save(function( err ) {
                    if ( err ) {
                        res.send(err);
                    }
                    // return the user
                    res.json({
                        message: 'User updated!'
                    });
                });

            });
        })
        .delete(function( req, res ) {
            User.remove({
                _id : req.params.user_id
            }, function( err, user ) {
                if ( err ) {
                    res.send(err);
                }
                res.json({
                    message : 'Successfully deleted' + req.body.name
                });
            });
        });

    return apiRouter;
};

/* ===========================================================
 /api/users             GET      Get all the users
 /api/users             POST     Create a user
 /api/users/:user_id    GET      Get a single user
 /api/users/:user_id    PUT      Update a user with new info
 /api/users/:user_id    DELETE   Delete a user
 =========================================================== */
