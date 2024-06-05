import { Test, TestingModule } from '@nestjs/testing';
import { AWSService } from './aws.service';

describe('AwsService', () => {
  let service: AWSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AWSService],
    }).compile();

    service = module.get<AWSService>(AWSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
