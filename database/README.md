# CouchDB Container

### Build

    docker build -t mfellner/couchdb:1.6.1 .

### Run

Create a data-only container [1]:

    docker run --name couchdb-data --entrypoint="echo" mfellner/couchdb:1.6.1

Run the database container:

    docker run --rm -p 5984:5984 --name couchdb --volumes-from couchdb-data mfellner/couchdb:1.6.1

[[1] https://stackoverflow.com/questions/18496940/how-to-deal-with-persistent-storage-e-g-databases-in-docker]()
