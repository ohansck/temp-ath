import { Injectable, Logger } from '@nestjs/common';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommandInput, GetCommand, PutCommand, ScanCommand, UpdateCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDBService {
    private readonly ddbClient: DynamoDBDocumentClient;
    private readonly logger = new Logger(DynamoDBService.name);

    constructor() {
        const dynamoDBClient = new DynamoDBClient();

        this.ddbClient = DynamoDBDocumentClient.from(dynamoDBClient);
    }

    async getAllEmailsFromTable(tableName: string): Promise<string[]> {
        const params: ScanCommandInput = {
            TableName: tableName,
            ProjectionExpression: 'email',
        };

        try {
            const data = await this.ddbClient.send(new ScanCommand(params));
            const emails = data.Items?.map((item) => item.email) || [];
            this.logger.log(`Fetched ${emails.length} emails from DynamoDB table: ${tableName}`);
            return emails;
        } catch (error) {
            this.logger.error(`Failed to fetch emails from DynamoDB table: ${error.message}`);
            throw new Error(`Failed to fetch emails: ${error.message}`);
        }
    }

    async updateEmailsInTable(tableName: string, emails: string[], newField: string, newValue: any): Promise<void> {
        try {
            const updatePromises = emails.map((email) => {
                const command = new UpdateCommand({
                    TableName: tableName,
                    Key: { email }, // Assuming 'email' is the primary key
                    UpdateExpression: `set ${newField} = :newValue`,
                    ExpressionAttributeValues: {
                        ':newValue': newValue,
                    },
                    ReturnValues: "ALL_NEW",
                });

                return this.ddbClient.send(command);
            });
            await Promise.all(updatePromises);
            this.logger.log(`Updated ${emails.length} emails in DynamoDB table: ${tableName}`);
        } catch (error) {
            this.logger.error(`Failed to update emails in DynamoDB table: ${error.message}`);
            throw new Error(`Failed to update emails: ${error.message}`);
        }
    }
}
