import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AWSModule } from './aws/aws.module';
import { AWSService } from './aws/aws.service';
import { SNSService } from './aws/sns.service';
import { DynamoDBService } from './aws/dynamo.service';
import { AWSController } from './aws/aws.controller';
import { IamService } from './aws/iam.service';
import { TasksModule } from './tasks/tasks.module';
import { S3Service } from './aws/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   entities: [Book],
    //   synchronize: true,
    // }),
    AWSModule,
    TasksModule,
  ],
  controllers: [
    AppController,
    AWSController
  ],
  providers: [
    AppService,
    AWSService,
    SNSService,
    DynamoDBService,
    IamService,
    S3Service
  ],
})
export class AppModule { }
