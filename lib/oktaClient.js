const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
	orgUrl: 'https://dev-858900.oktapreview.com',
	token: '00Mg6j_Af6mMX13DrBTF0Si6X_8kDayK_-3pxkN1hW'
});

module.exports = client;