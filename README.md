# maximilianfellner.eu 2

Personal website of Maximilian Fellner.

## Development

Install dependencies:

```
npm install
```

Build static files:

```
gulp build
```

Start with live reloading:

```
gulp run
```

The web service should now be running on [http://localhost:3000]().

## Deployment

#### Static web content

    gulp build --production

#### Docker with gulp

    gulp docker:run:db
    gulp docker:run:app

#### Docker manually

    docker build -t mfellner/couchdb:1.6.1 couchdb
    docker build -t mfellner/maximilianfellner.eu:0.1.0 maximilianfellner.eu

    docker run --rm -p 5984:5984 --name couchdb mfellner/couchdb:1.6.1
    docker run --rm -p 3000:3000 --name maximilianfellner.eu --link couchdb:couchdb \
    -e "COUCHDB_PUBLIC_ADDR=http://192.168.59.103:5984" \
    mfellner/maximilianfellner.eu:0.1.0

`COUCHDB_PUBLIC_ADDR` is the *public* address of the CouchDB instance.

*Copyright 2015 Maximilian Fellner. All rights reserved.*
