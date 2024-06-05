import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class AppService {
  private readonly logger: Logger;

  constructor() {
    // super();
    this.logger = new Logger('AppService');
  }
  getHello(): string {
    return 'Hello World!';
  }

  checkHealth(): string {
    return 'OK';
  }

  welcomeMessage(): string {
    this.logger.log('Welcome to AtheriaHq Backend');
    return `AtheriaHq Backend | Environment: Dev | Version: 1.0.0`;
  }
}
