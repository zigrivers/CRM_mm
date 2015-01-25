/**
 * We are just moving configuration variables into this file. This helps since we can set variables like
 * environment, database settings, and other application specific settings..
 */

module.exports = {
    'port':process.env.PORT || 8080,
    'database':'mongodb://localhost:27017/myDatabaseForCRM',
    'secret':'learningtoprogramrightnow'
};
