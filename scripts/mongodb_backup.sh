#!/bin/bash

MONGO_HOST="localhost"
MONGO_PORT="27017"
DATABASE_NAME="cag"
S3_BUCKET_NAME="ullasasindhur"
AWS_REGION="us-east-1"
RETENTION_DAYS=3
BACKUP_DIR="/tmp/mongodb_backup"
DATE_FORMAT=$(date +%d-%m-%Y)
BACKUP_FILENAME="${DATABASE_NAME}_backup_${DATE_FORMAT}.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"
S3_FULL_PATH="s3://${S3_BUCKET_NAME}/${BACKUP_FILENAME}"
FILE_DELETE_DATE=$(date -d "-${RETENTION_DAYS} days" +%d-%m-%Y)
BACKUP_DELETE_FILENAME="${DATABASE_NAME}_backup_${FILE_DELETE_DATE}.gz"
S3_DELETE_PATH="s3://${S3_BUCKET_NAME}/${BACKUP_DELETE_FILENAME}"

# mongorestore --host "${MONGO_HOST}" --port "${MONGO_PORT}" --db "${DATABASE_NAME}" --gzip --archive="${BACKUP_PATH}"
# if [ $? -ne 0 ]; then
#     echo "Error: Restore to backup ${BACKUP_PATH} data has failed."
#     exit 1
# fi

mkdir -p "${BACKUP_DIR}"
if [ $? -ne 0 ]; then
    echo "Error: Failed to create backup directory ${BACKUP_DIR}."
    exit 1
fi

mongodump --host "${MONGO_HOST}" --port "${MONGO_PORT}" --db "${DATABASE_NAME}" --gzip --archive="${BACKUP_PATH}"
if [ $? -ne 0 ]; then
    echo "Error: mongodump failed. Please check MongoDB connection details and permissions."
    exit 1
fi

aws s3 cp "${BACKUP_PATH}" "${S3_FULL_PATH}" --region "${AWS_REGION}"
if [ $? -ne 0 ]; then
    echo "Error: Failed to upload backup to S3. Ensure AWS CLI is configured and credentials are valid."
    exit 1
fi

rm -rf "${BACKUP_DIR}"
if [ $? -ne 0 ]; then
    echo "Error: Failed to delete local backup directory ${BACKUP_DIR}."
    exit 1
fi

aws s3 rm "${S3_DELETE_PATH}" --region "${AWS_REGION}"
if [ $? -ne 0 ]; then
    echo "Error: Failed to delete old backup from S3. Ensure the file exists and AWS CLI is configured correctly."
    exit 1
fi
