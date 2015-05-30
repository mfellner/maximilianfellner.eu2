FROM ubuntu:15.04

# Install system tools
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update && apt-get -y install \
    wget \
    python \
    build-essential

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Node
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ENV NODE_VERSION 0.12.4

RUN wget https://nodejs.org/dist/latest/node-v${NODE_VERSION}-linux-x64.tar.gz

RUN tar --strip-components 1 -xzf *-linux-x64.tar.gz -C /usr/local

RUN rm *-linux-x64.tar.gz

RUN npm install -g npm@latest

# Configure system
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

RUN adduser --disabled-login --disabled-password --gecos "" node

# Install application dependencies
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

COPY package.json /home/node/package.json

WORKDIR /home/node

RUN npm install --production

# Add source files
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

COPY build/ /home/node/build/
COPY static/ /home/node/static/

# Set permissions
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

RUN chown -R node:node /home/node && \
    chmod -R 0770 /home/node

# Configure Docker container
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ENV NODE_ENV production
ENV APP_PORT 3000
ENV STATIC_DIR ./build/client
ENV COUCHDB_NAME content
ENV COUCHDB_PORT_5984_TCP_PROTO http

USER node

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
