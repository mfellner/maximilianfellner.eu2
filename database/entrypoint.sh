#!/usr/bin/env bash

readonly COUCHDB_INI="/usr/local/etc/couchdb/local.ini"

printf "\n[log]\nlevel = $COUCHDB_LOG_LEVEL\n" \
>> $COUCHDB_INI

printf "\n[admins]\n$COUCHDB_ADMIN_NAME = $COUCHDB_ADMIN_PASS\n" \
>> $COUCHDB_INI

couchdb
