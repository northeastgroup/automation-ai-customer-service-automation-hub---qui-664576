```javascript
const zapier = require('zapier-platform-core');

const authentication = require('./authentication');
const triggers = require('./triggers');
const actions = require('./actions');
const searches = require('./searches');

const App = {
  version: require('./package.json').version,
  platformVersion: zapier.version,
  
  authentication: authentication,

  beforeRequest: [
    (request, z, bundle) => {
      if (bundle.authData.accessToken) {
        request.headers.Authorization = `Bearer ${bundle.authData.accessToken}`;
      }
      return request;
    },
  ],

  afterResponse: [
    (response, z, bundle) => {
      if (response.status === 401) {
        throw new z.errors.RefreshAuthError();
      }
      return response;
    },
  ],

  resources: {},

  triggers: triggers,

  actions: actions,

  searches: searches,
  
  onError: [
    (response, z, bundle) => {
      if (response.status !== 200) {
        z.console.log(`Error encountered: ${response.content}`);
        throw new z.errors.HaltedError('The app has halted due to an error');
      }
      return response;
    },
  ],
};

module.exports = App;
```

Please note that this is a basic structure of a Zapier CLI application. The actual implementation of the `authentication`, `triggers`, `actions`, and `searches` would depend on the specific APIs of the services you are integrating with (Zendesk, Intercom, Slack, Salesforce Service Cloud, and social media platforms). The `onError` method is used for error handling. The `beforeRequest` and `afterResponse` methods are used for adding the authentication token to the request and handling authentication errors respectively.