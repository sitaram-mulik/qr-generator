#!/bin/bash

mongodump --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    toolFileName="mongodb-database-tools-debian12-x86_64-100.12.2.deb"
    echo "mongodump is not installed. Installing MongoDB Database Tools..."
    # https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-x86_64-100.12.2.deb
    curl -o $toolFileName https://fastdl.mongodb.org/tools/db/$toolFileName
    apt install ./$toolFileName
    rm $toolFileName
fi

