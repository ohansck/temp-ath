import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBService } from './dynamo.service';
import { SNSService } from './sns.service';
import { IamService } from './iam.service';
import { S3Service } from './s3.service';

@Injectable()
export class AWSService {
  private readonly logger = new Logger(AWSService.name);
  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly snsService: SNSService,
    private readonly iamService: IamService,
    private readonly s3Service: S3Service
  ) { }

  async subscribeAllEmailsToSNSTopic(): Promise<void> {
    const tableName = '';
    const topicArn = '';

    try {
      const emails = await this.dynamoDBService.getAllEmailsFromTable(tableName);
      await this.snsService.subscribeEmailsToSNSTopic(emails, topicArn);
      this.logger.log('emails here', emails);
      await this.dynamoDBService.updateEmailsInTable(tableName, emails, 'subscribed', true);
    } catch (error) {
      throw new Error(`Failed to subscribe all emails to SNS topic: ${error.message}`);
    }
  }

  async getAllEmailsAsCommaSeparatedString(): Promise<string> {
    const tableName = 'prod-expedition-users';
    try {
      const emails = await this.dynamoDBService.getAllEmailsFromTable(tableName);
      return emails.join(',');
    } catch (error) {
      throw new Error(`Failed to fetch emails as comma-separated string: ${error.message}`);
    }
  }

  async getAwsUser(user: string) {
    return this.iamService.getUserDetails(user);
  }
}
