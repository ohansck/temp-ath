import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get('hello')
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // @Get('details')
  // getBackendDetails(): string {
  //   return this.appService.welcomeMessage();
  // }
}

@Controller('/health')
export class HealthController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.checkHealth();
  }
}
