const packageInfo = require('../package.json');
const credentials = require('../credentials');
const snoowrap = require("snoowrap");

exports.client = new snoowrap({
    userAgent: "alexa:client-tales:v" + packageInfo.version,
    clientId: credentials.clientID,
    clientSecret: credentials.clientSecret,
    username: credentials.username,
    password: credentials.password
});