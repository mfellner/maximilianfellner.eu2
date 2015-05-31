# maximilianfellner.eu 2 [![Build Status](https://travis-ci.org/mfellner/maximilianfellner.eu2.svg?branch=master)](https://travis-ci.org/mfellner/maximilianfellner.eu2) [![Circle CI](https://circleci.com/gh/mfellner/maximilianfellner.eu2.svg?style=svg)](https://circleci.com/gh/mfellner/maximilianfellner.eu2)

Personal website of Maximilian Fellner.

## Development

Build:

    npm install
    gulp build

Test:

    npm test

Start with live reloading:

    gulp run:watch

The web service should now be running on [http://localhost:3000]().

## Testing

    npm test
    
#### Run tests against Docker

    docker-compose up
    MOCHA_DOCKER=true APP_PUBLIC_ADDR=http://192.168.59.103:3000 npm test

*APP_PUBLIC_ADDR* is the address of the app's Docker container on the local host.

## Deployment

#### Build server and client code

    gulp build --production

#### Docker with gulp

    gulp docker:run

#### Docker with docker-compose

    export COUCHDB_ADMIN_NAME="admin"
    export COUCHDB_ADMIN_PASS="password"
    export COUCHDB_PUBLIC_ADDR="http://192.168.59.103:5984"

    gulp build --production
    docker-compose up

*COUCHDB_PUBLIC_ADDR* is the address of the database's Docker container on the local host.

#### Docker manually

    docker build -t mfellner/couchdb:1.6.1 couchdb
    docker build -t mfellner/maximilianfellner.eu:0.1.0 maximilianfellner.eu

    docker run --rm -p 5984:5984 --name couchdb mfellner/couchdb:1.6.1
    docker run --rm -p 3000:3000 --name maximilianfellner.eu
        --link couchdb:couchdb \
        -e "COUCHDB_PUBLIC_ADDR=http://192.168.59.103:5984" \
        mfellner/maximilianfellner.eu:0.1.0

`COUCHDB_PUBLIC_ADDR` is the *public* address of the CouchDB instance.

*Copyright 2015 Maximilian Fellner. All rights reserved.*
