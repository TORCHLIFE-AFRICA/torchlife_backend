import { Test, TestingModule } from '@nestjs/testing';
import { EmailTransportService } from './email-transport.service';

describe('EmailTransportService', () => {
  let service: EmailTransportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailTransportService],
    }).compile();

    service = module.get<EmailTransportService>(EmailTransportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
