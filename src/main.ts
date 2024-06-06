import * as winston from 'winston';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonTransports } from './utilities/winstonLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  const config = new DocumentBuilder()
    .setTitle('AtheriaHQ Academy (beta)')
    .setDescription('Test endpoints for tasks')
    .setVersion('1.0.1')
    .addTag('tech')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/doc', app, document);

  app.useLogger(
    WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      transports: [winstonTransports.console, winstonTransports.combinedFile, winstonTransports.errorFile]
    })
  );

  const port = process.env.PORT || 80;
  await app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}
bootstrap();
