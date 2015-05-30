FROM ubuntu:14.04

# Install build tools for CouchDB.
# (from https://cwiki.apache.org/confluence/display/COUCHDB/Ubuntu)
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

RUN apt-get update && apt-get -y install \
    wget \
    build-essential \
    erlang-base-hipe \
    erlang-dev \
    erlang-manpages \
    erlang-eunit \
    erlang-nox \
    libicu-dev \
    libmozjs185-dev \
    libcurl4-openssl-dev

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Download CouchDB 1.6.1
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

RUN mkdir couchdb
WORKDIR couchdb/

RUN wget \
    http://mirrors.advancedhosters.com/apache/couchdb/source/1.6.1/apache-couchdb-1.6.1.tar.gz && \
    tar -zxvf apache-couchdb-1.6.1.tar.gz

# Build CouchDB
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

WORKDIR apache-couchdb-1.6.1/

RUN ./configure && \
    make && \
    make install

WORKDIR /
RUN rm -r couchdb/

# Configure CouchDB
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

COPY couchdb.ini /usr/local/etc/couchdb/local.ini

RUN adduser --disabled-login --disabled-password --no-create-home --gecos "" couchdb && \
    chown -R couchdb:couchdb /usr/local/var/lib/couchdb && \
    chown -R couchdb:couchdb /usr/local/var/log/couchdb && \
    chown -R couchdb:couchdb /usr/local/var/run/couchdb && \
    chown -R couchdb:couchdb /usr/local/etc/couchdb && \
    chmod 0770 /usr/local/var/lib/couchdb/ && \
    chmod 0770 /usr/local/var/log/couchdb/ && \
    chmod 0770 /usr/local/var/run/couchdb/ && \
    chmod 0770 /usr/local/etc/couchdb/*.ini && \
    chmod 0770 /usr/local/etc/couchdb/*.d && \
    ln -s /usr/local/etc/logrotate.d/couchdb /etc/logrotate.d/couchdb

# Must be set to secret values in production!
ENV COUCHDB_ADMIN_NAME admin
ENV COUCHDB_ADMIN_PASS password
ENV COUCHDB_LOG_LEVEL warning

COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Configure Docker container
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

EXPOSE 5984

USER couchdb

VOLUME /usr/local/var/lib/couchdb

ENTRYPOINT ["entrypoint.sh"]
