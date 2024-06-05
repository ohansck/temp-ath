import { Module } from '@nestjs/common';
import { AWSService } from './aws.service';
import { AWSController } from './aws.controller';
import { DynamoDBService } from './dynamo.service';
import { SNSService } from './sns.service';
import { IamService } from './iam.service';
import { S3Service } from './s3.service';

@Module({
  controllers: [AWSController],
  providers: [
    AWSService,
    DynamoDBService,
    SNSService,
    IamService,
    S3Service
  ],
  exports: [
    AWSService,
    DynamoDBService,
    SNSService,
    IamService,
    S3Service
  ],
})
export class AWSModule { }
