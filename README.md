# Playlists Mixer - Haboob Labs

Small tool to mix spotify playlists

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone git@github.com:haboob-app/labs-playlists-mixer.git` this repository
* `cd labs-playlists-mixer`
* `npm install`
* `bower install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying Staging

Run this command to deploy and activate last version in Amazon - staging environment
```
ember deploy staging --activate=true
```

Run the next commands to deploy in Amazon - staging environment
```
ember deploy staging
```

Copy the revision number returned after run ember deploy:list
```
ember deploy:list staging

-   timestamp           | revision
- =================================
- > 2017/03/18 18:25:19 | 518159da83e5b4f935e3c7d6073f2e97  
```

Activate the last version
```   
ember deploy:activate staging --revision=518159da83e5b4f935e3c7d6073f2e97
```  
### Release

Run this command to release a production version. This will create a tag and then run ember deploy to production environment.

```
ember release
```

Please check https://github.com/lytics/ember-cli-release for more details.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
