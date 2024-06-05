import { Injectable, Logger } from '@nestjs/common';
import { S3Client, ListBucketsCommand, HeadBucketCommand, GetBucketLocationCommand } from '@aws-sdk/client-s3';
import { execSync } from 'child_process';

function exec(cmd: string): string {
    return execSync(cmd).toString().trim();
}

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    private readonly logger = new Logger(S3Service.name);
    constructor() {
        this.s3Client = new S3Client(); // Replace 'your-region' with your AWS region
    }

    async listBuckets(): Promise<string[]> {
        try {
            const res = JSON.parse(exec('aws s3api list-buckets'));
            //const data = await this.s3Client.send(new ListBucketsCommand({}));
            return res.Buckets.map(bucket => bucket.Name);
        } catch (error) {
            this.logger.error('Error listing buckets:', error);
            throw error;
        }
    }

    async bucketExists(bucketName: string): Promise<{ message: string }> {
        try {
            //await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
            exec(`aws s3api head-bucket --bucket ${bucketName}`);
            return { message: `Bucket ${bucketName} exists` };
        } catch (error) {
            this.logger.error('Error checking if bucket exists:', error);
            return { message: `Bucket ${bucketName} does not exist` };
        }
    }

    async getBucketDetails(bucketName: string): Promise<any> {
        try {
            //const headData = await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
            // Add more details if necessary
            const res = JSON.parse(exec(`aws s3api get-bucket-ownership-controls --bucket ${bucketName}`));
            return {
                Type: 'Bucket Ownership Control',
                Data: res,
            };
        } catch (error) {
            this.logger.error('Error getting bucket details:', error);
            return { error: error.message };

        }
    }
}
