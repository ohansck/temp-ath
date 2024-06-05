import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, SubscribeCommand } from '@aws-sdk/client-sns';

@Injectable()
export class SNSService {
    private readonly snsClient: SNSClient;
    private readonly logger = new Logger(SNSService.name);

    constructor() {
        this.snsClient = new SNSClient();
    }

    async subscribeEmailsToSNSTopic(emails: string[], topicArn: string): Promise<{
        status: boolean;
    }> {
        const subscribePromises = emails.map((email) => {
            const params = {
                Protocol: 'email',
                TopicArn: topicArn,
                Endpoint: email,
            };

            return this.snsClient.send(new SubscribeCommand(params));
        });

        try {
            await Promise.all(subscribePromises);
            this.logger.log(`Successfully subscribed emails to SNS topic: ${topicArn}`);
            return { status: true }
        } catch (error) {
            this.logger.error(`Failed to subscribe emails to SNS topic: ${error.message}`);
            return { status: false }

        }
    }
}
