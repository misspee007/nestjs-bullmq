import { Controller, Get, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller()
export class SmsController {
  constructor(@InjectQueue('sms') private readonly smsQueue: Queue) {}

  @Post('send-sms')
  async sendSmsJob(): Promise<string> {
    await this.smsQueue.add(
      'send-sms-job',
      {
        phoneNumber: '+1234567890',
        message: 'Hello from NestJS!',
      },
      {
        jobId: `sms-job-${Date.now()}`,
      },
    );
    return 'SMS job added to the queue';
  }
}
