import { Injectable } from '@nestjs/common';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailjetService {
    private readonly mailjet;

    constructor() {
        this.mailjet = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY,
            process.env.MAILJET_SECRET_KEY
        );
    }

    async sendEmail(to: string, subject: string, text: string, html: string): Promise<any> {
        const request = this.mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_FROM_EMAIL,
                        Name: process.env.MAILJET_FROM_NAME,
                    },
                    To: [
                        {
                            Email: to,
                            Name: to,
                        },
                    ],
                    Subject: subject,
                    TextPart: text,
                    HTMLPart: html,
                },
            ],
        });

        try {
            const result = await request;
            return result.body;
        } catch (error) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}
