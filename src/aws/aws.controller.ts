import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { AWSService } from './aws.service';
import { CreateAwDto } from './dto/create-aw.dto';
import { UpdateAwDto } from './dto/update-aw.dto';
import { Response } from 'express';
import { S3Service } from './s3.service';
import { IamService } from './iam.service';

// @Controller('aws')
// export class AWSController {
//   constructor(private readonly awsService: AWSService) { }

//   // @Post()
//   // create(@Body() createAwDto: CreateAwDto) {
//   //   return this.awsService.create(createAwDto);
//   // }

//   @Get()
//   subscribeAll() {
//     return this.awsService.subscribeAllEmailsToSNSTopic();
//   }

//   @Get('emails-to-string')
//   emailToString() {
//     return this.awsService.getAllEmailsAsCommaSeparatedString();
//   }

//   @Get('user/:userName')
//   async getUser(@Param('userName') userName: string, @Res() res: Response) {
//     try {
//       const userDetails = await this.awsService.getAwsUser(userName);
//       return res.status(HttpStatus.OK).json(userDetails);
//     } catch (error) {
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
//     }
//   }
//   // @Patch(':id')
//   // update(@Param('id') id: string, @Body() updateAwDto: UpdateAwDto) {
//   //   return this.awsService.update(+id, updateAwDto);
//   // }

//   // @Delete(':id')
//   // remove(@Param('id') id: string) {
//   //   return this.awsService.remove(+id);
//   // }
// }

@Controller('aws')
export class AWSController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly iamService: IamService
  ) { }

  @Get('s3/list-buckets')
  async listBuckets() {
    return this.s3Service.listBuckets();
  }

  @Get('s3/bucket-exists/:bucketName')
  async bucketExists(@Param('bucketName') bucketName: string) {
    return this.s3Service.bucketExists(bucketName);
  }

  @Get('s3/bucket-details/:bucketName')
  async getBucketDetails(@Param('bucketName') bucketName: string) {
    return this.s3Service.getBucketDetails(bucketName);
  }

  @Get('iam/user-policies/:userName')
  async getUserPolicies(@Param('userName') userName: string) {
    return 'Pending';
    // return this.iamService.getUserPolicyStatements(userName);
  }

  @Get('iam/role-policies/:roleName')
  async getRolePolicies(@Param('roleName') roleName: string) {
    return 'Pending';
    // return this.iamService.getRolePolicyStatements(roleName);
  }

  @Get('iam/attached-policies')
  async getAttachedPolicies() {
    return 'Pending';
    // return this.iamService.getAttachedPolicies();
  }
}
