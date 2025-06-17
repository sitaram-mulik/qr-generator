import cron from 'node-cron';
import { s3, PutObjectCommand, DeleteObjectCommand } from './s3.js';
import shell from 'shelljs';
import fs from 'fs';
import path from 'path';

const backupDirectory = process.env.BACKUP_DIRECTORY || path.join(process.cwd(), 'backups');
const currentDate = getDateXDaysBack(0);
const backupFileName = 'db-backup-' + currentDate + '.gz';
const backupPath = path.join(backupDirectory, backupFileName);
const S3_BUCKET = process.env.AWS_S3_BUCKET;

function getDateXDaysBack(numOfDays) {
    const date = new Date();
    date.setDate(date.getDate() - numOfDays);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

async function createBackup() {
    try {
        if (!fs.existsSync(backupDirectory)) {
            fs.mkdirSync(backupDirectory, { recursive: true });
        }
        const mongodumpCommand = `mongodump --host "${process.env.MONGODB_HOST}" --port "${process.env.MONGODB_PORT}" --db "${process.env.MONGODB_DB}" --gzip --archive="${backupPath}"`;
        if (shell.exec(mongodumpCommand).code !== 0) {
            throw new Error('MongoDB dump failed');
        }
    } catch (error) {
        console.log('MongoDB create backup error: ', error);
    }
    return;
}

async function uploadBackup() {
    try {
        await s3.send(
            new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: `backups/${backupFileName}`,
                Body: fs.createReadStream(backupPath)
            })
        );
    } catch (error) {
        console.log('Error uploading backup to S3:', error);
    }
    return;
}

async function deleteBackup() {
    const expiryDate = getDateXDaysBack(process.env.DB_BACKUP_RETENTION_DAYS);
    const expiredFileName = `db-backup-${expiryDate}.gz`;
    try {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: `backups/${expiredFileName}`
            })
        );
    } catch (error) {
        console.log('Error deleting backup from S3:', error);
    }
    return;
}

async function deleteLocalBackup() {
    try {
        if (fs.existsSync(backupPath)) {
            fs.unlinkSync(backupPath);
        }
    } catch (error) {
        console.log('Error deleting local backup:', error);
    }
    return;
}

async function cronjob() {
    cron.schedule('0 0 * * *', async () => {
        try {
            await createBackup();
            await uploadBackup();
            await deleteBackup();
            await deleteLocalBackup();
            console.log('Backup process completed successfully.');
        } catch (error) {
            console.error('Error running backup:', error);
        }
    });
}

module.exports = {
    cronjob
};