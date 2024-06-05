import { Injectable, Logger } from '@nestjs/common';
import { S3Client, ListBucketsCommand, HeadBucketCommand, GetBucketLocationCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    private readonly logger = new Logger(S3Service.name);
    constructor() {
        this.s3Client = new S3Client(); // Replace 'your-region' with your AWS region
    }

    async listBuckets(): Promise<string[]> {
        try {
            const data = await this.s3Client.send(new ListBucketsCommand({}));
            return data.Buckets.map(bucket => bucket.Name);
        } catch (error) {
            this.logger.error('Error listing buckets:', error);
            throw error;
        }
    }

    async bucketExists(bucketName: string): Promise<boolean> {
        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
            return true;
        } catch (error) {
            if (error.name === 'NotFound') {
                return false;
            }
            this.logger.error('Error checking if bucket exists:', error);
            throw error;
        }
    }

    async getBucketDetails(bucketName: string): Promise<any> {
        try {
            const headData = await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
            // Add more details if necessary
            return {
                BucketName: bucketName,
                BucketData: headData,
            };
        } catch (error) {
            this.logger.error('Error getting bucket details:', error);
            return { error: error.message };

        }
    }
}
